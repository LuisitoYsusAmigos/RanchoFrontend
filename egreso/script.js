import { cargarComponente, convertHtmlPdf } from '../funciones.js';

let dataTable;
let dataTableIsInitialized = false;


const dataTableOptions = {
    columnDefs: [
        { className: "centered", targets: [0, 1, 2, 3,4] }, // Ajustado para que coincida con las columnas de la tabla
        { orderable: false, targets: [2] }, // Ajustado a las columnas donde no quieres ordenación
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
        const response = await fetch("https://ranchoback.api.dev.dtt.tja.ucb.edu.bo/egreso/index");
        const data = await response.json();
        //console.log(data)
        const clientes =data.value
        console.log("prueba de imprimir valores de egresos")
        console.log(clientes)

        if (dataTableIsInitialized) {
            dataTable.clear().draw(); // Limpiar contenido sin destruir DataTable
        }

        let content = ``;
        clientes.forEach((cliente, index) => {
            const fechaNacimiento = new Date(cliente.fecha);
            const fechaFormateada = fechaNacimiento.toISOString().slice(0, 10).split("-").reverse().join("-");
            const tipo = cliente.valor === 1 ? "Ingreso" : "Egreso";
            console.log(clientes.valor);  // Imprime el valor para verificar

            content += `
            <tr>
                <td>${cliente.id}</td>

                <td>${fechaFormateada}</td>

                <td>${cliente.monto}</td>

                <td>${cliente.detalle}</td>

                <td>${tipo}</td>

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
    
    document.getElementById("crearEgreso").addEventListener("click", function () {

        window.location.href = '../egreso/egreso.html';
        //else if (matriz.cliente === 1) window.location.href = '../ubicacion/ubicacion.html';
    });
    document.getElementById("buscarMes").addEventListener("click", function () {
        const inputMes = document.getElementById("mes_anio").value; // Obtén el valor del input
        if (inputMes) {
          // Redirige a /detalle/index con el valor como parámetro GET
          window.location.href = `/egreso/detalle/index.html?mes_anio=${encodeURIComponent(inputMes)}`;
        } else {
          alert("Completa la entrada de fecha");
        }
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
        document.getElementById('crearPdf').addEventListener('click', function() {
            //alert('funciona');
            convertHtmlPdf('TablaPdf')
        });
        



    } catch (error) {
        console.error('Hubo un problema:', error);
    }
};
