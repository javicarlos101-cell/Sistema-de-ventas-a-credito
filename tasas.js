/*
    MOTOR DE TASAS - CrediFlow
*/


const TASAS_STORAGE = "crediflow_tasas";


const tasas = {

bcv:0,

euro:0,

fecha:""

};



function guardarTasas(){


localStorage.setItem(

TASAS_STORAGE,

JSON.stringify(tasas)

);


localStorage.setItem(
"tasaBCV",
tasas.bcv
);


localStorage.setItem(
"tasaEURO",
tasas.euro
);


}



function cargarTasas(){


const datos =
localStorage.getItem(TASAS_STORAGE);



if(!datos){

return false;

}



try{


const obj =
JSON.parse(datos);



tasas.bcv =
Number(obj.bcv)||0;



tasas.euro =
Number(obj.euro)||0;



tasas.fecha =
obj.fecha||"";



return true;



}catch(e){


return false;


}



}



/*
    API BCV
*/


const API_BCV_1 = 
"https://rates.dolarvzla.com/bcv/current.json";


const API_BCV_2 = 
"https://ve.dolarapi.com/v1/dolares/oficial";



/*
    API EURO
*/


const API_EURO_1 =
"https://open.er-api.com/v6/latest/EUR";


const API_EURO_2 =
"https://api.exchangerate.host/latest?base=EUR&symbols=USD";




async function consultarAPI(url){


try{


const respuesta =
await fetch(url,{cache:"no-store"});



if(!respuesta.ok){

throw new Error();

}



return await respuesta.json();



}catch(error){


return null;


}


}





async function actualizarTasas(){


let tasaBCV = 0;

let tasaEURO = 0;




/*
    CONSULTA BCV 1
*/


let datos =
await consultarAPI(API_BCV_1);



if(datos && datos.current){


tasaBCV =
Number(datos.current.usd);



}




/*
    CONSULTA BCV 2
*/


if(!tasaBCV){


datos =
await consultarAPI(API_BCV_2);



if(datos && datos.promedio){


tasaBCV =
Number(datos.promedio);



}


}




/* ======================================================
        CONSULTA EURO 1
====================================================== */

datos =
await consultarAPI(
"https://rates.dolarvzla.com/bcv/current.json"
);

if(
datos &&
datos.current &&
datos.current.eur
){

tasaEURO =
Number(datos.current.eur);

}


/* ======================================================
        CONSULTA EURO 2
====================================================== */

if(!tasaEURO){

datos =
await consultarAPI(
"https://api.bcvapi.tech/api/v1/rates"
);

if(
datos &&
datos.eur
){

tasaEURO =
Number(datos.eur);

}

}




if(tasaBCV>0){

tasas.bcv=tasaBCV;

}



if(tasaEURO>0){

tasas.euro=tasaEURO;

}




if(
tasas.bcv>0 ||
tasas.euro>0
){


tasas.fecha =
new Date().toISOString();



guardarTasas();



console.log(
"Tasas actualizadas correctamente."
);



return true;



}




console.log(
"Se utilizarán las últimas tasas almacenadas."
);



cargarTasas();



return false;



}





function obtenerTasaBCV(){


return Number(tasas.bcv)||0;


}





function obtenerTasaEURO(){


return Number(tasas.euro)||0;


}





function convertirBCV(montoUSD){


return Number(montoUSD) *
obtenerTasaBCV();


}




function convertirEURO(montoUSD){


return Number(montoUSD) *
obtenerTasaEURO();


}




function convertirBolivares(montoUSD,tipo){


if(tipo==="EURO"){


return convertirEURO(montoUSD);


}


return convertirBCV(montoUSD);


}





function actualizarTasasFormulario(){

const tipo =
document.getElementById("tipoTasa");

const tasaCambio =
document.getElementById("tasaCambio");


if(!tipo || !tasaCambio){
return;
}


let tasa=0;


if(tipo.value==="EURO"){

tasa = Number(tasas.euro)||0;

}else{

tasa = Number(tasas.bcv)||0;

}


tasaCambio.value=tasa;


if(typeof calcularBolivares==="function"){

calcularBolivares();

}


}