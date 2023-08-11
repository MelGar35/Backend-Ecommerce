
//"Agregar al carrito"
const addToCartButtons = document.querySelectorAll('.add-to-cart');
addToCartButtons.forEach(button => {
  button.addEventListener('click', () => {
    const productId = button.dataset.productId;
    addToCart(productId);
  });
});
// Eliminar productos
const deleteButtons = document.querySelectorAll('#deleteProduct');
deleteButtons.forEach(button => {
  button.addEventListener('click', event => {
    const itemId = event.target.dataset.id;
    let cid = document.getElementById("cid").textContent;
    let result;
    fetch(`/api/carts/${cid}/products/${itemId}`, {
      method: 'DELETE'
    })
      .then(response => {
        console.log(response)
        if (response.ok) {
          iziToast.success({
            title: "Producto eliminado de carrito"
          })
          setTimeout(() => {
            window.location.href = `/api/carts/${cid}`
          }, 1200);
        } else if (response.status !== 200) {
          iziToast.error({
            title: "Ups",
          })
          result = response
          return response.json()
        }
      }
      )
      .then(data => {
        if (!result.ok) {
         iziToast.error({
            title: "Ha ocurrido un error",
            message: data.message
          })
        }
      })
  });
});

// Función para agregar un producto al carrito mediante una petición fetch
function addToCart(productId, quantity) {

  let result = {};
  let cid = document.getElementById("cid").textContent;
  console.log(productId)
  console.log("CID" + cid)
  console.log(quantity)
  fetch(`/api/carts/${cid}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ pid: productId, quantity }) // Enviar la cantidad como parte del cuerpo de la solicitud
  })
    .then(response => {
      console.log(response)
      if (response.ok) {
        iziToast.success({
          title: "Producto agregado a carrito"
        })
        setTimeout(() => {
          window.location.href = `/api/carts/${cid}`
        }, 1600);
      } else if (response.status !== 200) {
        iziToast.error({
          title: "Ups",
        })
        result = response
        return response.json()
      }
    }
    )
    .then(data => {
      console.log(data)
      console.log(result)
      if (!result.ok) {
        if (data) {
         iziToast.error({
            title: "Ha ocurrido un error",
            message: data.message
          })
        }
      }
    })
}

// Mostrar/ocultar el modal
const modal = document.querySelector('.modal');
const modalClose = document.querySelector('.close');
const viewCartLink = document.querySelector('#openModalBtn');

function openModal() {
  modal.style.display = 'block';
  fetchProductList(); // Obtener la lista de productos mediante una petición fetch

  // Agregar evento clic al fondo oscuro del modal
  modal.addEventListener('click', closeModal);
  // Evitar que el clic en el contenido del modal cierre el modal
  modalContent.addEventListener('click', event => event.stopPropagation());
  // modal.style.display = 'block';
  // fetchProductList(); // Obtener la lista de productos mediante una petición fetch
}

function closeModal() {


  if (e.target === modal) {
    modal.style.display = 'none';
    // Eliminar el evento clic del fondo oscuro del modal al cerrarlo
    modal.removeEventListener('click', closeModal);
  }
}

modalClose.addEventListener('click', closeModal);
viewCartLink.addEventListener('click', openModal);

// Función para obtener la lista de productos mediante una petición fetch
function fetchProductList() {
  fetch('/api/products?json=true')
    .then(response => response.json())
    .then(data => {
      const productList = document.getElementById('product-list');
      productList.innerHTML = ''; // Limpiar la lista antes de agregar los productos

      // Crear la tabla con la clase CSS modal-table
      const table = document.createElement('table');
      table.classList.add('modal-table');

      const thead = document.createElement('thead');
      thead.classList.add("tablehead")
      const tbody = document.createElement('tbody');

      // Crear encabezados de la tabla
      const headerRow = document.createElement('tr');
      const headers = ['Title', 'Description', 'Category', 'Price', 'Stock', 'Cantidad', 'Acciones'];
      headers.forEach(headerText => {
        const th = document.createElement('th');
        th.textContent = headerText;
        headerRow.appendChild(th);
      });
      thead.appendChild(headerRow);
      table.appendChild(thead);

      // Agregar cada producto a la tabla
      data.docs.forEach(product => {
        const row = document.createElement('tr');
        const { _id, title, description, category, price, stock } = product;

        // Agregar celdas con los datos del producto
        const cells = [title, description, category, price, stock];
        cells.forEach(cellText => {
          const cell = document.createElement('td');
          cell.textContent = cellText;
          row.appendChild(cell);
        });

        // Agregar celda con el input de cantidad
        const quantityCell = document.createElement('td');
        const quantityInput = document.createElement('input');
        quantityInput.type = 'number';
        quantityInput.min = 0;
        quantityInput.max = stock;
        quantityInput.value = 0;
        quantityCell.appendChild(quantityInput);
        row.appendChild(quantityCell);

        // Agregar botón de agregar al carrito
        const addToCartButton = document.createElement('button');
        addToCartButton.textContent = 'Agregar al carrito';
        addToCartButton.addEventListener('click', () => {
          const quantity = parseInt(quantityInput.value, 10);
          if (quantity > 0 && quantity <= stock) {
            addToCart(_id, quantity);
          }
        });
        const actionsCell = document.createElement('td');
        actionsCell.appendChild(addToCartButton);
        row.appendChild(actionsCell);

        tbody.appendChild(row);
      });

      table.appendChild(tbody);
      productList.appendChild(table);
    })
    .catch(error => {
      console.error(error);
    });
}

// FUNCIONALIDAD PARA MODIFICAR STOCK DE CARRITO


// Obtener todas las filas de la tabla
let rows = document.querySelectorAll("table tbody tr");
let originalQuantity = null;
// Agregar el botón y el evento de clic a cada fila
rows.forEach(function(row) {
  let modifyButton = document.createElement("button");
  modifyButton.innerText = "Modificar Cantidad";
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
    if (i === 4) {
      const quantityCell = document.createElement('td');
      const quantityInput = document.createElement('input');
      quantityInput.type = 'number';
      quantityInput.min = 0;
      quantityInput.max = parseInt(cells[5].innerText);
      quantityInput.value = parseInt(cells[i].innerText);

      // Al habilitar la edición, almacenar el contenido original de la celda
      originalQuantity = cells[i].innerText;

      quantityCell.appendChild(quantityInput);
      cells[i].replaceWith(quantityCell);
    }
  }

  row.classList.add("editable-row");
}

// function restrictToNumbers(event) {
//   let input = event.target;
//   let value = input.innerText;
//   let numbersOnly = value.replace(/[^\d]/g, "");
//   input.innerText = numbersOnly;
// }
function disableRowEdit(row) {
  let cells = row.cells;
  for (let i = 0; i < cells.length; i++) {
    cells[i].removeAttribute("contenteditable");
  }

  // Obtener el input de cantidad modificado
  const quantityInput = cells[4].querySelector("input");
  if (quantityInput) {
    const modifiedQuantity = quantityInput.value;
    cells[4].innerText = modifiedQuantity;
  }

  row.classList.remove("editable-row");
  let deactivate = true
  darkenOtherRows(row, deactivate)
}

function darkenOtherRows(row, deactivate) {
  let allRows = document.querySelectorAll("table tbody tr");
  allRows.forEach(function(r) {
    if ((r !== row) && !deactivate) {
      r.classList.add("darkened-row");
    } else {
      r.classList.remove("darkened-row")
    }
  });
}

// Función para enviar los datos de una fila modificada al servidor
async function sendRowData(row) {
  console.log("Enviando informacion")
  let cid = document.getElementById("cid").textContent;
  let quantity = parseInt(row.cells[4].querySelector("input").value);
  let pid = row.cells[6].innerText

  let stock = parseInt(row.cells[5].innerText)

  if (quantity > stock) {
    row.cells[4].querySelector("input").value = stock
    quantity = stock
  }




  fetch(`/api/carts/${cid}/products/${pid}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ quantity })
  })
    .then(function(response) {
      console.log(response)
      if (response.ok) {
        iziToast.success({
          title: "Producto modificado exitosamente!"
        })
        setTimeout(() => {
          window.location.href = `/api/carts/${cid}`
        }, 500);
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

document.getElementById("purchaseButton").addEventListener('click', async () => {


  let cid = document.getElementById("cid").textContent
  await fetch(`/api/carts/${cid}/purchase`, {// 
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
  })
    .then(response => {
      if (response.ok) {
        iziToast.success({
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
        iziToast.error({
          title: "Ha ocurrido un error",
          message: data.message
        })
      }
    })
})

