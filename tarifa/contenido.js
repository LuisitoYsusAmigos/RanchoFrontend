import { cargarComponente, mensajeExitoso, matrizRegistro,mensajeError } from '../funciones.js';
window.onload = async function () {
    try {
        // Cargar sidebar, header y content en paralelo
        await Promise.all([
            cargarComponente('../content/sidebar.html', 'custom-sidebar'),
            cargarComponente('../content/header.html', 'custom-header-placeholder'),
            cargarComponente('../tarifa/crear.html', 'custom-content-placeholder')
        ]);
        console.log('Componentes cargados exitosamente');
        
        const fechaObj = new Date();
        const fecha = `${fechaObj.getFullYear()}/${String(fechaObj.getMonth() + 1).padStart(2, '0')}/${String(fechaObj.getDate()).padStart(2, '0')}`;
        let rango = [];
        let tarifa = [];
        let id_usuario=1

        document.getElementById("fechaTarifaRow").innerHTML=fecha
        // Obtener las referencias a las filas donde irán los datos
        const rangoRow = document.getElementById('rangoRow');
        const tarifaRow = document.getElementById('tarifaRow');

        const addButton = document.getElementById('addButton');

        const rangoInput = document.getElementById('rangoInput');
        const tarifaInput = document.getElementById('tarifaInput');

        // Función para redibujar la tabla
        function dibujarTabla() {
            // Limpiar las filas antes de redibujar
            rangoRow.innerHTML = '';
            tarifaRow.innerHTML = '';

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
                td.textContent = tarifa[i]," bs";
                tarifaRow.appendChild(td);
            }
        }

        // Inicializar la tabla al cargar la página
        dibujarTabla();

        // Evento para el botón que añade los valores ingresados a las matrices y redibuja la tabla
        addButton.addEventListener('click', () => {
            const nuevoRango = parseInt(rangoInput.value);
            const nuevaTarifa = parseInt(tarifaInput.value);

            if (!isNaN(nuevoRango) && !isNaN(nuevaTarifa)) {
                // Añadir los valores ingresados a las matrices
                if (rango.length === 0 || nuevoRango > rango[rango.length - 1]) {
                    // Si el array está vacío o el nuevo rango es mayor que el último
                    if (nuevoRango <= 0) {
                        mensajeError("el primer rango debe ser mayor a 0","banner")
                        //alert("debe ser mayor a 0")
                    } else {
                        rango.push(nuevoRango);
                        tarifa.push(nuevaTarifa);
                    }
                    //alert("Valor añadido correctamente");
                } else {
                    mensajeError("El nuevo rango debe ser mayor que el último rango ingresado.","banner");
                    //alert("El nuevo rango debe ser mayor que el último rango ingresado.");
                }

                // Redibujar la tabla
                dibujarTabla();

                // Limpiar los inputs
                rangoInput.value = '';
                tarifaInput.value = '';
            } else {
                mensajeError('Por favor ingresa valores válidos para rango y tarifa.',"banner");
                //alert('Por favor ingresa valores válidos para rango y tarifa.');
            }
        });
        document.getElementById("guardarTarifa").addEventListener("click", async function () {
            const data = {
                rango: rango.join(','),
                costo: tarifa.join(','),
                fecha: fecha,
                id_usuario: id_usuario
            };
            console.log(JSON.stringify(data))
            try {
                const response = await fetch("https://ranchoback.api.dev.dtt.tja.ucb.edu.bo/tarifa/create", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
                    body: JSON.stringify(data)
                });

                if (response.ok) {
                    const result = await response.json();
                    mensajeExitoso("Tarifas guardadas correctamente", "banner");
                } else {
                    const error = await response.json();
                    mensajeError(`Error al guardar tarifas: ${error.message}`, "banner");
                }
            } catch (error) {
                mensajeError(`Hubo un problema al enviar los datos: ${error}`, "banner");
            }
        });
        


        // Esperar hasta que el contenido se haya cargado completamente

    } catch (error) {
        console.error('Hubo un problema:', error);
    }
};
