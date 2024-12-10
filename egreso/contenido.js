import { cargarComponente, mensajeExitoso, obtenerFechaLocal } from '../funciones.js';  
window.onload = async function () {
    try {
        // Cargar sidebar, header y content en paralelo
        await Promise.all([
            cargarComponente('../content/sidebar.html', 'custom-sidebar'),
            cargarComponente('../content/header.html', 'custom-header-placeholder'),
            cargarComponente('../egreso/crear.html', 'custom-content-placeholder')
        ]);
        console.log('Componentes cargados exitosamente');


        // Esperar hasta que el contenido se haya cargado completamente
        const form = document.getElementById('egresoForm');
        
        // Asegurarse de que el formulario existe antes de añadir el event listener
        if (form) {
            const user = JSON.parse(localStorage.getItem("user"));
            const datosUser = user.datosUsuario[0];
            document.getElementById('fecha').value = obtenerFechaLocal();
            //console.log("dios esta presente")
            document.getElementById('id_usuario').value = datosUser.id;
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
                        mensajeExitoso("El egreso se registró exitosamente", "custom-content-placeholder");
                        window.location.href = '/egreso/index.html'
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
