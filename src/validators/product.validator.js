//import productServices from "../services/product.services.js"
import { ProductService as productServices } from "../repositories/index.js";
import CustomError from "../utils/CustomError.js"
import ErrorList from "../utils/ErrorList.js"
import generateProductError from "../utils/generateProductError.js"
import mockingProductGenerator from "../utils/mockingProductGenerator.js"

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
    try {
      const products = await productServices.findById(pid)
      return products
    } catch (error) {
      return error
    }
  }

  async createProduct(title, description, category, price, thumbnailName, code, stock) {
    if (!title || !description || !category || !price || !thumbnailName || !code || !stock) {
      CustomError.createError({
        name: 'Error creating product',
        cause: generateProductError({ title, description, category, price, code, stock }),
        message: "Error trying to create product",
        code: ErrorList.MISSING_DATA
      })
    }



    try {
      const product = { title, description, category, price, thumbnailName, code, stock }
      return await productServices.createProduct(product)
    } catch (error) {
      return error;
    }
  }



  async deleteProduct(pid) {
    try {
      if (!pid) throw new Error("Missing product Id")
      await productServices.deleteProduct(pid)
    } catch (error) {
      return error;
    }
  }


}


export default new productValidator()

