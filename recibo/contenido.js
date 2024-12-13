import { cargarComponente, obtenerFechaActual, matrizRegistro } from '../funciones.js';

const urlParams = new URLSearchParams(window.location.search);
const id_catastro = urlParams.get('id_catastro');
let consumoBs = 0;

window.onload = async function () {
    try {
        await Promise.all([
            cargarComponente('../content/sidebar.html', 'custom-sidebar'),
            cargarComponente('../content/header.html', 'custom-header-placeholder'),
            cargarComponente('../recibo/crear.html', 'custom-content-placeholder')
        ]);
        console.log('Components loaded successfully');

        const dataTableOptions = {
            columnDefs: [{ className: "centered", targets: [0, 1, 2, 3, 4, 5] }],
            pageLength: 10,
            order: [[0, "asc"]], // Ordenar por la columna 0 (fecha) en orden ascendente
            language: {
                lengthMenu: "Mostrar _MENU_ registros por página",
                zeroRecords: "No data available in table",
                info: "Mostrando de _START_ a _END_ de un total de _TOTAL_ registros",
                infoEmpty: "No data available in table",
                infoFiltered: "(filtrados desde _MAX_ registros totales)",
                search: "Buscar:",
                loadingRecords: "Cargando...",
                emptyTable: "No hay registros disponibles",
                paginate: {
                    first: "Primero",
                    last: "Último",
                    next: "Siguiente",
                    previous: "Anterior"
                }
            }
        };

        const loadData = async () => {
            try {
                const response = await fetch(`https://ranchoback.api.dev.dtt.tja.ucb.edu.bo/cliente/lectura/lecturasCatastroNoPagado/${id_catastro}`);
                const data = await response.json();
                if (data.status && data.value) {
                    const lecturasPagar = data.value.filter(item => !item.pagado);

                    let contentLecturasPagar = '';
                    lecturasPagar.forEach((item) => {
                        const fechaFormateada = new Date(item.fecha).toLocaleDateString('es-ES');
                        contentLecturasPagar += `<tr data-id="${item.id}">
                            <td>${fechaFormateada}</td>
                            <td>${item.lectura_actual}</td>
                            <td>${item.lectura_anterior}</td>
                            <td>${item.consumo_m3}</td>
                            <td>${item.consumo_bs}</td>
                            <td><button class="btn btn-sm btn-danger pagoLectura-button" pagoLectura-id="${item.id}">X</button></td>
                        </tr>`;
                    });
                    document.getElementById('tableBody_lecturas_pagar').innerHTML = contentLecturasPagar;

                    // Verificar si DataTable existe, destruirla si es necesario
                    if ($.fn.DataTable.isDataTable('#datatable_lecturas_pagar')) {
                        $('#datatable_lecturas_pagar').DataTable().destroy();
                    }

                    // Inicializar DataTable después de cargar el contenido
                    $("#datatable_lecturas_pagar").DataTable(dataTableOptions);
                } else {
                    console.log("No data found in response");
                }
                updateTotalConsumo(); // Calcular el total después de cargar los datos
            } catch (error) {
                console.error("Error cargando los datos:", error);
            }
        };

        const updateTotalConsumo = () => {
            let totalConsumo = 0;
            consumoBs = totalConsumo;

            document.querySelectorAll('#datatable_lecturas_pagar tbody tr').forEach(row => {
                const consumoBsCell = row.cells[4];
                const button = row.querySelector('.pagoLectura-button');

                if (button.classList.contains('btn-warning')) {
                    totalConsumo += parseFloat(consumoBsCell.textContent) || 0;
                }
            });
            consumoBs = totalConsumo;
            document.getElementById('totalConsumo').textContent = totalConsumo.toFixed(2);
        };

        const marcarComoPendiente = () => {
            const rows = Array.from(document.querySelectorAll('#datatable_lecturas_pagar tbody tr')).filter(row => {
                const button = row.querySelector('.pagoLectura-button');
                return button && button.classList.contains('btn-danger');
            });

            if (rows.length === 0) return alert("No hay lecturas para pagar.");

            let minIdRow = rows[0];
            rows.forEach(row => {
                const rowId = parseInt(row.getAttribute('data-id'));
                const minId = parseInt(minIdRow.getAttribute('data-id'));
                if (rowId < minId) minIdRow = row;
            });

            const button = minIdRow.querySelector('.pagoLectura-button');
            button.classList.remove('btn-danger');
            button.classList.add('btn-warning');
            button.textContent = 'Pendiente';

            updateTotalConsumo();
        };

        const revertPendiente = () => {
            const rows = Array.from(document.querySelectorAll('#datatable_lecturas_pagar tbody tr')).filter(row => {
                const button = row.querySelector('.pagoLectura-button');
                return button && button.classList.contains('btn-warning');
            });

            if (rows.length === 0) return alert("No hay lecturas marcadas como 'Pendiente'.");

            let maxIdRow = rows[0];
            rows.forEach(row => {
                const rowId = parseInt(row.getAttribute('data-id'));
                const maxId = parseInt(maxIdRow.getAttribute('data-id'));
                if (rowId > maxId) maxIdRow = row;
            });

            const button = maxIdRow.querySelector('.pagoLectura-button');
            button.classList.remove('btn-warning');
            button.classList.add('btn-danger');
            button.textContent = 'X';

            updateTotalConsumo();
        };

        document.getElementById('quitarLectura').addEventListener('click', revertPendiente);
        document.getElementById('aumentarLectura').addEventListener('click', marcarComoPendiente);
        document.getElementById('crearRecibo').addEventListener('click', async function () {
            const idsLectura = Array.from(document.querySelectorAll('#datatable_lecturas_pagar tbody tr'))
                .filter(row => row.querySelector('.pagoLectura-button').classList.contains('btn-warning'))
                .map(row => row.getAttribute('data-id'));

            if (idsLectura.length === 0) {
                alert("No hay lecturas seleccionadas");
                return;
            }

            const userData = JSON.parse(localStorage.getItem("user"));
            const fecha = obtenerFechaActual();
            const maxReciboId = await (await fetch("https://ranchoback.api.dev.dtt.tja.ucb.edu.bo/cliente/recibo/obtenerReciboIdMax")).json();
            const id_recibo = maxReciboId.value[0].id_recibo;

            const reciboData = {
                monto_total: consumoBs.toFixed(2),
                fecha: fecha,
                id_usuario: userData.datosUsuario[0].id,
            };

            fetch("https://ranchoback.api.dev.dtt.tja.ucb.edu.bo/cliente/recibo/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(reciboData)
            })
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Error en la solicitud");
                    }
                    return response.json();
                })
                .then(data => {
                    console.log("ids de las lecturas")
                    console.log(idsLectura)
                    
                    for (const id of idsLectura) {
                        const lecturaReciboData = {
                            id_lectura: id,
                            id_recibo: id_recibo
                        };
                        fetch("https://ranchoback.api.dev.dtt.tja.ucb.edu.bo/cliente/lecturaRecibo/create", {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify(lecturaReciboData)
                        });
                    }
                    location.reload();
                    
                })
                .catch(error => {
                    console.error("Error al enviar los datos:", error);
                });
        });

        await loadData();
    } catch (error) {
        console.error('Hubo un problema:', error);
    }
};
