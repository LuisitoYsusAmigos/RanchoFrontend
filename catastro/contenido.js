import { cargarComponente, mensajeExitoso, obtenerIdsRegistroCatastro, matrizRegistro } from '../../funciones.js';

window.onload = async function () {
    try {
        await Promise.all([
            cargarComponente('../../content/sidebar.html', 'custom-sidebar'),
            cargarComponente('../../content/header.html', 'custom-header-placeholder'),
            cargarComponente('../../catastro/crear.html', 'custom-content-placeholder')
        ]);

        const idsRegistroCatastro = await obtenerIdsRegistroCatastro();
        const form = document.getElementById('catastroForm');
        const user = JSON.parse(localStorage.getItem("user"));
        const datosUser = user.datosUsuario[0];

        // Declaración de clienteSeleccionadoId fuera de los eventos
        let clienteSeleccionadoId = null;

        if (form && idsRegistroCatastro.sonIguales == 1) {
            document.getElementById('id_ubicacion').value = idsRegistroCatastro.max_ubicacion;
            document.getElementById('id_inmueble').value = idsRegistroCatastro.max_inmueble;
            document.getElementById('id_medidor').value = idsRegistroCatastro.max_medidor;
            document.getElementById('id_puntos_agua').value = idsRegistroCatastro.max_puntos_agua;
            document.getElementById('id_usuario').value = datosUser.id;
        }

        if (form) {
            form.addEventListener('submit', async function (event) {
                event.preventDefault();

                // Asegurarse de que el valor de clienteSeleccionadoId esté en el input oculto id_cliente
                document.getElementById('id_cliente').value = clienteSeleccionadoId;

                const formData = new FormData(form);
                const data = Object.fromEntries(formData.entries());

                // Asignar el valor seleccionado directamente a data.id_cliente
                data.id_cliente = clienteSeleccionadoId;

                const clienteSearch = document.getElementById("clienteSearch");
                const clienteId = document.getElementById("id_cliente");

                // Verifica si el campo cliente está vacío
                if (clienteSearch && (clienteSearch.value.trim() === "" || clienteId.value.trim() === "")) {
                    clienteSearch.focus();
                } else {
                    // Muestra el ID del cliente seleccionado en el alert y el objeto data en console.log
                    //alert(`Todo llegó bien. ID del cliente seleccionado: ${clienteSeleccionadoId}`);
                    console.log(data);  // Asegura que id_cliente ahora tiene el valor seleccionado

                    try {
                        const response = await fetch("http://localhost:3000/catastro/create", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(data)
                        });

                        const result = await response.json();
                        console.log("Respuesta de la API:", result);

                        if (result.status) {
                            console.log("El catastro se creó exitosamente");
                            window.location.href = '/catastro/index.html'
                        } else {
                            console.error("Error al crear el catastro:", result.msg);
                        }

                    } catch (error) {
                        console.error("Error al enviar datos a la API:", error);
                    }
                }
            });
        }

        // Código para los eventos del dropdown y búsqueda de clientes
        const clienteSearchInput = document.getElementById('clienteSearch');
        const clienteDropdown = document.getElementById('clienteDropdown');
        const limpiarBusquedaBtn = document.getElementById('limpiarBusqueda');

        if (clienteSearchInput) {
            clienteSearchInput.addEventListener("input", function () {
                const clienteError = document.getElementById("clienteError");
                if (clienteError) {
                    clienteError.style.display = "none";
                }
            });
        }

        if (clienteSearchInput && clienteDropdown && limpiarBusquedaBtn) {
            let clientes = [];

            fetch("http://localhost:3000/cliente/index")
                .then(response => response.json())
                .then(data => {
                    if (data.status) clientes = data.value;
                    else alert('Error al cargar clientes');
                })
                .catch(error => console.error('Error al obtener los clientes:', error));

            clienteSearchInput.addEventListener('input', function () {
                const busqueda = clienteSearchInput.value.toLowerCase();
                const clientesFiltrados = clientes.filter(cliente =>
                    cliente.nombre.toLowerCase().includes(busqueda) ||
                    cliente.apellidos.toLowerCase().includes(busqueda) ||
                    cliente.ci.includes(busqueda)
                );
                mostrarClientes(clientesFiltrados);
            });

            function mostrarClientes(clientesFiltrados) {
                clienteDropdown.innerHTML = '';
                if (clientesFiltrados.length > 0 && clienteSearchInput.value !== '') {
                    clientesFiltrados.forEach(cliente => {
                        const button = document.createElement('button');
                        button.className = 'dropdown-item';
                        button.type = 'button';
                        button.dataset.id = cliente.id;
                        button.textContent = `${cliente.nombre} ${cliente.apellidos} - CI: ${cliente.ci}`;
                        clienteDropdown.appendChild(button);
                    });
                    clienteDropdown.style.display = 'block';
                } else {
                    clienteDropdown.style.display = 'none';
                }
            }

            clienteDropdown.addEventListener('click', function (event) {
                if (event.target.classList.contains('dropdown-item')) {
                    clienteSeleccionadoId = event.target.dataset.id; // Asigna el ID del cliente seleccionado
                    clienteSearchInput.value = event.target.textContent;
                    clienteSearchInput.disabled = true;
                    clienteDropdown.style.display = 'none';
                    document.getElementById('id_cliente').value = clienteSeleccionadoId; // Asigna el ID al input oculto
                }
            });

            limpiarBusquedaBtn.addEventListener('click', function () {
                clienteSearchInput.value = '';
                clienteSearchInput.disabled = false;
                clienteSeleccionadoId = null; // Restablece el ID del cliente
                clienteDropdown.style.display = 'none';
            });
        } else {
            console.error('Algunos elementos no se encontraron en el DOM');
        }

    } catch (error) {
        console.error('Hubo un problema:', error);
    }
};

