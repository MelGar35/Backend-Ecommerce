
document.getElementById("newCart").addEventListener('submit', async (event) => {
  event.preventDefault()
  console.log("Creando carrito")
  let result;
  await fetch(`/api/carts`, {// 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    }
  })
    .then(response => {
      if (response.ok) {
        message.success({
          title: "Nuevo carrito creado"
        })
        setTimeout(() => {
          window.location.href = "/api/carts"
        }, 1300);
      } else {
        result = response
        return response.json()
      }
    }
    )
    .then(data => {
      if (!result.ok) {
        message.error({
          title: "Ha ocurrido un problema",
          message: data.message
        })
      }
    })



})


const purchaseButtons = document.querySelectorAll('#purchaseButton');
purchaseButtons.forEach(button => {


  button.addEventListener('click', async (event) => {
    event.preventDefault()
    const cid = event.target.dataset.id
    let result;

    await fetch(`/api/carts/${cid}/purchase`, {// 
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(response => {
        if (response.ok) {
          message.success({
            title: "Carrito adquirido"
          })
          setTimeout(() => {
            window.location.href = "/api/carts"
          }, 2000);
        } else {
          result = response
          return response.json()
        }
      }
      )
      .then(data => {
        if (!result.ok) {
          message.error({
            title: "Ha ocurrido un error",
            message: data.message
          })
        }
      })
  });
});


// document.getElementById("purchaseButton").addEventListener('click', async (event) => {
//   event.preventDefault()
//   let cid = document.getElementById('cid').value
//   let data = {
//     pid: document.getElementById('pid').value,
//     quantity: document.getElementById('quantity').value
//   }


//   await fetch(`/api/carts/${cid}`, {// 
//     method: 'PUT',
//     headers: {
//       'Content-Type': 'application/json'
//     },
//     body: JSON.stringify(data)
//   }).then(res => res.json())
//     .then(data => {
//       document.getElementById("message").innerHTML = "Se ha hecho la peticion, puedes comprobarlo en el carrito seleccionado, si eres premium no puedes agregar a tu carrito tus propios productos."
//       document.getElementById("cid").value = ""
//       document.getElementById("pid").value = ""
//       document.getElementById("quantity").value = ""


//     }

//     )


// })


