import twilio from "twilio"
import config from "../config/config.js"
import { logger } from "../utils/logger.js"
import { CartsService as cartsServices, ProductService } from "../repositories/index.js"


class cartsValidator {

  async getCarts(limit) {
    try {
      const carts = await cartsServices.getCarts(limit)
      return carts
    } catch (error) {
      return error
    }
  }

  async getCartById(cid) {
    try {
      const carts = await cartsServices.getCartById(cid)
      return carts
    } catch (error) {
      throw new Error('Carrito no encontrado')
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
    throw new Error("Un usario premium no puede agregar al carrito sus propios productos")
  }
    let cart = await this.getCartById(cid)

    let foundInCart = (cart.products.find(el => (el.product._id).toString() === product.product))
    let productIndex = (cart.products.findIndex(el => (el.product._id).toString() === product.product))
    
    try {
      if (foundInCart != undefined) {
        logger.warning("Se esta intentando agregar mas productos de los que hay")
        let productStock = cart.products[productIndex].product.stock
        // Ubicamos la cantidad solicitada en el carrito, y la sumamos con esta cantidad
        let totalAmount = product.quantity + cart.products[productIndex].quantity
        let pidInCart = cart.products[productIndex]._id.toString()
        // La cantida total no puede superar la cantidad de stock que tenemos en el producto, si la supera, va a ser directamente el total
        if (totalAmount > productStock) totalAmount = productStock
        // Una vez ubicamos su id, llamamos a la funcion para actualizar la cantidad
        await cartsServices.updateQuantityToCart(cid, pidInCart, totalAmount)
      } else {
        await cartsServices.updateCart(cid, product)

      }
    } catch (error) {
      throw new Error(error)
    }
  }

  async updateQuantityFromCart(cid,pid, quantity) {
    try {
      if (!cid) throw new Error("Se ha extraviado el Id del carrito")
      if (!pid) throw new Error("Se ha extraviado el Id del producto")
      if (!quantity) throw new Error("Se ha extraviado la cantidad")
      await cartsServices.updateQuantityToCart(cid,pid,quantity) 
    } catch (error) {
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
    if (!cid) throw new Error("Se ha extraviado el Id del carrito")
    try {
      await cartsServices.emptyCart(cid)
    } catch (error) {
      return error;
    }
  }

  async purchase(cid, user) {

  
    const cartInExistence = await cartsServices.getCartById(cid)
    if (!cartInExistence) throw new Error("Se ha extraviado el Id del carrito")
    if (!user) throw new Error("No se encuentra al usuario")
    if (cartInExistence.products.length === 0) throw new Error("No hay productos en carrito")

    try {

      const client = twilio(config.TWILIO_ACCOUNT_SID, config.TWILIO_AUTH_TOKEN)
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
      try{
      client.messages.create({
        body: `Gracias por tu Compra`,
        from: config.TWILIO_PHONE_NUMBER,
        to: user.phone //poner +54 o va salir error
      })
      .catch(e => {
        return e
      })
    return { ticket: ticket, unOrderedProducts: unOrderedProducts, message: "Los productos no agregados no se encuentran en stock" };
      } catch (error) {
    throw new Error(error)
      }
      } catch (error) {
    throw new error(error)
}
}
}

export default new cartsValidator()