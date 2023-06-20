// Busqueda de productos
document.getElementById("productSearch").addEventListener('submit', async (event) => {
  event.preventDefault();
  console.log("Iniciando busqueda");
  let nombreProducto = document.getElementById("searchTitle").value;

  try {
    const response = await fetch('/api/products?json=true');
    const data = await response.json();

    const productoEncontrado = data.docs.find(producto => producto.title === nombreProducto);

    if (productoEncontrado) {
      const productoId = productoEncontrado._id;
      const res = await fetch(`/api/products/${productoId}`);

      if (res.ok) {
        message.success({
          title: "Producto encontrado"
        });
        setTimeout(() => {
          window.location.href = `/api/products/${productoId}`;
        }, 1000);
      } else {
        message.error({
          title: "Producto no encontrado"
        });
      }
    } else {
      message.error({
        title: "No hay ningún producto con ese nombre"
      });
      // Resto de la lógica...
    }
  } catch (error) {
    console.log('Error al obtener los productos de la API:', error);
  }
});

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
  console.log(rowData);
  let pid = row.cells[5].innerText;
  console.log(pid);

  fetch(`/api/products/${pid}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(rowData)
  })
    .then(function(response) {
      console.log(response);
      if (response.ok) {
        // Si la respuesta es exitosa, puedes realizar acciones adicionales si es necesario
        iziToast.success({
          title: "Producto modificado exitosamente!"
        });
        setTimeout(() => {
          window.location.href = "/api/products";
        }, 1500);
      } else {
        throw new Error("Error en la solicitud");
      }
    })
    .catch(function(error) {
      console.error(error);
    });
}

