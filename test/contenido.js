import { cargarComponente, matrizRegistro } from '../funciones.js';

window.onload = async function () {
    //console.log("Verificando sesión...");

    try {
        // Verificar sesión antes de cargar los componentes
        //await init();
        //console.log("dios llego")
        //console.log(localStorage.getItem("user"))

        // Cargar componentes solo si la sesión es válida
        await Promise.all([
            cargarComponente('../content/sidebar.html', 'custom-sidebar'),
            cargarComponente('../content/header.html', 'custom-header-placeholder'),
            cargarComponente('../content/content.html', 'custom-content-placeholder')
        ]);

        console.log('Componentes cargados exitosamente');

        // Obtener la matriz usando await
        const matriz = await matrizRegistro();
        console.log(matriz)
        document.getElementById("crearCatastro").addEventListener("click", function () {
            if (matriz.cliente === 0) window.location.href = '../../cliente/cliente.html';
            else if (matriz.cliente === 1) window.location.href = '../../../ubicacion/ubicacion.html';
            else if (matriz.ubicacion === 1) window.location.href = '../../inmueble/inmueble.html';
            else if (matriz.inmueble === 1) window.location.href = '../../medidor/medidor.html';
            else if (matriz.medidor === 1) window.location.href = '../../puntos_agua/puntos_agua.html';
            else if (matriz.puntos_agua === 1) window.location.href = '../../catastro/catastro.html';
        });

    } catch (error) {
        console.error("Hubo un problema al cargar la página:", error);
    }
};
