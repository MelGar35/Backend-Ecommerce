import multer from "multer"
import __dirname from "../dirname.js"

const storage = multer.diskStorage({

  destination: function(req, file, callback) {
    let folder = ''

    if (file.fieldname === 'profilePic') {
      folder = 'profile';
    } else if (file.fieldname === 'productImage') {
      folder = 'products';
    } else {
      folder = 'documents';
    }

  callback(null, process.cwd() + `/src/uploads/${folder}`)
},
  filename: function(req, file, callback) {

    if (file.fieldname === 'profilePic') {
      callback(null, `profileImage-${req.user.user}`)
    } else if (file.fieldname === 'productImage') {
      callback(null, `${file.originalname}-${Date.now()} -Owner: ${req.user.user}`)
    } else {
      callback(null, `${file.fieldname}-from user: ${req.user.user}`)
    }
  }
})


export const uploader = multer({ storage: storage })