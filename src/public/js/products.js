// Busqueda de productos

document.getElementById("productSearch").addEventListener('submit', async (event) => {
  event.preventDefault();
  console.log("Iniciando busqueda");
  const nombreProducto = document.getElementById("searchTitle").value;

  fetch('/api/products?json=true')
    .then(response => response.json())
    .then(data => {

// Buscar el producto por nombre en el array de productos
      console.log(data.docs)
      const productoEncontrado = data.docs.find(producto => producto.title === nombreProducto);


      if (productoEncontrado) {
        const productoId = productoEncontrado._id;

// Realizar la segunda petición Fetch utilizando el ID del producto
  fetch(`/api/products/${productoId}`)
    .then(res => {
      if (res.ok) {
        iziToast.success({
        title: "Producto encontrado"
    })
    setTimeout(() => {
    window.location.href = `/api/products/${productoId}`
    }, 1000);
    } else {
      iziToast.error(
    { title: "Producto no encontrado" }
            )
    }
    })
    .catch(error => {
        console.log('Error al buscar el producto en la base de datos:', error);
      });
      } else {
        iziToast.error({
          title: "No hay ningun producto con ese nombre"
        })
        // Resto de la lógica...
      }
    })
    .catch(error => {
      console.log('Error al obtener los productos de la API:', error);
    });
})

// FUNCIONALIDAD PARA MODIFICAR STOCK DE PRODUCTO

// Obtener todas las filas de la tabla
let rows = document.querySelectorAll("table tbody tr");

// Agregar el botón y el evento de clic a cada fila
rows.forEach(function(row) {
  let modifyButton = document.createElement("button");
  modifyButton.innerText = "Modificar";
  modifyButton.addEventListener("click", function() {
    toggleRowEdit(row);
  });

  let actionCell = document.createElement("td");
  actionCell.appendChild(modifyButton);

  row.appendChild(actionCell);
});

function toggleRowEdit(row) {
  if (row.classList.contains("editable-row")) {
    // Si la fila está en modo edición, enviar los cambios al servidor
    sendRowData(row);
    disableRowEdit(row);
  } else {
    // Si la fila no está en modo edición, activar la edición
    enableRowEdit(row);
    darkenOtherRows(row);
  }
}

function enableRowEdit(row) {
  let cells = row.cells;
  for (let i = 0; i < cells.length; i++) {
    // Excluir la columna "ID de producto" de la edición
    if (i !== 5 && i !== 6) {
      cells[i].setAttribute("contenteditable", "true");
    }
  }

  row.classList.add("editable-row");
}

function disableRowEdit(row) {
  let cells = row.cells;
  for (let i = 0; i < cells.length; i++) {
    cells[i].removeAttribute("contenteditable");
  }

  row.classList.remove("editable-row");
}

function darkenOtherRows(row) {
  let allRows = document.querySelectorAll("table tbody tr");
  allRows.forEach(function(r) {
    if (r !== row) {
      r.classList.add("darkened-row");
    }
  });
}

// Función para enviar los datos de una fila modificada al servidor
function sendRowData(row) {
  let rowData = {
    title: row.cells[0].innerText,
    description: row.cells[1].innerText,
    category: row.cells[2].innerText,
    price: parseFloat(row.cells[3].innerText.replace("$", "")),
    stock: parseInt(row.cells[4].innerText),
  };
  console.log(rowData)
  let pid = row.cells[5].innerText
  console.log(pid)


  fetch(`/api/products/${pid}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(rowData)
  })
    .then(function(response) {
      console.log(response)
      if (response.ok) {
        // Si la respuesta es exitosa, puedes realizar acciones adicionales si es necesario
        iziToast.success({
          title: "Producto modificado exitosamente!"
        })
        setTimeout(() => {
          window.location.href = "/api/products"
        }, 1500);
      } else {
        iziToast.error({
          title: "No se ha podido modificar el producto"
        })
        throw new Error("Error en la solicitud");
      }
    })
    .catch(function(error) {
      console.error(error);
    });
}

document.getElementById("nuevoProducto").addEventListener('submit', async (event) => {

  event.preventDefault()
  console.log("En funcion carga de nuevo producto")



  var formValues = {
    title: document.getElementsByName("title")[0].value,
    description: document.getElementsByName("description")[0].value,
    category: document.getElementsByName("category")[0].value,
    price: parseInt(document.getElementsByName("price")[0].value),
    thumbnail: document.getElementsByName("thumbnail")[0].files[0],
    code: document.getElementsByName("code")[0].value,
    stock: parseInt(document.getElementsByName("stock")[0].value)
  };
  let formData = new FormData();
  for (let key in formValues) {
    formData.append(key, formValues[key]);
  }

  let result = {};
  await fetch('/api/products', {// 
    method: 'POST',
    body: formData
  })
    .then(response => {
      if (response.ok) {
        iziToast.success({
          title: "Producto Creado!"
        })
        setTimeout(() => {
          window.location.href = "/api/products"
        }, 2000);
        result.ok = true
      } else {
        result = response
        return response.json()
      }
    }
    )
    .then(data => {
      if (!result || !result.ok) {
        iziToast.error({
          title: "Ha ocurrido un error",
          message: data.message
        })
      }
    })



})

const fetchMessage = document.getElementById("fetchMessage")
const deleteMessage = document.getElementById("deleteMessage")

const deleteButtons = document.querySelectorAll('#deleteProduct');

deleteButtons.forEach(button => {
  button.addEventListener('click', event => {
    const itemId = event.target.dataset.id;
    fetch(`/api/products/${itemId}`, {
      method: 'DELETE'
    })
      .then(response => {
        if (!response.ok) {
          iziToast.error({
            title: "Ups",
            message: "No tienes permisos para realizar esta tarea"
          })
        } else {
          iziToast.success({
            title: "Producto eliminado"
          })
          setTimeout(() => {
            window.location.href = "/api/products"

          }, 800);
        }
      })
      .catch(error => {
        console.error('Error al eliminar el elemento', error);
      });
  });
});

