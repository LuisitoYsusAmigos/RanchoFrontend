import { cargarComponente, mensajeExitoso, matrizRegistro } from '../../funciones.js';
window.onload = async function () {
    try {
        // Cargar sidebar, header y content en paralelo
        await Promise.all([
            cargarComponente('../../content/sidebar.html', 'custom-sidebar'),
            cargarComponente('../../content/header.html', 'custom-header-placeholder'),
            cargarComponente('../../cliente/crear.html', 'custom-content-placeholder')
        ]);
        console.log('Componentes cargados exitosamente');
        const getQueryParameter = (param) => {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get(param);
        };

        // Obtener el id de la URL
        const catastroId = getQueryParameter('id');
        console.log(`ID del catastro: ${catastroId}`);

        // Llamada PUT a la API
        const response = await fetch(`https://ranchoback.api.dev.dtt.tja.ucb.edu.bo/cliente/cliente/edit/${catastroId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: catastroId })
        });

        if (!response.ok) {
            throw new Error(`Error al llamar a la API: ${response.statusText}`);
        }
        const form = document.getElementById('clienteForm');
        let data = await response.json();
        if(data.status==true){
            //alert(data.ci)
            document.getElementById('clienteForm').action = `https://ranchoback.api.dev.dtt.tja.ucb.edu.bo/cliente/cliente/update/${catastroId}`;
            data = data.value[0]
            console.log(data);
            document.getElementById('id').value = catastroId
            document.getElementById('ci').value = data.ci 
            document.getElementById('nombre').value = data.nombre
            document.getElementById('apellidos').value = data.apellidos
            document.getElementById('fecha_nacimiento').value = data.fecha_nacimiento.substring(0, 10)
            document.getElementById('cel').value = data.cel        
        }else{
            alert("error en la carga del elemento")
        }

        if (form) {
            //alert("si llega")
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
                        //mensajeExitoso("El Cliente se registró exitosamente", "custom-content-placeholder");
                        window.location.href = '/cliente/index.html'
                        
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

        



        // Mostrar un mensaje de éxito o actualizar el contenido según la respuesta de la API
        

    } catch (error) {
        console.error('Hubo un problema:', error);
    }
};