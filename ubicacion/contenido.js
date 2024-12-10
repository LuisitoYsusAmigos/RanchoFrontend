import { cargarComponente, mensajeExitoso, matrizRegistro } from '../funciones.js';  
window.onload = async function () {
    try {
        // Cargar sidebar, header y content en paralelo
        await Promise.all([
            cargarComponente('../content/sidebar.html', 'custom-sidebar'),
            cargarComponente('../content/header.html', 'custom-header-placeholder'),
            cargarComponente('../ubicacion/crear.html', 'custom-content-placeholder') // Aquí cargamos el formulario
        ]);
        console.log('Componentes cargados exitosamente');

        // Asegúrate de que el formulario esté disponible ahora
        const form = document.getElementById('ubicacionForm');
        
        // Verificar si el formulario fue cargado
        if (form) {
            console.log("Formulario encontrado");
            form.addEventListener('submit', async function (event) {
                event.preventDefault(); // Evita que el formulario redirija la página

                // Recopilar los datos del formulario
                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());

                try {
                    // Envía la solicitud con fetch
                    const response = await fetch(form.action, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    });

                    const result = await response.json();
                    console.log(result);

                    // Aquí puedes manejar la respuesta sin redirigir la página
                    if (result.status) {
                        window.location.href = '/inmueble/inmueble.html';
                    } else {
                        alert('Error al registrar el cliente: ' + result.msg);
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            });
        } else {
            console.error('El formulario no se encontró');
        }
    } catch (error) {
        console.error('Hubo un problema:', error);
    }
};
