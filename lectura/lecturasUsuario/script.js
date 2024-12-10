import { cargarComponente } from '../../../funciones.js';

let dataTable;
let dataTableIsInitialized = false;

const dataTableOptions = {
    columnDefs: [
        { className: "centered", targets: [0, 1, 2, 3, 4, 5] },
        { searchable: false, targets: [1] }
    ],
    pageLength: 10,
    destroy: true,
    order: [[0, "desc"]],
    language: {
        lengthMenu: "Mostrar _MENU_ registros por página",
        zeroRecords: "Ningún usuarioLectura encontrado",
        info: "Mostrando de _START_ a _END_ de un total de _TOTAL_ registros",
        infoEmpty: "Ningún usuarioLectura encontrado",
        infoFiltered: "(filtrados desde _MAX_ registros totales)",
        search: "Buscar:",
        loadingRecords: "Cargando...",
        emptyTable: "No hay Lecturas registradas todavia ",
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
        const catastroId = urlParams.get('id_catastro');

        const response = await fetch(`http://localhost:3000/lectura/lecturasCatastro/${catastroId}`);
        console.log("respues de api")
        const data = await response.json();
        console.log(data.status)
        if (data.status) {
            //alert("hola")
            const usuariosLecturas = data.value;
            console.log(usuariosLecturas);

            if (dataTableIsInitialized) {
                dataTable.clear().draw(); // Limpiar contenido sin destruir DataTable
            }

            let content = ``;
            usuariosLecturas.forEach((usuarioLectura) => {
                const fecha = new Date(usuarioLectura.fecha);
                const fechaFormateada = fecha.toISOString().slice(0, 10).split("-").reverse().join("-");
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
                        : `<button class="btn btn-sm btn-danger pagoLectura-button" pagoLectura-id="${usuarioLectura.id}">  
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
        document.getElementById("crearLectura").addEventListener("click", function () {
            //alert("s")
            window.location.href = `../lecturasUsuario/lectura.html?id_catastro=${catastroId}`;

        })
        document.getElementById("crearRecibo").addEventListener("click", function () {
            //alert("s")
            window.location.href = `../../recibo/recibo.html?id_catastro=${catastroId}`;

        })
        

    } catch (error) {
        alert("Error cargando los datos: " + error);
    }
};

window.onload = async function () {
    try {
        await Promise.all([
            cargarComponente('../../content/sidebar.html', 'custom-sidebar'),
            cargarComponente('../../content/header.html', 'custom-header-placeholder'),
        ]);
        console.log('Componentes cargados exitosamente');

        await initDataTable(); // Iniciar la tabla después de cargar los componentes

    } catch (error) {
        console.error('Hubo un problema:', error);
    }
};
