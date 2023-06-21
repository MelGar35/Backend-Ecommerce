function validarCorreoElectronico(correo) {
  let patron = /^[\w\.-]+@[\w\.-]+\.\w+$/;
  return patron.test(correo);
}

console.log("linkeado")
document.getElementById("registerForm").addEventListener('submit', async (event) => {

  event.preventDefault()
  console.log("En funcion register")


  let data = {
    first_name: document.getElementById('firstname').value,
    last_name: document.getElementById('lastname').value,
    age: document.getElementById('age').value,
    phone: document.getElementById('phone').value,
    password: document.getElementById('password').value,
    email: document.getElementById('email').value,
  }



  if (!data.first_name || !validarCorreoElectronico(data.email) || !data.last_name || !data.email || !data.age || !/\+[0-9]+/i.test(data.phone) || !data.password) {
    message.error({
      title: "hey",
      message: "Llena los campos!"
    })
  } else {
    let result;
    await fetch(`/api/session/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => {
        console.log(response)
        if (response.ok) {
          ({
            title: "Usuario Creado!"
          })
          setTimeout(() => {
            window.location.href = "/api/session/login"
          }, 1800);
        } else if (response.status === 500) {
          message.error({
            title: "Ups",
            message: "Ha ocurrido un problema desde del servidor"
          })
        } else {
          result = response
          return response.json()
        }
      }
      )
      .then(data => {
        console.log(data)
        console.log(result)
        if (!result.ok) {
          message.error({
            title: "Ha ocurrido un error",
            message: data.message
          })
        }
      })
  }
})


