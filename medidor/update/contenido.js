import { cargarComponente, mensajeExitoso, matrizRegistro } from '../../funciones.js';
window.onload = async function () {
    try {
        // Cargar sidebar, header y content en paralelo
        await Promise.all([
            cargarComponente('../../content/sidebar.html', 'custom-sidebar'),
            cargarComponente('../../content/header.html', 'custom-header-placeholder'),
            cargarComponente('../crear.html', 'custom-content-placeholder')
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
        const response = await fetch(`https://ranchoback.api.dev.dtt.tja.ucb.edu.bo/medidor/edit/${catastroId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: catastroId })
        });

        if (!response.ok) {
            throw new Error(`Error al llamar a la API: ${response.statusText}`);
        }
        //const form = document.getElementById('medidorForm');
        const form = document.getElementById('medidorForm');
        let data = await response.json();
        console.log(data.value[0])
        if (data.status == true) {
            //alert(data.ci)
            document.getElementById('medidorForm').action = `https://ranchoback.api.dev.dtt.tja.ucb.edu.bo/medidor/update/${catastroId}`;
            data = data.value[0]
           // console.log(data);
            document.getElementById('id').value = catastroId
            document.getElementById('numero_medidor').value = data.numero_medidor
            document.getElementById('diametro_tuberia').value = data.diametro_tuberia
            document.getElementById('marca_medidor').value = data.marca_medidor
            document.getElementById('lectura_actual_medidor').value = data.lectura_actual_medidor
            document.getElementById('tipo_medidor').value = data.tipo_medidor
            document.getElementById('localizacion_caja').value = data.localizacion_caja
            document.getElementById('estado_medidor').checked = data.estado_medidor
            document.getElementById('banner').innerHTML ="" //`<button type="button" class="btn btn-primary" id="puntos_agua">Editar puntos de agua</button>`;
            // Agrega el event listener después de que el botón se ha insertado en el DOM
            /*document.getElementById('puntos_agua').addEventListener("click", function () {
                alert("Botón 'Editar puntos de agua' presionado");
                window.location.href = `../../puntos_agua/update/index.html?id=${catastroId}`;
            });*/
        } else {
            alert("error en la carga del elemento")
        }
        if (form) {
            //alert("si llega")
            form.addEventListener('submit', async function (event) {
                event.preventDefault(); // Evita que el formulario redirija la página
            
                // Recopilar los datos del formulario
                const formData = new FormData(form);
                let data = Object.fromEntries(formData.entries());
            
                // Convertir el estado del checkbox a un valor adecuado (1 o 0, true o false, según tu backend)
                data.estado_medidor = document.getElementById('estado_medidor').checked ? 1 : 0;
            
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
                        window.location.href = '/catastro/index.html';
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