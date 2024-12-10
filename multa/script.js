import { cargarComponente, mensajeExitoso } from '../funciones.js';

let dataTable;
let dataTableIsInitialized = false;


const dataTableOptions = {
    columnDefs: [
        { className: "centered", targets: [0, 1, 2, 3, 4, 5, 6] }, // Ajustado para que coincida con las columnas de la tabla
        { orderable: false, targets: [4, 5] }, // Ajustado a las columnas donde no quieres ordenación
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
        const clientes = [
            {
                "id": 5,
                "observaciones": "Multa generada automáticamente #1",
                "inasistencia": false,
                "reconexion": false,
                "alto_consumo": true,
                "total": 446.00,
                "pagado": false,
                "id_tipo_multa": 1,
                "id_lectura": 1,
                "id_usuario": 1
            },
            {
                "id": 8,
                "observaciones": "Multa generada automáticamente #1",
                "inasistencia": true,
                "reconexion": false,
                "alto_consumo": true,
                "total": 446.00,
                "pagado": false,
                "id_tipo_multa": 1,
                "id_lectura": 1,
                "id_usuario": 1
            },
            {
                "id": 9,
                "observaciones": "Multa generada automáticamente #1",
                "inasistencia": true,
                "reconexion": false,
                "alto_consumo": false,
                "total": 446.00,
                "pagado": false,
                "id_tipo_multa": 1,
                "id_lectura": 2,
                "id_usuario": 1
            },
            {
                "id": 10,
                "observaciones": "Multa generada automáticamente #1",
                "inasistencia": true,
                "reconexion": false,
                "alto_consumo": false,
                "total": 446.00,
                "pagado": false,
                "id_tipo_multa": 1,
                "id_lectura": 3,
                "id_usuario": 1
            },
            {
                "id": 12,
                "observaciones": "Multa generada automáticamente #1",
                "inasistencia": true,
                "reconexion": false,
                "alto_consumo": false,
                "total": 446.00,
                "pagado": false,
                "id_tipo_multa": 1,
                "id_lectura": 4,
                "id_usuario": 1
            },
            {
                "id": 13,
                "observaciones": "Multa generada automáticamente #1",
                "inasistencia": true,
                "reconexion": false,
                "alto_consumo": false,
                "total": 446.00,
                "pagado": false,
                "id_tipo_multa": 1,
                "id_lectura": 4,
                "id_usuario": 1
            }
        ];

        if (dataTableIsInitialized) {
            dataTable.clear().draw();
        }

        let content = ``;
        const renderIcon = (value) => {
            return value
                ? `<span style="color: green; font-weight: bold;">✔️</span>` // Ícono verde
                : `<span style="color: red; font-weight: bold;">❌</span>`; // Ícono rojo
        };

        clientes.forEach((cliente) => {
            content += `
            <tr>
                <td>${cliente.id}</td>
                <td>${cliente.observaciones}</td>
                <td>${renderIcon(cliente.inasistencia)}</td>
                <td>${renderIcon(cliente.reconexion)}</td>
                <td>${renderIcon(cliente.alto_consumo)}</td>
                <td>${cliente.total.toFixed(2)}</td>
                <td>${renderIcon(cliente.pagado)}</td>
            </tr>`;
        });

        document.getElementById('tableBody_users').innerHTML = content;

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
    

    try {
        // Cargar sidebar, header y content en paralelo
        await Promise.all([
            cargarComponente('../content/sidebar.html', 'custom-sidebar'),
            cargarComponente('../content/header.html', 'custom-header-placeholder'),
            // cargarComponente('../content/content.html', 'custom-content-placeholder')
        ]);
        console.log('Componentes cargados exitosamente');

        await initDataTable(); // Iniciar la tabla después de cargar los componentes
        //document.getElementById("crearCatastro").addEventListener("click", function () {})



    } catch (error) {
        console.error('Hubo un problema:', error);
    }
};
