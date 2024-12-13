export async function cargarComponente(url, idContenedor) {
    const tokenValido = await verificarToken(); // Espera a que se verifique el token
    if (!tokenValido) {
        return; // Detiene el flujo si el token no es válido
    }

    return fetch(url)
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar ' + url);
            }
            return response.text();
        })
        .then(data => {
            const contenedor = document.getElementById(idContenedor);
            contenedor.innerHTML = data;

            // Extrae y ejecuta los scripts en el HTML cargado
            const scripts = contenedor.querySelectorAll("script");
            scripts.forEach(script => {
                const nuevoScript = document.createElement("script");
                if (script.src) {
                    nuevoScript.src = script.src;
                } else {
                    nuevoScript.textContent = script.textContent;
                }
                document.body.appendChild(nuevoScript);
                script.remove();
            });
        })
        .catch(error => {
            console.error('Hubo un problema al cargar el componente:', error);
            document.getElementById(idContenedor).innerHTML = '<p>Error al cargar el componente.</p>';
        });
}

export function mensajeExitoso(mensaje, id) {
    document.getElementById(id).innerHTML = `<div class="alert alert-success"><strong>Exisoto</strong> ${mensaje}</div>`;
}

export function mensajeError(mensaje, id) {
    document.getElementById(id).innerHTML = `<div class="alert alert-danger"><strong>Error</strong> ${mensaje}</div>`;
}

export function matrizRegistro() {
    return fetch('https://ranchoback.api.dev.dtt.tja.ucb.edu.bo/cliente/catastro/getMatrizRegistro', {
        method: 'GET',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            return data.value[0];
        })
        .catch(error => {
            console.error('Hubo un problema con la petición Fetch:', error);
            throw error;
        });
}

export function obtenerIdsRegistroCatastro() {
    return fetch(`https://ranchoback.api.dev.dtt.tja.ucb.edu.bo/cliente/catastro/getallIdRegistro`, {
        method: 'GET',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            return data.value[0];
        })
        .catch(error => {
            console.error('Hubo un problema con la petición Fetch:', error);
            throw error;
        });
}

export function obtenerdatosRegistroLectura(id_catastro) {
    return fetch(`https://ranchoback.api.dev.dtt.tja.ucb.edu.bo/cliente/lectura/datosRegistroLectura/${id_catastro}`, {
        method: 'GET',
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            return data.value[0];
        })
        .catch(error => {
            console.error('Hubo un problema con la petición Fetch:', error);
            throw error;
        });
}

export async function verificarToken() {
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.token) {
        window.location.href = '../login/login.html';
        return false;
    }

    try {
        const response = await fetch("https://ranchoback.api.dev.dtt.tja.ucb.edu.bo/cliente/auth/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${user.token}`,
            },
            body: JSON.stringify({ token: user.token }),
        });

        const data = await response.json();

        if (response.ok && data.success) {
            console.log("Token válido.");
            return true;
        } else {
            console.warn("Token no válido o expirado:", data);
            window.location.href = '../login/login.html';
            return false;
        }
    } catch (error) {
        console.error("Error al verificar el token:", error);
        alert("Ocurrió un error al verificar el token.");
        window.location.href = '../login/login.html';
        return false;
    }
}

export function logout() {
    if (localStorage.getItem("user")) {
        localStorage.removeItem("user");
        window.location.href = 'http://localhost:5500/login/login.html';
    } else {
        console.log("No existe sesión");
    }
}

export function init() {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user) {
        console.log("No hay datos de sesión: redireccionando a login");
        window.location.href = 'http://localhost:5500/login/login.html';
        return;
    }

    return fetch("https://ranchoback.api.dev.dtt.tja.ucb.edu.bo/cliente/auth/", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: user.token }),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Token inválido o sesión expirada');
            }
            return response.json();
        })
        .then(data => {
            console.log("Sesión activa:", data);
        })
        .catch(error => {
            console.error("Error en la validación de la sesión:", error);
        });
}

export function calcularCostoBs(consumo, rango, costo) {
    const rangos = rango.split(",").map(Number);
    const costos = costo.split(",").map(Number);

    let costoTotal = 0;

    for (let i = 0; i < rangos.length; i++) {
        const rangoInferior = i === 0 ? 0 : rangos[i - 1];
        const rangoSuperior = rangos[i];

        if (consumo <= rangoSuperior) {
            costoTotal += (consumo - rangoInferior) * costos[i];
            return costoTotal;
        } else {
            costoTotal += (rangoSuperior - rangoInferior) * costos[i];
        }
    }

    const rangoSuperiorFinal = rangos[rangos.length - 1];
    costoTotal += (consumo - rangoSuperiorFinal) * costos[costos.length - 1];
    return costoTotal;
}

export function obtenerFechaActual() {
    const fecha = new Date();
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    const hours = String(fecha.getHours()).padStart(2, '0');
    const minutes = String(fecha.getMinutes()).padStart(2, '0');
    const seconds = String(fecha.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}


export function obtenerFechaLocal() {
    const fecha = new Date();
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, '0');
    const day = String(fecha.getDate()).padStart(2, '0');
    const hours = String(fecha.getHours()).padStart(2, '0');
    const minutes = String(fecha.getMinutes()).padStart(2, '0');
    const seconds = String(fecha.getSeconds()).padStart(2, '0');

    return `${year}-${month}-${day}`;
}





export function convertHtmlPdf(divElement) {
    const element = document.getElementById(divElement);

    // Obtener la fecha actual y formatearla (YYYY-MM-DD)
    const today = new Date();
    const formattedDate = today.getFullYear() + '-' + 
                          ('0' + (today.getMonth() + 1)).slice(-2) + '-' + 
                          ('0' + today.getDate()).slice(-2);
    
    // Nombre del archivo en formato "YYYY-MM-DD_Luis.pdf"
    const filename = `${formattedDate}_Luis.pdf`;

    const options = {
        filename: filename,
        image: { type: 'pdf', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: {
            unit: 'in',
            format: 'a4',
            orientation: 'portrait',
        }
    };

    // Añadir un estilo CSS para centrar la tabla dentro del PDF
    const styles = `
        #${divElement} {
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
        }
        table {
            margin: auto;
        }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // Generamos el PDF y lo mostramos en una nueva ventana
    html2pdf().set(options).from(element).toPdf().get('pdf').then(function(pdf) {
        const newWindow = window.open();
        newWindow.document.write('<html><head><title>PDF Preview</title><style>');
        newWindow.document.write('body { display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }');
        newWindow.document.write('iframe { width: 80%; height: 80%; border: none; }'); // Ajusta el tamaño del iframe
        newWindow.document.write('</style></head><body>');
        newWindow.document.write('<iframe src="' + pdf.output('bloburl') + '"></iframe>');
        newWindow.document.write('</body></html>');
        newWindow.document.close();
    });
}



export function convertHtmlPdf2(divElement) {
    const element = document.getElementById(divElement);

    // Obtener la fecha actual y formatearla (YYYY-MM-DD)
    const today = new Date();
    const formattedDate = today.getFullYear() + '-' + 
                          ('0' + (today.getMonth() + 1)).slice(-2) + '-' + 
                          ('0' + today.getDate()).slice(-2);
    
    // Nombre del archivo en formato "YYYY-MM-DD_Luis.pdf"
    const filename = `${formattedDate}_Luis.pdf`;

    const options = {
        filename: filename,
        image: { type: 'pdf', quality: 0.98 },
        html2canvas: { scale: 2 },
        jsPDF: {
            unit: 'in',
            format: 'a4',
            orientation: 'portrait',
        }
    };

    // Añadir un estilo CSS para centrar la tabla dentro del PDF
    const styles = `
        #${divElement} {
            
            justify-content: center;
            align-items: center;
            text-align: center;
        }
        table {
            margin: auto;
        }
    `;
    const styleSheet = document.createElement("style");
    styleSheet.type = "text/css";
    styleSheet.innerText = styles;
    document.head.appendChild(styleSheet);

    // Generamos el PDF y lo mostramos en una nueva ventana
    html2pdf().set(options).from(element).toPdf().get('pdf').then(function(pdf) {
        const newWindow = window.open();
        newWindow.document.write('<html><head><title>PDF Preview</title><style>');
        newWindow.document.write('body { display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }');
        newWindow.document.write('iframe { width: 80%; height: 80%; border: none; }'); // Ajusta el tamaño del iframe
        newWindow.document.write('</style></head><body>');
        newWindow.document.write('<iframe src="' + pdf.output('bloburl') + '"></iframe>');
        newWindow.document.write('</body></html>');
        newWindow.document.close();
    });
}