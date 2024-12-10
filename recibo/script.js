import { cargarComponente, mensajeExitoso } from '../funciones.js';

let dataTable;
let dataTableIsInitialized = false;

const dataTableOptions = {
    columnDefs: [
        { className: "centered", targets: [0, 1, 2, 3, 4, 5, 6,7] }, // Ajustado para incluir la nueva columna
        { orderable: false, targets: [5, 6] }, // Ajustado para desactivar la ordenación en las nuevas columnas
        { searchable: false, targets: [1] }
    ],
    pageLength: 10,
    destroy: true,
    language: {
        lengthMenu: "Mostrar _MENU_ registros por página",
        zeroRecords: "Ningún catastro encontrado",
        info: "Mostrando de _START_ a _END_ de un total de _TOTAL_ registros",
        infoEmpty: "Ningún catastro encontrado",
        infoFiltered: "(filtrados desde _MAX_ registros totales)",
        search: "Buscar:",
        loadingRecords: "Cargando...",
        paginate: {
            first: "Primero",
            last: "Último",
            next: "Siguiente",
            previous: "Anterior"
        }
    }
};

// Función para formatear la fecha al formato deseado
const formatFecha = (fechaISO) => {
    const fecha = new Date(fechaISO);
    const opcionesFecha = { day: '2-digit', month: '2-digit', year: 'numeric' };
    const opcionesHora = { hour: '2-digit', minute: '2-digit', hour12: false };

    const hora = fecha.toLocaleTimeString('es-ES', opcionesHora);
    const diaMesAño = fecha.toLocaleDateString('es-ES', opcionesFecha);

    return {
        hora,
        diaMesAño: diaMesAño.replace(/\//g, '-') // Cambia los separadores por guiones
    };
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
        const response = await fetch("http://localhost:3000/recibo/index");
        const data = await response.json();
        const clientes = data.value;

        if (dataTableIsInitialized) {
            dataTable.clear().draw(); // Limpiar contenido sin destruir DataTable
        }

        let content = ``;
        clientes.forEach((cliente, index) => {
            const { hora, diaMesAño } = formatFecha(cliente.fecha);

            content += `
            <tr>
                <td>${cliente.id}</td>
                <td>${cliente.monto_total}</td>
                <td>${diaMesAño}</td>
                <td>${hora}</td>
                <td>${cliente.usuario}</td>
                <td>${cliente.cliente}</td>
                <td>${cliente.cantidad_lecturas_recibo}</td>
                <td>
                <button class="btn btn-sm btn-primary recibo-button" recibo-id="${cliente.id}">
                    <i class="fa-solid fa-eye"></i>

                </button>
                </td>
            </tr>`;
        });

        document.getElementById('tableBody_users').innerHTML = content;

        document.querySelectorAll('.recibo-button').forEach(button => {
            button.addEventListener('click', (event) => {
                const reciboId = event.target.closest('button').getAttribute('recibo-id');
                //alert(`Hola Mundo: ${reciboId}`);
                window.location.href = `/recibo/reciboDetalle/index.html?id=${reciboId}`;
            });
        });

        if (!dataTableIsInitialized) {
            dataTable = $("#datatable_users").DataTable(dataTableOptions);
            dataTableIsInitialized = true;
        } else {
            dataTable.draw();
        }
    } catch (error) {
        alert("Error cargando los datos: " + error);
    }
};

window.onload = async function () {
    document.getElementById("crearCliente").addEventListener("click", function () {
        window.location.href = '../cliente/cliente.html';
    });
    try {
        // Cargar sidebar, header y content en paralelo
        await Promise.all([
            cargarComponente('../content/sidebar.html', 'custom-sidebar'),
            cargarComponente('../content/header.html', 'custom-header-placeholder'),
        ]);
        console.log('Componentes cargados exitosamente');

        await initDataTable(); // Iniciar la tabla después de cargar los componentes
    } catch (error) {
        console.error('Hubo un problema:', error);
    }
};
