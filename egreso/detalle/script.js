import { cargarComponente, convertHtmlPdf, convertHtmlPdf2 } from '/funciones.js';

const urlParams = new URLSearchParams(window.location.search);
// Almacena el valor en la variable 'fecha'
const fecha = urlParams.get('mes_anio');
console.log("datos de la fecha");
console.log(fecha);


let dataTable;
let dataTableIsInitialized = false;

const dataTableOptions = {
    columnDefs: [
        { className: "centered", targets: [0, 1, 2, 3, 4] }, // Ajustado para que coincida con las columnas de la tabla
        { orderable: false, targets: [2] }, // Ajustado a las columnas donde no quieres ordenación
        { searchable: false, targets: [1] }
    ],
    pageLength: 100,
    destroy: true,
    searching: false,
    lengthChange: false,
    info: false,
    paginate: false,
    language: {
        lengthMenu: "Mostrar _MENU_ registros por página",
        zeroRecords: "Ningún catastro encontrado",
        info: "Mostrando de _START_ a _END_ de un total de _TOTAL_ registros",
        infoEmpty: "Ningún catastro encontrado",
        infoFiltered: "(filtrados desde _MAX_ registros totales)",
        search: "Buscar:",
        loadingRecords: "Cargando...",
        emptyTable: "Esta fecha no contiene Ingresos ni Egresos",
        paginate: {
            first: "Primero",
            last: "Último",
            next: "Siguiente",
            previous: "Anterior"
        }
    }
};

// Función para calcular y mostrar el resumen
const calculateAndDisplaySummary = () => {
    let ingresos = 0;
    let egresos = 0;

    // Iterar a través de las filas del DataTable para calcular los totales
    $("#datatable_users tbody tr").each(function () {
        const monto = parseFloat($(this).find("td:nth-child(3)").text()); // Obtener el valor de la columna "Monto"
        const tipo = $(this).find("td:nth-child(5)").text(); // Obtener el tipo (Ingreso/Egreso)

        if (tipo === "Ingreso") {
            ingresos += monto;
        } else if (tipo === "Egreso") {
            egresos += monto;
        }
    });

    const totalCaja = ingresos - egresos;

    // Crear la tabla de resumen
    const summaryTable = `
        <table class="table table-bordered">
            <thead>
                <tr>
                    <th>INGRESOS</th>
                    <th>EGRESOS</th>
                    <th>TOTAL CAJA</th>
                </tr>
            </thead>
            <tbody>
                <tr>
                    <td>${ingresos.toFixed(2)} Bs</td>
                    <td>${egresos.toFixed(2)} Bs</td>
                    <td>${totalCaja.toFixed(2)} Bs</td>
                </tr>
            </tbody>
        </table>
    `;

    // Insertar la tabla de resumen debajo del DataTable
    const tableContainer = document.getElementById("TablaPdf");
    tableContainer.insertAdjacentHTML("beforeend", summaryTable);
};

// Función para inicializar el DataTable
const initDataTable = async () => {
    if (dataTableIsInitialized) {
        dataTable.destroy();
    }
    await listUsers();
    dataTable = $("#datatable_users").DataTable(dataTableOptions);
    dataTableIsInitialized = true;

    // Calcular y mostrar la tabla de resumen después de que se cargue el DataTable
    calculateAndDisplaySummary();
};

// Función para listar los usuarios (datos del servidor)
const listUsers = async () => {
    try {
        const query = `http://localhost:3000/egreso/getMonth/${fecha}`;
        const response = await fetch(query);
        const data = await response.json();

        if (!data.status) {
            // Manejo de errores si la respuesta es incorrecta
        } else {
            const clientes = data.value;
            console.log("prueba de imprimir valores de egresos");
            console.log(clientes);

            if (dataTableIsInitialized) {
                dataTable.clear().draw(); // Limpiar contenido sin destruir DataTable
            }

            let content = ``;
            clientes.forEach((cliente, index) => {
                const fechaNacimiento = new Date(cliente.fecha);
                const fechaFormateada = fechaNacimiento.toISOString().slice(0, 10).split("-").reverse().join("-");
                const tipo = cliente.valor === 1 ? "Ingreso" : "Egreso";

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
        }
    } catch (error) {
        alert("Error cargando los datos: " + error);
    }
};

// Cargar componentes y la tabla al cargar la página
window.onload = async function () {
    try {
        // Cargar sidebar, header y content en paralelo
        await Promise.all([
            cargarComponente('/content/sidebar.html', 'custom-sidebar'),
            cargarComponente('/content/header.html', 'custom-header-placeholder'),
        ]);
        
        console.log('Componentes cargados exitosamente');
        console.log(fecha);

        // Establecer el título del reporte
        const tituloReporte = document.getElementById('tituloReporte');
        if (fecha) {
            tituloReporte.textContent = `Reporte ${fecha}`;
        } else {
            tituloReporte.textContent = "Reporte (Sin fecha)";
        }

        await initDataTable(); // Iniciar la tabla después de cargar los componentes

        // Configurar botón para generar PDF
        document.getElementById('crearPdf').addEventListener('click', function () {
            convertHtmlPdf2('TablaPdf');
        });

    } catch (error) {
        console.error('Hubo un problema:', error);
    }
};
