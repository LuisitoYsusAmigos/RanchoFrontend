import { cargarComponente } from '../funciones.js';

const tarifaTablaContainer = document.querySelector('.container'); // Donde irán las tablas

// Función para obtener los datos desde la API
async function obtenerDatos() {
    try {
        const response = await fetch('https://ranchoback.api.dev.dtt.tja.ucb.edu.bo/tarifa/index');
        const data = await response.json();

        if (data.status && data.value.length > 0) {
            data.value.forEach(tarifaItem => {
                dibujarTabla(tarifaItem.rango, tarifaItem.costo, tarifaItem.fecha);
            });
        } else {
            console.error('No se encontraron datos o hubo un error en la respuesta.');
        }
    } catch (error) {
        console.error('Error al obtener los datos:', error);
    }
}

// Función para dibujar la tabla
function dibujarTabla(rangoStr, tarifaStr, fechaTarifa) {
    const rango = rangoStr.split(',').map(Number);
    const tarifa = tarifaStr.split(',').map(Number);

    // Crear una nueva tabla para cada tarifa
    const tableContainer = document.createElement('div');
    tableContainer.className = 'table-responsive my-4';

    const tableHTML = `
        <h4>${new Date(fechaTarifa).toLocaleDateString()}</h4>
        <table class="table table-striped" border="1">
            <thead>
                <tr id="rangoRow"></tr>
            </thead>
            <tbody>
                <tr id="tarifaRow"></tr>
            </tbody>
        </table>
    `;

    tableContainer.innerHTML = tableHTML;
    tarifaTablaContainer.appendChild(tableContainer);

    // Obtener las referencias a las filas donde irán los datos
    const rangoRow = tableContainer.querySelector('#rangoRow');
    const tarifaRow = tableContainer.querySelector('#tarifaRow');

    // Rellenar la fila de rangos
    for (let i = 0; i < rango.length; i++) {
        const start = i === 0 ? 0 : rango[i - 1] + 1;
        const end = rango[i];
        const th = document.createElement('th');
        th.textContent = `${start}-${end} m3`;
        rangoRow.appendChild(th);
    }

    // Rellenar la fila de tarifas
    for (let i = 0; i < tarifa.length; i++) {
        const td = document.createElement('td');
        td.textContent =`${tarifa[i]} bs`;
        tarifaRow.appendChild(td);
    }
}

// Inicializar la tabla al cargar la página
window.onload = async function () {
    try {
        // Cargar sidebar, header y content en paralelo
        await Promise.all([
            cargarComponente('../content/sidebar.html', 'custom-sidebar'),
            cargarComponente('../content/header.html', 'custom-header-placeholder'),
        ]);

        console.log('Componentes cargados exitosamente');
        await obtenerDatos(); // Llamar a la función para obtener los datos de la API
        document.getElementById("crearTarifa").addEventListener("click",()=>{
            window.location.href = '/tarifa/tarifa.html'
        })
        crearTarifa
    } catch (error) {
        console.error('Hubo un problema:', error);
    }
};
