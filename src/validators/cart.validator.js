import twilio from "twilio"
import config from "../config/config.js";

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

  async updateCart(cid, product) {
    //chequeando productos en bd
   let enExistencia = await productServices.findById(product.product)
    try {
      if (!cid) throw new Error("Missing CID")
      if (!enExistencia) throw new Error("Product not found in DB")
      
      await cartsServices.updateCart(cid,product)
    } catch (error) {
      return error;
    }
  }

  async updateQuantityFromCart(cid,pid, quantity) {
    try {
      if (!cid) throw new Error("Missing CID")
      if (!pid) throw new Error("Missing PID")
      if (!quantity) throw new Error("Missing QUANTITY")
      await cartsServices.updateQuantityToCart(cid,pid,quantity) } catch (error) {
      return error;
    }
  }



  async deleteProductFromCart(cid,pid) {
    try {
      if (!pid) throw new Error("Missing Pid")
      if (!cid) throw new Error("Missing Cid")
      await cartsServices.deleteProductFromCart(cid,pid)
    } catch (error) {
      return error;
    }
  }


  async emptyCart(cid) {
    try {
      if (!cid) throw new Error("Missing Cid")
      await cartsServices.emptyCart(cid)
    } catch (error) {
      return error;
    }
  }

  async purchase(cid, user) {

    const client = twilio(config.TWILIO_ACCOUNT_SID, config.TWILIO_AUTH_TOKEN)
    const cartInExistence = await cartsServices.getCartById(cid)
    if (!cartInExistence) throw new Error("Missing Cart Id")
    if (!user) throw new Error("Missing user")
    if (cartInExistence.products.length === 0) throw new Error("No products in the cart")

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