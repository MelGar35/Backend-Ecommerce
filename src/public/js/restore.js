
const enviarMail = document.getElementById("mailform").addEventListener('submit', (event) => {
  event.preventDefault()
  console.log("Enviando mail para restaurar contraseña")


  const data = {
    email: document.getElementById('email').value
  }
  console.log(data)

  let result;


  fetch(`/api/session/restore`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      console.log(response)
      if (response.ok) {
        message.success({
          title: "Un mail te ha sido enviado"
        })

      } else {
        result = response
        return response.json()
      }
    }
    )
    .then(data => {
      console.log(data)
      if (!result || !result.ok) {
        message.error({
          title: "Ha ocurrido un error",
          message: data.error || ""
        })
      }
    })
})

document.getElementById("form").addEventListener('submit', (event) => {
  event.preventDefault()
  console.log("Enviando peticion")
  const token = document.getElementById('token').innerHTML
  console.log(token)


  const data = {
    newPassword: document.getElementById('newPassword').value
  }
  console.log(data)
  let result;

  fetch(`/api/session/updateUser/${token}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      console.log(response)
      if (response.ok) {
        message.success({
          title: "Contraseña cambiada!"
        })
        window.location.href = "/api/session/login"

      } else {
        result = response
        return response.json()
      }
    }
    )
    .then(data => {
      console.log(data)
      if (!result || !result.ok) {
        message.error({
          title: "Ha ocurrido un error",
          message: data.error || ""
        })
      }
    })
})
