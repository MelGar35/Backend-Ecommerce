import twilio from "twilio"
import config from "../config/config.js"
import { logger } from "../utils/logger.js"
import { CartsService as cartsServices, ProductService } from "../repositories/index.js"


class cartsValidator {

  async getCarts(limit) {
    try {
      const carts = await cartsServices.find(limit)
      return carts
    } catch (error) {
      return error;

    }
  }

  async getCartById(cid) {
    try {
      const carts = await cartsServices.findById(cid)
      return carts
    } catch (error) {
      return error
    }
  }

  async createCart(cart) {
    try {
      await cartsServices.createCart(cart)
    } catch (error) {
      return error;
    }
  }


  async updateCart(cid, product, user) {
    //chequeando productos en bd
    let enExistencia = await ProductService.getProductById(product.product)
    logger.debug(`Comprobando que el producto exista en la base de datos ${enExistencia}`)
    logger.debug(`El dueño del producto es ${enExistencia.owner}`)
    logger.debug(`El rol del usuario que intenta agregar el producto es : ${user.role}`)
  
  
    if (!cid) throw new Error("Se ha extraviado el Id del Carrito")
    if (!enExistencia) throw new Error("Producto no encontrado en la Base de datos")
    if (user.role === 'premium' && enExistencia.owner === user.user) {
    logger.debug(`Hemos entrado en la condicion necesaria`)
    throw new Error("Un usario premium no puede agregar al carrito sus propios productos")
  }
    try {
      await cartsServices.updateCart(cid, product)
    } catch (error) {
      return error;
    }
  }

  async updateQuantityFromCart(cid,pid, quantity) {
    try {
      if (!cid) throw new Error("Se ha extraviado el Id del carrito")
      if (!pid) throw new Error("Se ha extraviado el Id del producto")
      if (!quantity) throw new Error("Se ha extraviado la cantidad")
      await cartsServices.updateQuantityToCart(cid,pid,quantity) } catch (error) {
      return error;
    }
  }

  async deleteProductFromCart(cid,pid) {
    try {
      if (!pid) throw new Error("Se ha extraviado el Id del producto")
      if (!cid) throw new Error("Se ha extraviado el Id del carrito")
      await cartsServices.deleteProductFromCart(cid,pid)
    } catch (error) {
      return error;
    }
  }


  async emptyCart(cid) {
    try {
      if (!cid) throw new Error("Se ha extraviado el Id del carrito")
      await cartsServices.emptyCart(cid)
    } catch (error) {
      return error;
    }
  }

  async purchase(cid, user) {

    const client = twilio(config.TWILIO_ACCOUNT_SID, config.TWILIO_AUTH_TOKEN)
    const cartInExistence = await cartsServices.getCartById(cid)
    if (!cartInExistence) throw new Error("Se ha extraviado el Id del carrito")
    if (!user) throw new Error("No se encuentra al usuario")
    if (cartInExistence.products.length === 0) throw new Error("No hay productos en carrito")

    try {


      const cartToModify = cartInExistence;
      let newListProducts = []
      let amount = 0;

      cartToModify.products.forEach(async (product) => {

        let productToUpdate = product.product._id.toHexString()

        if (product.quantity === product.product.stock) { 

          newListProducts.push(product) 
          amount += product.quantity * product.product.price
          await cartsServices.deleteProductFromCart(cid, (product._id).toHexString())
          await ProductService.updateProduct(productToUpdate, { stock: 0 }) 
        } else if (product.quantity <= product.product.stock) {

          let newProductQuantity = product.product.stock - product.quantity 
          amount += product.quantity * product.product.price
          newListProducts.push(product)
          await ProductService.updateProduct(productToUpdate, { stock: newProductQuantity }) 
          await cartsServices.deleteProductFromCart(cid, (product._id).toHexString())
        }
      })


      let code = Math.random().toString(36).slice(2, 27)
      const ticket = {
        cart: newListProducts,
        purchaser: user.user,
        amount: amount,
        code: code
      }


      await cartsServices.purchase(ticket)


      let unOrderedProducts = await cartsServices.getCartById(cid)

      client.messages.create({
        body: `Gracias, ${nombre}, tu solicitud de producto ${producto}, ha sido aprobada`,
        from: config.TWILIO_PHONE_NUMBER,
        to: "+541153255380"
      })
      return { ticket: ticket, unOrderedProducts: unOrderedProducts, message: "Los productos no agregados son aquellos que superan las cantidades de stock disponible" };

    } catch (error) {
      return error

    }
  }
}

export default new cartsValidator()