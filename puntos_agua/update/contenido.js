import { cargarComponente, mensajeExitoso, matrizRegistro } from '../../funciones.js';

window.onload = async function () {
    try {
        await Promise.all([
            cargarComponente('../../content/sidebar.html', 'custom-sidebar'),
            cargarComponente('../../content/header.html', 'custom-header-placeholder'),
            cargarComponente('../../puntos_agua/crear.html', 'custom-content-placeholder')
        ]);
        console.log('Componentes cargados exitosamente');

        const getQueryParameter = (param) => {
            const urlParams = new URLSearchParams(window.location.search);
            return urlParams.get(param);
        };

        const catastroId = getQueryParameter('id');
        console.log(`ID del catastro: ${catastroId}`);

        const response = await fetch(`https://ranchoback.api.dev.dtt.tja.ucb.edu.bo/cliente/puntosAgua/edit/${catastroId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ id: catastroId })
        });

        if (!response.ok) {
            throw new Error(`Error al llamar a la API: ${response.statusText}`);
        }

        const form = document.getElementById('puntosAguaForm');
        let data = await response.json();
        if (data.status === true) {
            document.getElementById('puntosAguaForm').action = `https://ranchoback.api.dev.dtt.tja.ucb.edu.bo/cliente/puntosAgua/update/${catastroId}`;
            data = data.value[0];
            console.log(data);
            document.getElementById('id').value = catastroId;
            document.getElementById('pileta_patio').checked = data.pileta_patio;
            document.getElementById('lavanderia').checked = data.lavanderia;
            document.getElementById('lava_platos').checked = data.lava_platos;
            document.getElementById('inodoro').checked = data.inodoro;
            document.getElementById('ducha').checked = data.ducha;
            document.getElementById('lava_manos').checked = data.lava_manos;
            document.getElementById('tina').checked = data.tina;
            document.getElementById('otros').checked = data.otros;
            document.getElementById('observaciones').value = data.observaciones;
            document.getElementById('banner').innerHTML = "";
        } else {
            alert("Error en la carga del elemento");
        }

        if (form) {
            form.addEventListener('submit', async function (event) {
                event.preventDefault();

                const formData = new FormData(form);

                // Asignar valor 0 a los checkboxes no marcados
                ['pileta_patio', 'lavanderia', 'lava_platos', 'inodoro', 'ducha', 'lava_manos', 'tina', 'otros'].forEach(name => {
                    if (!formData.has(name)) {
                        formData.append(name, '0');
                    }
                });

                const data = Object.fromEntries(formData.entries());

                try {
                    const response = await fetch(form.action, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(data)
                    });

                    const result = await response.json();
                    console.log(result);

                    if (result.status) {
                        window.location.href = '/catastro/index.html';
                    } else {
                        alert('Error al registrar el cliente: ' + result.msg);
                    }
                } catch (error) {
                    console.error('Error:', error);
                }
            });
        } else {
            console.error('El formulario no se encontró');
        }

    } catch (error) {
        console.error('Hubo un problema:', error);
    }
};
