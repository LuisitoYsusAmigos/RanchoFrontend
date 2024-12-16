import { cargarComponente, mensajeExitoso, matrizRegistro } from '../funciones.js';

let dataTable;
let dataTableIsInitialized = false;


const dataTableOptions = {
    columnDefs: [
        { className: "centered", targets: [0, 1, 2, 3, 4,5] },
        //{ orderable: false, targets: [6, 7] },
        { searchable: false, targets: [1] }
    ],
    pageLength: 10,
    destroy: true,
    language: {
        lengthMenu: "Mostrar _MENU_ registros por página",
        zeroRecords: "Ningún usuarioLectura encontrado",
        info: "Mostrando de _START_ a _END_ de un total de _TOTAL_ registros",
        infoEmpty: "Ningún usuarioLectura encontrado",
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
        const response = await fetch("https://ranchoback.api.dev.dtt.tja.ucb.edu.bo/lectura/UsuariosLecturas");
        const data = await response.json();
        const usuariosLecturas = data.value;
        console.log(usuariosLecturas)

        if (dataTableIsInitialized) {
            dataTable.clear().draw(); // Limpiar contenido sin destruir DataTable
        }

        let content = ``;
        usuariosLecturas.forEach((usuarioLectura, index) => {
            content += `
            <tr>
                <td>${usuarioLectura.id_catastro}</td>

                <td>${usuarioLectura.nombre_cliente}</td>

                <td>${usuarioLectura.apellido_cliente}</td>

                <td>${usuarioLectura.ci_cliente}</td>

                <td>${usuarioLectura.codigo_medidor}</td>

                <td>
                <button class="btn btn-sm btn-primary lectura-button" lectura-id="${usuarioLectura.id_catastro}">
                    <i class="fa-solid fa-pencil"></i>
                </button>
                </td>
            </tr>`;
        });

        document.getElementById('tableBody_users').innerHTML = content;


        //lectura
        document.querySelectorAll('.lectura-button').forEach(button => {
            button.addEventListener('click', (event) => {
                const usuarioLecturaId = event.target.closest('button').getAttribute('lectura-id');
                //alert(`Hola Mundo: ${usuarioLecturaId}`);
                window.location.href = `../lectura/lecturasUsuario/index.html?id_catastro=${usuarioLecturaId}`;
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
    //alert("hola")

    try {
        // Cargar sidebar, header y content en paralelo
        await Promise.all([
            cargarComponente('../content/sidebar.html', 'custom-sidebar'),
            cargarComponente('../content/header.html', 'custom-header-placeholder'),
            // cargarComponente('../content/content.html', 'custom-content-placeholder')
        ]);
        console.log('Componentes cargados exitosamente');

        await initDataTable(); // Iniciar la tabla después de cargar los componentes
        //document.getElementById("crearusuarioLectura").addEventListener("click", function () {})



    } catch (error) {
        console.error('Hubo un problema:', error);
    }
};
