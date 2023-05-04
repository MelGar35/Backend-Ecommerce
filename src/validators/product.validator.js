//import productServices from "../services/product.services.js"
import { ProductService as productServices } from "../repositories/index.js";
import CustomError from "../utils/CustomError.js"
import ErrorList from "../utils/ErrorList.js"
import generateProductError from "../utils/generateProductError.js"
import mockingProductGenerator from "../utils/mockingProductGenerator.js"
import {logger} from "../utils/logger.js"

class productValidator {

  async getProducts(limit, query, sort, page) {
    try {
      const products = await productServices.find(limit, query, sort, page)
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
      return error
    }
  }

  async createProduct(title, description, category, price, thumbnailName, code, stock, owner) {
    if (!title || !description || !category || !price || !thumbnailName || !code || !stock || !owner) {
      CustomError.createError({
        name: 'Error al crear el producto',
        cause: generateProductErrorInfo({ title, description, category, price, code, stock }),
        message: "Error tratando de crear producto",
        code: ErrorList.MISSING_DATA
      })
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
      await productServices.editProduct(pid, updatedProduct)
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


      if (product.owner === 'admin' && role === 'premium') {
        logger.error("intentando eliminar producto sin permisos")
        throw new Error("Error eliminando producto por permisos")
      }
      await productServices.deleteProduct(pid)
    } catch (error) {
      return error;
    }
  }
}

export default new productValidator()

