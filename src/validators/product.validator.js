//import productServices from "../services/product.services.js"
import { ProductService as productServices } from "../repositories/index.js";
import CustomError from "../utils/CustomError.js"
import ErrorList from "../utils/ErrorList.js"
import generateProductError from "../utils/generateProductError.js"
import mockingProductGenerator from "../utils/mockingProductGenerator.js"
import {logger} from "../utils/logger.js"
import config from "../config/config.js"
import nodemailer from "nodemailer"

const transport = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: config.NODEMAILER_ACCOUNT,
    pass: config.NODEMAILER_PASS,
  }
})

class productValidator {

  async getProducts(limit, query, sort, page) {
    try {
      const products = await productServices.getProducts(limit, query, sort, page)
      return products
    } catch (error) {
      return error;
    }
  }

  async getMockingProducts() {
    try {
      const products = mockingProductGenerator()
      return products;
    } catch (error) {
      return error
    }
  }

  async getProductById(pid) {
    if (!pid) throw new Error("Se ha extraviado el Id del producto")
    try {
      const products = await productServices.getProductById(pid)
      console.log(products)
      return products
    } catch (error) {
      throw new Error('Producto no encontrado')
    }
  }

  async createProduct(title, description, category, price, thumbnailName, code, stock, owner) {
    if (!title || !description || !category || !price || !thumbnailName || !code || !stock || !owner) {
      CustomError.createError({
        name: 'Error al crear el producto',
        cause: generateProductError({ title, description, category, price, code, stock }),
        message: "Error tratando de crear producto",
        code: ErrorList.MISSING_DATA
      })
    }

    if (typeof (title) !== 'string' || typeof (description) !== 'string' || parseInt(stock) === 'NaN' || parseInt(price) === 'NaN' || typeof (code) !== 'string') {
      throw new Error("Uno de los campos no es correcto, como poner letras en donde van numeros")
    }

    try {
      const product = { title, description, category, price, thumbnailName, code, stock, owner }
      return await productServices.createProduct(product)
    } catch (error) {
      throw new Error(error)
    }
  }

  async updateProduct(pid, updatedProduct) {
    try {
      if (!pid) throw new Error("Se ha extraviado el Id del producto")
      if (updatedProduct.code) throw new Error("El campo codigo no puede ser modificado")
      await productServices.updateProduct(pid, updatedProduct)
    } catch (error) {
      return error;
    }
  }

  async deleteProduct(pid, role) {
    try {
      if (!pid) throw new Error("Se ha extraviado el Id del Producto")
      if (!role) throw new Error("No se encuentra el rol")
      logger.debug(`El pid es: ${pid}`)

      const product = await productServices.getProductById(pid)

      logger.debug(`El producto buscado es ${product}`)
      logger.debug(`El rol del usuario es : ${role}`)
      logger.debug(`El rol del dueño del producto es: ${product.owner}`)

      console.log(product.owner)
      console.log(user)
      if (product.owner === 'admin' && role === 'premium') {
        logger.error("intentando eliminar producto sin permisos")
        throw new Error("Error eliminando producto por permisos")
      }


      if (((product.owner === user) && role === 'premium') || role === "admin") {
        await transport.sendMail({
        from: 'Melisa <nicecup.ventas@gmail.com>',
        to: user,
        subject: 'Su producto ha sido eliminado',
        html:`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <title>Su producto ha sido eliminado</title>
        </head>
        <body>
          <div>
            <h1>Producto Eliminado</h1>
            <p>Estimado/a Usuario/a,</p>
            <p>Se ha seleccionado el producto para eliminar,  con las siguientes caracteristicas:</p>
        <ul>
          <li>Nombre:${product.title}</li>
          <li>Descripcion: ${product.description}</li>
          <li>Categoria: ${product.category}</li>
          <li>Precio: $ ${product.price}</li>
        </ul>
            <p>Si tienes alguna pregunta o necesitas ayuda, por favor contáctanos.</p>
            <p>Gracias,</p>
            <p>Shanti</p>
          </div>
        </body>
        </html>`, 
        attachments: []
                })
                await productServices.deleteProduct(pid)
              } else {
                throw new Error("No estas autorizado para realizar esta operacion, no eres dueño del producto")
              }
            } catch (error) {
              throw new Error(error)
            }
          }
        }


export default new productValidator()

