
const deleteButtons = document.querySelectorAll('#deleteButton');

deleteButtons.forEach(button => {

  button.addEventListener('click', async (event) => {
    event.preventDefault()

    let uid = event.target.dataset.id;

    await fetch(`/api/users/${uid}`, {
      method: 'DELETE',
    })
      .then(response => {
        if (response.ok) {
          iziToast.success({
            title: "Usuario eliminado",
          })
          setTimeout(() => {
            window.location.href = "/api/users/premium"
          }, 400);
        } else {
          iziToast.error({
            title: "No se ha podido eliminar al usuario",
          })
        }
      })
      .catch(error => {
        console.log(error)
      })

  })
})


const sendButtons = document.querySelectorAll('#sendButton');

sendButtons.forEach(button => {

  button.addEventListener('click', async (event) => {
    event.preventDefault()

    let uid = event.target.dataset.id;
    let data = {
      role: "premium"
    }
    console.log(uid)
    console.log(data)
    await fetch(`/api/users/premium/${uid}`, {// 
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    })
      .then(response => {
        if (response.ok) {
          iziToast.success({
            title: "Usuario actualizado!",
            message: "Recargue la pagina para comprobar los cambios"
          })
          window.location.href = "/api/users/premium"
        } else {
         iziToast.error({
            title: "No se ha actualizado el usuario",
            message: "El usuario no tiene los documentos necesarios"
          })
        }
      })
      .catch(error => {
        console.log(error)
      })

  })
})


document.getElementById("deleteInactiveUsers").addEventListener('click', async () => {
  console.log("Eliminando usuarios inactivos")
  await fetch(`/api/users`, {
    method: 'DELETE',
  })
    .then(response => {
      if (response.ok) {
        iziToast.success({
          title: "Usuarios eliminados",
        })
        setTimeout(() => {
          window.location.href = "/api/users/premium"

        }, 1000);
      } else {
        iziToast.error({
          title: "Ha ocurrido un error",
        })
      }
    })
    .catch(error => {
      console.log(error)
    })


})
