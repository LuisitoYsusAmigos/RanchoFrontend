import { cargarComponente, obtenerdatosRegistroLectura, calcularCostoBs } from '../../funciones.js';

window.onload = async function () {
    try {
        // Cargar sidebar, header y content en paralelo
        await Promise.all([
            cargarComponente('../../content/sidebar.html', 'custom-sidebar'),
            cargarComponente('../../content/header.html', 'custom-header-placeholder'),
            cargarComponente('../lecturasUsuario/crear.html', 'custom-content-placeholder')
        ]);
        console.log('Componentes cargados exitosamente');
        // /*



        // */

        const form = document.getElementById('lecturaForm');
        const urlParams = new URLSearchParams(window.location.search);
        const idCatastro = urlParams.get('id_catastro');
        //const tokenLogin= JSON.parse(localStorage.getItem("user"));
        //console.log("el token:")
        //console.log(tokenLogin)
        //alert("momoento de espera")
        const user = JSON.parse(localStorage.getItem("user")).datosUsuario[0];
        
        const datosRegistroLectura = await obtenerdatosRegistroLectura(idCatastro);

        const lecturaAnteriorInput = document.getElementById('lectura_anterior');
        const lecturaActualInput = document.getElementById('lectura_actual');
        const consumoM3Input = document.getElementById('consumo_m3');
        const consumoBsInput = document.getElementById('consumo_bs');

        if (form) {
            document.getElementById('id_catastro').value = idCatastro;
            lecturaAnteriorInput.value = datosRegistroLectura.lectura_actual;
            document.getElementById('id_tarifa').value = datosRegistroLectura.tarifa_id;
            document.getElementById('id_usuario').value = user.id;
            document.getElementById('fecha').value = new Date().toISOString().split('T')[0];
        }

        // Crear elemento de advertencia, oculto inicialmente
        const warningDiv = document.createElement('div');
        warningDiv.className = 'alert alert-danger mt-2';
        warningDiv.role = 'alert';
        warningDiv.textContent = 'La lectura actual no puede ser menor que la lectura anterior.';
        warningDiv.style.display = 'none'; // Oculto por defecto

        // Insertar el div de advertencia después de `lectura_actual`
        lecturaActualInput.parentNode.appendChild(warningDiv);

        // Escuchar cambios en `lectura_actual` para calcular `consumo_m3` y `consumo_bs` automáticamente
        lecturaActualInput.addEventListener('input', () => {
            const lecturaAnterior = parseFloat(lecturaAnteriorInput.value);
            const lecturaActual = parseFloat(lecturaActualInput.value);

            if (!isNaN(lecturaActual) && !isNaN(lecturaAnterior)) {
                if (lecturaActual < lecturaAnterior) {
                    warningDiv.style.display = 'block'; // Mostrar advertencia
                    consumoM3Input.value = ''; // Limpiar el campo si hay advertencia
                    consumoBsInput.value = ''; // Limpiar consumo_bs también
                } else {
                    warningDiv.style.display = 'none'; // Ocultar advertencia

                    // Calcular y asignar `consumo_m3`
                    const consumoM3 = lecturaActual - lecturaAnterior;
                    consumoM3Input.value = consumoM3;

                    // Calcular y asignar `consumo_bs` usando `calcularCostoBs`
                    const consumoBs = calcularCostoBs(consumoM3, datosRegistroLectura.rango, datosRegistroLectura.costo);
                    consumoBsInput.value = consumoBs;
                }
            }
        });

        // Manejo del envío del formulario
        form.addEventListener('submit', async (e) => {
            e.preventDefault(); // Prevenir el envío estándar del formulario

            // Construir el objeto JSON con los datos del formulario
            const data = {
                fecha: document.getElementById('fecha').value,
                lectura_anterior: parseFloat(document.getElementById('lectura_anterior').value),
                lectura_actual: parseFloat(document.getElementById('lectura_actual').value),
                consumo_m3: parseFloat(document.getElementById('consumo_m3').value),
                consumo_bs: parseFloat(document.getElementById('consumo_bs').value),
                pagado: parseInt(document.getElementById('pagado').value),
                id_tarifa: parseInt(document.getElementById('id_tarifa').value),
                id_catastro: parseInt(document.getElementById('id_catastro').value),
                id_usuario: parseInt(document.getElementById('id_usuario').value),
            };

            console.log('Datos enviados:', data); // Depuración para verificar el payload
            const user = JSON.parse(localStorage.getItem("user"));
            console.log(user)
            try {
                // Enviar los datos al API en formato JSON
                const response = await fetch(form.action, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });

                // Verificar si la respuesta es exitosa
                if (!response.ok) {
                    const errorMessage = await response.text();
                    console.error('Error en la respuesta:', errorMessage);
                    alert('Error al enviar los datos. Verifique la consola para más detalles.');
                    return;
                }

                // Redirigir después de un envío exitoso
                window.location.href = `http://localhost:5500/lectura/lecturasUsuario/index.html?id_catastro=${data.id_catastro}`;
            } catch (error) {
                console.error('Error al enviar los datos:', error);
                alert('Hubo un problema al intentar enviar los datos. Verifique la consola para más detalles.');
            }
        });


    } catch (error) {
        console.error('Hubo un problema:', error);
    }
};
