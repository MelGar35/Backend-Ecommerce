

document.getElementById("sendButton").addEventListener('click', async (event) => {
  event.preventDefault()
  let uid = document.getElementById('uid').value
  let data = {
    role: document.getElementById('role').value,
  }
  console.log(data)
  await fetch(`/api/session/changetopremium/${uid}`, {// 
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
    .then(() => {
      console.log("Peticion realizada")
      location.reload()
    })
    .catch(error => {
      console.log(error)
    })


})


