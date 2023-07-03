
document.getElementById("loginform").addEventListener('submit', async (event) => {
  event.preventDefault()
  console.log("En funcion")

  let data = {
    email: document.getElementById('email').value,
    password: document.getElementById('password').value
  }
  console.log(data)
  let wrongresult;


  await fetch(`/api/session/login`, { //
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(response => {
      if (response.ok) {
        message.success({
          title: "Bienvenido"
        })
        setTimeout(() => {
          window.location.href = "/api"
        }, 2000);
      } else {
        wrongresult = response
        return response.json()
      }
    }
    )
    .then(data => {
      if (!wrongresult.ok) {
        message.error({
          title: "Ha ocurrido un error",
          message: data.message
        })
      }
    })
})


