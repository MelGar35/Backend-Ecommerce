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

class CartController {
  async getCarts(req, res) {
    const limit = parseInt(req.query.limit)

    try {
      const result = await cartValidator.getCarts(limit)
      req.logger.debug(result)
      res.render('carts', {result})
    } catch (error) {
      res.json(error)
    }
  }

  async getCartById(req, res) {
    const { cid } = req.params;

    try {
      const carts = await cartValidator.getCartById(cid);
      req.logger.debug(`Resultado de getCartbyId ${carts}`);
      res.render("cartById", { carts });
    } catch (error) {
      res.json(error);
    }
  }


  async createCart(req, res) {
    try {
      await cartValidator.createCart()
      await sendCartCreationEmail(req.user.user);
      req.logger.info("Mail enviado")
    } catch (error) {
      req.logger.error("Ha ocurrido un error", error)
      res.status(400).json({
        info: `Ha ocurrido un error: ${error}`
      })
    }
  }

  async updateCart(req, res) {
    const cid = (req.params.cid)
    const {quantity,pid} = req.body;
    const product = {product: pid, quantity: quantity}

    try {
      const user = req.user
      await cartValidator.updateCart(cid, product, user)
      req.logger.info("El producto ha sido actualizado")
      const updatedCart = await cartValidator.getCartById(cid)
      res.send({
        status: 200,
        payload: updatedCart,
      })
    } catch (error) {
      res.status(400).json({
        error: error.message
      })
    }
  }

  async updateQuantityFromCart(req, res) {
    const {cid, pid} = req.params
    const {quantity} = req.body

    try {
      await cartValidator.updateQuantityFromCart(cid, pid, quantity)
      req.logger.info("La cantidad del producto fue actualizada")
      const updatedCart = await cartValidator.getCartById(cid);
      res.json({
        message: "Cantidad Actualizada",
        payload: updatedCart,
      })
    } catch (error) {
      console.log(error)
      req.logger.error("No se ha actualizado el producto en el carrito")
      res.json({ error: error })
    }
  }

  async deleteProductFromCart(req, res) {
    const {cid,pid} = req.params;
    try {
      await cartValidator.deleteProductFromCart(cid, pid)
      req.logger.info("Producto eliminado del carrito")
      const updatedCart = await cartValidator.getCartById(cid)
      res.json({
        message: `El producto: ${pid} fue eliminado del carrito ${cid}`,
        payload:  updatedCart,
      })
    } catch (error) {
      res.json({
        error: error.message
      })
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
      res.json({
        message: "Se ha generado el ticket Nº:",
        result,
      })
    } catch (error) {
      res.json({
        error: error.message
      })
    }
  }
  
  async sendCartCreationEmail(user) {
    await transport.sendMail({
      from: 'Melisa <nicecup.ventas@gmail.com>',
      to: user,
      subject: 'Nuevo carrito creado',
      html: `
        <div>
          <h1> Has creado un carrito </h1>
        </div> `,
      attachments: []
    });
  }
}

export default new CartController()