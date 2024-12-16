import { cargarComponente, convertHtmlPdf } from '../../../funciones.js';

let dataTable;
let dataTableIsInitialized = false;

const dataTableOptions = {
    columnDefs: [
        { className: "centered", targets: [0, 1, 2, 3, 4, 5] },
        { searchable: false, targets: [1] }
    ],
    pageLength: 100,
    destroy: true,
    order: [[0, "desc"]],
    searching: false,
    lengthChange: false,
    info: false,
    paginate: false,

    
    language: {
        lengthMenu: "Mostrar _MENU_ registros por página",
        zeroRecords: "Ningún usuarioLectura encontrado",
        info: "Mostrando de _START_ a _END_ de un total de _TOTAL_ registros",
        infoEmpty: "Ningún usuarioLectura encontrado",
        infoFiltered: "(filtrados desde _MAX_ registros totales)",
        search: "Buscar:",
        loadingRecords: "Cargando...",
        emptyTable: "No hay Lecturas registradas todavía",
        paginate: {
            first: "Primero",
            last: "Último",
            next: "Siguiente",
            previous: "Anterior"
        }
    }
};

const initDataTable = async () => {
    if (dataTableIsInitialized) {
        dataTable.destroy();
    }
    await listUsers();
    dataTable = $("#datatable_users").DataTable(dataTableOptions);
    dataTableIsInitialized = true;
};

const listUsers = async () => {
    try {
        const urlParams = new URLSearchParams(window.location.search);
        const idRecibo = urlParams.get('id');
        console.log("ID del recibo:", idRecibo);

        const response = await fetch(`https://ranchoback.api.dev.dtt.tja.ucb.edu.bo/recibo/detalleRecibo/${idRecibo}`);
        console.log("Respuesta de la API:", response);

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Datos recibidos:", data);

        if (data.status) {
            const usuariosLecturas = data.value;
            console.log("Usuarios Lecturas:", usuariosLecturas);

            if (dataTableIsInitialized) {
                dataTable.clear().draw(); // Limpiar contenido sin destruir DataTable
            }

            let content = ``;
            usuariosLecturas.forEach((usuarioLectura) => {
                // Validar y formatear fecha
                let fechaFormateada = "Fecha inválida";
                if (usuarioLectura.fecha_lectura && !isNaN(new Date(usuarioLectura.fecha_lectura).getTime())) {
                    const fecha = new Date(usuarioLectura.fecha_lectura);
                    const dia = String(fecha.getDate()).padStart(2, '0');
                    const mes = String(fecha.getMonth() + 1).padStart(2, '0');
                    const año = fecha.getFullYear();
                    fechaFormateada = `${dia}-${mes}-${año}`;
                } else {
                    console.error("Fecha inválida encontrada:", usuarioLectura.fecha_lectura);
                }

                content += `
                <tr>
                    <td>${fechaFormateada}</td>
                    <td>${usuarioLectura.lectura_actual}</td>
                    <td>${usuarioLectura.lectura_anterior}</td>
                    <td>${usuarioLectura.consumo_m3}</td>
                    <td>${usuarioLectura.consumo_bs}</td>
                    <td>
                        ${usuarioLectura.pagado === 1
                            ? '<i class="fa-solid fa-check" style="color: green;"></i>'
                            : `<button class="btn btn-sm btn-danger pagoLectura-button" pagoLectura-id="${usuarioLectura.lectura_id}">  
                                <i class="fa-solid fa-times" style="color: white;"></i>    
                               </button>`}
                    </td>
                </tr>`;
            });

            document.getElementById('tableBody_users').innerHTML = content;

            // Event listener para el botón de la "X" roja
            document.querySelectorAll('.pagoLectura-button').forEach(button => {
                button.addEventListener('click', (event) => {
                    const pagoLecturaId = event.target.closest('button').getAttribute('pagoLectura-id');
                    alert(`ID de usuarioLectura: ${pagoLecturaId}`);
                });
            });

            if (!dataTableIsInitialized) {
                dataTable = $("#datatable_users").DataTable(dataTableOptions);
                dataTableIsInitialized = true;
            } else {
                dataTable.draw();
            }
        }

        // Eventos para crear lectura y recibo


    } catch (error) {
        alert("Error cargando los datos: " + error.message);
        console.error("Error cargando los datos:", error);
    }
};
// intento de pdf

// fin de intento pdf




window.onload = async function () {
    try {
        await Promise.all([
            cargarComponente('../../content/sidebar.html', 'custom-sidebar'),
            cargarComponente('../../content/header.html', 'custom-header-placeholder'),
        ]);
        console.log('Componentes cargados exitosamente');

        await initDataTable(); // Iniciar la tabla después de cargar los componentes
        document.getElementById('crearPdf').addEventListener('click', function() {
            //alert('funciona');
            convertHtmlPdf('TablaPdf')
        });
        

    } catch (error) {
        console.error('Hubo un problema:', error);
    }
};
