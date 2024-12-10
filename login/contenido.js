
window.onload = async function () {
    verificarToken()
    console.log("dios llego")
    console.log(localStorage.getItem("user"))
    const form = document.getElementById('login-form');

    if (form) {
        form.addEventListener('submit', async function (event) {
            event.preventDefault(); // Evita que el formulario redirija la página

            // Recopilar los datos del formulario con los nombres de los inputs (ci, password)
            const formData = new FormData(form);
            const data = Object.fromEntries(formData.entries());

            try {
                // Envía la solicitud con fetch
                const response = await fetch(form.action, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    // Aquí enviamos el objeto en formato JSON
                    body: JSON.stringify({
                        ci: data.ci,
                        password: data.password
                    })
                });

                const result = await response.json();
                console.log(result);

                // Aquí puedes manejar la respuesta sin redirigir la página
                if (result.status) {
                    //alert("el correcto se va");
                    //console.log("usuario exitoso ")
                    console.log(result.value)
                    localStorage.setItem("user",JSON.stringify(result.value))
                    //window.location.href='../index.html'
                    window.location.href='../index.html'
                } else {
                    //alert('Error: ' + result.msg);
                    document.getElementById('mensaje').innerHTML=`<div class="alert alert-danger"><strong>Error</strong> ${result.msg}</div>`
                }
            } catch (error) {
                console.error('Error:', error);
            }
        });
    } else {
        console.error('El formulario no se encontró');
    }
}
export default  function verificarToken() {
    
    const user = JSON.parse(localStorage.getItem("user"));
    if (!user || !user.token) {
        //alert("Error: no existe el usuario o el token en localStorage.");
        //window.location.href = '../';
        return; // Termina la función si no existe el usuario o el token
    }else{
        const token = user.token
        fetch("http://localhost:3000/auth/", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ token: token })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                //alert("Token válido.");
                window.location.href = '../index.html';
            }
        })
        .catch(error => {
            console.error("Error:", error);
            alert("Ocurrió un error al verificar el token.");
        });

    }

}