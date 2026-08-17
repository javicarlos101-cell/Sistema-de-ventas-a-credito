// =====================================
// CrediFlow v0.1
// Archivo principal
// =====================================

console.log("✅ CrediFlow iniciado correctamente.");

// Mensaje temporal al presionar Guardar
const btnGuardar = document.querySelector(".btnGuardar");

if (btnGuardar) {
    btnGuardar.addEventListener("click", function () {
        alert("Configuración guardada (versión MVP)");
    });
}