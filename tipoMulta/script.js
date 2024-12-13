import { cargarComponente, mensajeExitoso } from '../funciones.js';

let dataTable;
let dataTableIsInitialized = false;


const dataTableOptions = {
    columnDefs: [
        { className: "centered", targets: [0, 1, 2, 3] }, // Ajustado para que coincida con las columnas de la tabla
        { orderable: false, targets: [2] }, // Ajustado a las columnas donde no quieres ordenación
        { searchable: false, targets: [1] }
    ],
    order: [[0, "desc"]], 
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
        const response = await fetch("https://ranchoback.api.dev.dtt.tja.ucb.edu.bo/cliente/cliente/index");
        const data = await response.json();
        console.log(data)
        const clientes = [
    {
        "id": 2,
        "fecha": "2024-08-01",
        "inasistencia": 2,
       // "reconexion": 3,
        "alto_consumo": 100,
//        "id_usuario": 1
    },{
        "id": 1,
        "fecha": "2024-07-01",
        "inasistencia": 4,
       // "reconexion": 3,
        "alto_consumo": 500,
//        "id_usuario": 1
    }
]
;


        if (dataTableIsInitialized) {
            dataTable.clear().draw(); // Limpiar contenido sin destruir DataTable
        }

        let content = ``;
        clientes.forEach((cliente, index) => {
            const fechaNacimiento = new Date(cliente.fecha);
            const fechaFormateada = fechaNacimiento.toISOString().slice(0, 10).split("-").reverse().join("-");
            //const tipo = clientes.valor ? "Ingreso" : "Egreso"; // Condición para mostrar "Ingreso" o "Egreso"

            content += `
            <tr>
                <td>${cliente.id}</td>

                <td>${fechaFormateada}</td>

                <td>${cliente.inasistencia}</td>

                <td>${cliente.alto_consumo}</td>


            </tr>`;
        });

        document.getElementById('tableBody_users').innerHTML = content;

        // cliente
        document.querySelectorAll('.edit-cliente-button').forEach(button => {
            button.addEventListener('click', (event) => {
                const clienteId = event.target.closest('button').getAttribute('cliente-id');
                //alert(`Hola Mundo: ${clienteId}`);
                window.location.href = `../cliente/update/index.html?id=${clienteId}`;
            });
        });
        //ubicacion
        document.querySelectorAll('.delete-cliente-button').forEach(button => {
            button.addEventListener('click', (event) => {
                const clienteId = event.target.closest('button').getAttribute('cliente-id');
                alert(`eliminar usuario: ${clienteId}`);
                //window.location.href = `../ubicacion/update/index.html?id=${catastroId}`;
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

        window.location.href = '../tipoMulta/tipoMulta.html';
        //else if (matriz.cliente === 1) window.location.href = '../ubicacion/ubicacion.html';
    });
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
