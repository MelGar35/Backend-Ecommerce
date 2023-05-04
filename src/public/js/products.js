
document.getElementById("cartButton").addEventListener('click', async (event) => {
  event.preventDefault()
  let cid = document.getElementById('cid').value
  let data = {
    pid: document.getElementById('pid').value,
    quantity: document.getElementById('quantity').value
  }
  console.log(data)
  await fetch(`/api/carts/${cid}`, {// 
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  }).then(res => res.json())
    .then(data => {
      document.getElementById("message").innerHTML = "Se ha hecho la peticion, puedes comprobarlo en el carrito seleccionado, si eres premium no puedes agregar a tu carrito tus propios productos."
      document.getElementById("cid").value = ""
      document.getElementById("pid").value = ""
      document.getElementById("quantity").value = ""
    })
})

const fetchMessage = document.getElementById("fetchMessage")

const deleteButtons = document.querySelectorAll('#deleteProduct');

deleteButtons.forEach(button => {
  button.addEventListener('click', event => {
    const itemId = event.target.dataset.id;
    fetch(`/api/products/${itemId}`, {
      method: 'DELETE'
    })
      .then(response => {
        if (!response.ok) {
          fetchMessage.innerHTML = "No tienes permisos para eliminar este producto"
        } else {
          window.location.href = "/api/products"
        }
      })
      .catch(error => {
        console.error('Error al eliminar el elemento', error)
      })
  })
})
