import nodemailer from "nodemailer"
import cartValidator from "../validators/cart.validator.js"
import config from "../config/config.js"


const transport = nodemailer.createTransport({
  service: "gmail",
  port: 587,
  auth: {
    user: config.NODEMAILER_ACCOUNT,
    pass: config.NODEMAILER_PASS,
  },
})

class cartController {
  async getCarts(req, res) {
    const limit = parseInt(req.query.limit)
    const json = (req.query.json)

    try {
      const result = await cartValidator.getCarts(limit)
      req.logger.debug(result)
      if (json) res.status(200).json(result)
      else res.render('carts', {result})
    } catch (error) {
      req.logger.error(`Funcion getCarts en controlador: ${error.message}`)
      res.json(error)
    }
  }

  async getCartById(req, res) {
    let json = req.query.json
    try {

      const result = await cartValidator.getCartById(req.params.cid)
      req.logger.debug(`Resultado de getCartbyId en controler ${result}`)
      if (json) res.status(200).json(result)
      else res.render('cartById', { result, title: "Search Cart"})
    } catch (error) {
      req.logger.error(`Funcion getCartById en controlador: ${error.message}`)
      res.status(404).json(error.message)
    }
  }

  async createCart(req, res) {
    console.log(req.user.user)
    try {
      await cartValidator.createCart()
      await transport.sendMail({
        from: 'Melisa <nicecup.ventas@gmail.com>',
        to: req.user.user,
        subject: "Nuevo Carrito Creado",
        html: `
         <div>
          <h1> Has creado tu carrito exitosamente! link</h1>
        </div> `
        ,attachments: []
      })
      req.logger.info("Mail enviado")
      res.status(201).json({ info: 'Carrito Creado' })
    } catch (error) {
      req.logger.error(`Funcion createCart en controlador: ${error.message}`)
      res.status(400).json({ info: `Algo salio mal: ${error}` })
    }
  }


  async updateCart(req, res) {
    const cid = (req.params.cid)
    const {quantity,pid} = req.body;
    const product = {product: pid, quantity: quantity}
    let responseSent = false
    try {
      const user = req.user
      await cartValidator.updateCart(cid, product, user)
      req.logger.info("El producto ha sido actualizado")
      res.status(200).json({ message: "Producto agregado al carrito", payload: await cartValidator.getCartById(cid) })
      responseSent = true
    } catch (error) {
      if (responseSent = false) {
        req.logger.error(`Funcion updateCart en controlador: ${error.message}`)
        res.status(400).json({ error: error.message })
        responseSent = true
      }
    }
  }

  async updateQuantityFromCart(req, res) {
    req.logger.debug("Actualizando cantidad de producto")
    const {cid, pid} = req.params
    const {quantity} = req.body
    try {
      await cartValidator.updateQuantityFromCart(cid, pid, quantity)
      req.logger.info("La cantidad del producto fue actualizada")
      res.json({ message: "Quantity Updated", payload: await cartValidator.getCartById(cid) })
    } catch (error) {
      console.log(error)
      req.logger.error(`Funcion updateQuantityFromCart en controlador: ${error.message}`)
      res.json({ error: error })
    }
  }

  async deleteProductFromCart(req, res) {
    const {cid,pid} = req.params;
    try {
      await cartValidator.deleteProductFromCart(cid, pid)
      req.logger.info("Producto eliminado del carrito")
      res.json({ message: `PID: ${pid} has been deleted from cart ${cid}`, payload: await cartValidator.getCartById(cid) })
    } catch (error) {
      req.logger.error(`Funcion deleteProductFromCart en controlador: ${error.message}`)
      res.json({ error: error.message })
    }
  }

  async emptyCart(req, res) {
    let {cid} = (req.params)
    try {
      await cartValidator.emptyCart(cid)
      req.logger.info("El carrito ha sido vaciado")
      res.json({
        status: 200,
        message: "Carrito Eliminado"})
    } catch (error) {
      req.logger.error(`Funcion emptyCart en controlador: ${error.message}`)
      res.json({
        error
      })
    }}

  async purchase(req, res) {
    let {cid} = req.params
    let user = req.user

    try {
      const result = await cartValidator.purchase(cid, user)
      req.logger.info("El carrito ha sido comprado")
      res.json({message: "Se ha generado el ticket Nº:",result,})
    } catch (Error) {
      req.logger.error(`Funcion purchase en controlador: ${Error.message}`)
      res.json({error: Error.message})
    }
  }
}

export default new cartController()