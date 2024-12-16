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
        const response = await fetch("https://ranchoback.api.dev.dtt.tja.ucb.edu.bo/cliente/index");
        const data = await response.json();
        console.log(data)
        const clientes = data.value;

        if (dataTableIsInitialized) {
            dataTable.clear().draw(); // Limpiar contenido sin destruir DataTable
        }

        let content = ``;
        clientes.forEach((cliente, index) => {
            const fechaNacimiento = new Date(cliente.fecha_nacimiento);
            const fechaFormateada = fechaNacimiento.toISOString().slice(0, 10).split("-").reverse().join("-");
        
            content += `
            <tr>
                <td>${cliente.id}</td>

                <td>${cliente.ci}</td>

                <td>${cliente.nombre}</td>

                <td>${cliente.apellidos}</td>

                <td>${fechaFormateada}</td>

                <td>${cliente.cel}</td>

                <td>
                    <button class="btn btn-sm btn-primary edit-cliente-button" cliente-id="${cliente.id}">
                        <i class="fa-solid fa-pencil"></i>
                    </button>
                    <button class="btn btn-sm btn-danger delete-cliente-button" cliente-id="${cliente.id}">
                        <i class="fa-solid fa-trash"></i>
                    </button>
                </td>
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

        window.location.href = '../cliente/cliente.html';
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
