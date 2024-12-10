import { cargarComponente, mensajeExitoso, matrizRegistro } from '../funciones.js';  
window.onload = async function () {
    try {
        // Cargar sidebar, header y content en paralelo
        await Promise.all([
            cargarComponente('content/sidebar.html', 'custom-sidebar'),
            cargarComponente('content/header.html', 'custom-header-placeholder'),
            cargarComponente('content/content.html', 'custom-content-placeholder')
        ]);
        console.log('Componentes cargados exitosamente');

        // Obtener la matriz usando await
        const matriz = await matrizRegistro();
        console.log('Matriz obtenida:', matriz); // Aquí ya tienes la matriz disponible
        if(matriz.cliente==1){alert("hay cliente")}
            else if(matriz.ubicacion==1){alert("hay ubicacion")}
                else if(matriz.inmueble==1){alert("hay inmuble")}
                    else if(matriz.medidor==1){alert("hay medidor")}
                        else if(matriz.puntos_agua==1){alert(" hay un punto de agua y todo para catastro")}
                            

    } catch (error) {
        console.error('Hubo un problema:', error);
    }
};
