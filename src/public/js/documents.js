
let uid = document.getElementById("UID").textContent
let route = `/api/users/${uid}/documents`



document.querySelectorAll("form").forEach(form => {
  form.addEventListener("change", event => {
    let fileUploadField = event.target;
    let fileUploadWrapper = fileUploadField.closest(".file-upload-wrapper");
    fileUploadWrapper.setAttribute("data-text", fileUploadField.files[0].name);
    // Mostrar el nombre del archivo en el campo de entrada
    let fileNameInput = fileUploadField.closest("form").querySelector("input[type='text']");
    if (fileNameInput) {
      fileNameInput.value = fileUploadField.files[0].name;
    }
  });
});





async function uploadFile(formInfo, inputInfo, event) {
  const form = document.getElementById(`${formInfo}`)
  const formData = new FormData(form)


  await fetch(route, { 
    method: 'POST',
    body: formData,

  })
    .then(() => {
      message.success({
        title: "Documento cargado"
      })
      console.log("Peticion realizada")
    })
    .catch(error => {
      message.error({
        title: "Ha ocurrido un error",
        message: error.message
      })
      console.log(error)
    })


}


document.getElementById("profilePicForm").addEventListener('change', async (event) => {
  event.preventDefault()
  uploadFile("profilePicForm")
})
document.getElementById("productImageForm").addEventListener('change', async (event) => {
  event.preventDefault()
  uploadFile("productImageForm")
})
document.getElementById("idForm").addEventListener('change', async (event) => {
  event.preventDefault()
  uploadFile("idForm")
})
document.getElementById("locationForm").addEventListener('change', async (event) => {
  event.preventDefault()
  uploadFile("locationForm")
})
document.getElementById("statusForm").addEventListener('change', async (event) => {
  event.preventDefault()
  uploadFile("statusForm")
})







// document.getElementById("productImageForm").addEventListener('change', async (event) => {
//   event.preventDefault()


//   const form = document.getElementById("productImageForm")
//   const formData = new FormData(form)



//   await fetch(route, {// 
//     method: 'POST',
//     body: formData
//   })
//     .then(() => {
//       console.log("Peticion realizada")
//       location.reload()
//     })
//     .catch(error => {
//       console.log(error)
//     })


// })



// document.getElementById("documentForm").addEventListener('change', async (event) => {
//   event.preventDefault()


//   const form = document.getElementById("documentForm")
//   const formData = new FormData(form)

//   await fetch(route, {// 
//     method: 'POST',
//     body: formData
//   })
//     .then(() => {
//       console.log("Peticion realizada")
//       location.reload()
//     })
//     .catch(error => {
//       console.log(error)
//     })


// })



