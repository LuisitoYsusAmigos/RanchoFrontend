import { cargarComponente, mensajeExitoso, matrizRegistro } from '../funciones.js';

let dataTable;
let dataTableIsInitialized = false;


const dataTableOptions = {
    columnDefs: [
        { className: "centered", targets: [0, 1, 2, 3, 4, 5, 6, 7] },
        { orderable: false, targets: [6, 7] },
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
        const response = await fetch("http://localhost:3000/catastro/getResumenCatastro");
        const data = await response.json();
        const catastros = data.value;

        if (dataTableIsInitialized) {
            dataTable.clear().draw(); // Limpiar contenido sin destruir DataTable
        }

        let content = ``;
        catastros.forEach((catastro, index) => {
            content += `
            <tr>
                <td>${catastro.id}</td>

                <td>${catastro.codigo_usuario}</td>

                <td>${catastro.categoria_suscripcion}</td>

                <td>${catastro.ci_cliente}
                <button class="btn btn-sm btn-primary cliente-button" cliente-id="${catastro.id}">
                    <i class="fa-solid fa-user-pen"></i>
                    </button>
                </td>

                <td>${catastro.localidad_ubicacion}
                <button class="btn btn-sm btn-primary ubicacion-button" ubicacion-id="${catastro.id}">
                    <i class="fa-solid fa-location-dot"></i>
                    </button>
                </td>

                <td>${catastro.numero_medidor}
                <button class="btn btn-sm btn-primary medidor-button" medidor-id="${catastro.id}">
                    <i class="fa-solid fa-wrench"></i>
                    </button>
                </td>

                <td>${catastro.estado_medidor === 1 ? '<i class="fa-solid fa-check" style="color: green;"></i>' : '<i class="fa-solid fa-times" style="color: red;"></i>'}</td>

                <td>${catastro.observaciones_puntos_agua}
                <button class="btn btn-sm btn-primary puntos_agua-button" puntos_agua-id="${catastro.id}">
                    <i class="fa-solid fa-pencil"></i>
                </button>
                </td>
            </tr>`;
        });

        document.getElementById('tableBody_users').innerHTML = content;

        // Agregar el event listener para los botones en la columna de ci_cliente
        document.querySelectorAll('.cliente-button').forEach(button => {
            button.addEventListener('click', (event) => {
                const catastroId = event.target.closest('button').getAttribute('cliente-id');
                //alert(`Hola Mundo: ${catastroId}`);
                window.location.href = `../cliente/update/index.html?id=${catastroId}`;
            });
        });
        //ubicacion
        document.querySelectorAll('.ubicacion-button').forEach(button => {
            button.addEventListener('click', (event) => {
                const catastroId = event.target.closest('button').getAttribute('ubicacion-id');
                //alert(`Hola Mundo: ${catastroId}`);
                window.location.href = `../ubicacion/update/index.html?id=${catastroId}`;
            });
        });
        //medidor
        document.querySelectorAll('.medidor-button').forEach(button => {
            button.addEventListener('click', (event) => {
                const catastroId = event.target.closest('button').getAttribute('medidor-id');
                //alert(`Hola Mundo: ${catastroId}`);
                window.location.href = `../medidor/update/index.html?id=${catastroId}`;
            });
        });
        //puntos agua
        document.querySelectorAll('.puntos_agua-button').forEach(button => {
            button.addEventListener('click', (event) => {
                const catastroId = event.target.closest('button').getAttribute('puntos_agua-id');
                //alert(`Hola Mundo: ${catastroId}`);
                window.location.href = `../puntos_agua/update/index.html?id=${catastroId}`;
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
    const matriz = await matrizRegistro();
    console.log("matriz: ",matriz)
    document.getElementById("crearCatastro").addEventListener("click", function () {
        //if (matriz.cliente === 0) window.location.href = '../cliente/cliente.html';
        //else if (matriz.cliente === 1) window.location.href = '../ubicacion/ubicacion.html';
        if(matriz.puntos_agua==1){ window.location.href = '../catastro/catastro.html'}
        else if(matriz.medidor==1) {window.location.href = '../puntos_agua/puntos_agua.html'}
        else if(matriz.inmueble==1) {window.location.href = '../medidor/medidor.html';}
        else if(matriz.ubicacion==1) {window.location.href = '../inmueble/inmueble.html';}
        else {window.location.href = '../ubicacion/ubicacion.html'}
        
        /*
        if (matriz.ubicacion === 0) window.location.href = '../ubicacion/ubicacion.html';
        else if (matriz.ubicacion === 1) window.location.href = '../inmueble/inmueble.html';
        else if (matriz.inmueble === 1) window.location.href = '../medidor/medidor.html';
        else if (matriz.medidor === 1) window.location.href = '../puntos_agua/puntos_agua.html';
        else if (matriz.puntos_agua === 1) window.location.href = '../catastro/catastro.html';
        */
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
