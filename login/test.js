import { cargarComponente, mensajeExitoso, matrizRegistro, verificarToken, logout } from '../funciones.js';  

window.onload = async function () {
    try {
        // Cargar sidebar, header y content en paralelo
        await Promise.all([
            cargarComponente('../content/sidebar.html', 'custom-sidebar'),
            cargarComponente('../content/header.html', 'custom-header-placeholder')
            
        ]);
        const user = JSON.parse(localStorage.getItem("user"));
        await verificarToken()

        
        const usuario="hola"
        console.log(user)
        document.getElementById('custom-content-placeholder').innerHTML=usuario
        console.log('Componentes cargados exitosamente');


        // Esperar hasta que el contenido se haya cargado completamente
        
        
        // Asegurarse de que el formulario existe antes de añadir el event listener

    } catch (error) {
        console.error('Hubo un problema:', error);
    }
};
