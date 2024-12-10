import { cargarComponente, verificarToken } from './funciones.js';

window.onload = async function () {
    try {
        // Cargar componentes
        await Promise.all([
            cargarComponente('content/sidebar.html', 'custom-sidebar'),
            cargarComponente('content/header.html', 'custom-header-placeholder'),
            cargarComponente('content/content.html', 'custom-content-placeholder')
        ]);

        console.log('Componentes cargados exitosamente');

        // Obtener el botón después de cargar los componentes
        const botonValidarUsuario = document.getElementById("validarUsuario");

        if (botonValidarUsuario) {
            botonValidarUsuario.addEventListener('click', async () => {
                console.log('Validando token...');
                const esValido = await verificarToken(); // Ejecuta la función verificarToken
                if (esValido) {
                    alert('¡Token válido! Usuario autenticado.');
                } else {
                    alert('Token inválido. Redirigiendo al inicio de sesión.');
                }
            });
            console.log("Botón 'validarUsuario' asociado exitosamente.");
        } else {
            console.error("El botón 'validarUsuario' no se encontró en el DOM.");
        }

    } catch (error) {
        console.error("Hubo un problema al cargar la página:", error);
    }
};
