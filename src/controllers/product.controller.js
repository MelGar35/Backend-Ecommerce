import productValidator from "../validators/product.validator.js"

class productController {

  async getProducts(req, res) {

    let limit = parseInt(req.query.limit)
    let query = req.query.query || null
    let sort = parseInt(req.query.sort)
    let page = parseInt(req.query.page)

    console.log(req.user)
    
    try {
      const products = await productValidator.getProducts(limit, JSON.parse(query), sort, page)
      req.logger.debug(products.docs)
      res.render("products", {products})
    } catch (error) {
      req.logger.error(`Ha ocurrido un error ${error.message}`)
      res.json(error)
    }
  }

  async getMockingProducts(req, res) {
    const products = await productValidator.getMockingProducts()
    try {
      res.render('mockingProducts', { products })
    } catch (error) {
      req.logger.error("Could not get mocked products")
      res.json(error)
    }
  }
  
  async getProductById(req, res) {
    console.log(req.params.pid)
    const products = await productValidator.getProductById(req.params.pid)
    try {
      res.status(200).json({ products })
    } catch (error) {
      res.json(error)
    }
  }

  async createProduct(req, res) {
    const { title, description, category, price, thumbnail, code, stock } = req.body;
    try {
      const addedProduct = await productValidator.createProduct(title, description, category, price, thumbnail, code, stock)
      res.status(201).json({ info: 'Producto Agregado', addedProduct })
    } catch (error) {
      req.logger.error(error)
      res.status(400).json({ info: `Ha ocurrido un error: ${error}` })
    }
  
  const owner = req.user.user
    req.logger.debug(`el usuario es ${owner}`)
    try {
      const addedProduct = await productValidator.createProduct(title, description, category, price, thumbnail, code, stock, owner )
      res.status(201).json({ info: "Producto Agregado", addedProduct })
    } catch (error) {
      res.status(400).json({ message: "Ha ocurrido un erorr", error: error.message })

    }
  }

  
  async editProduct(req, res) {
    const pid = (req.params.pid)
    let updatedProduct = req.body
    try {
      await productValidator.editProduct(pid, updatedProduct)
      res.send({ status: 200, payload: updatedProduct })
    } catch (error) {
      req.logger.error("Error editando producto: ", error.message)
      res.json({ error: error.message})
    } 
  }

  async deleteProduct(req, res) {
    let pid = (req.params.pid)
    const role = req.user.role
    const products = await productValidator.getProducts()
    try {
      await productValidator.deleteProduct(pid, role)

      res.render('products', { products })
    } catch (error) {
      console.log(error.message)
      req.logger.error("Error eliminando producto: ", error.message)
      res.json({ error: error.message })
    }

}

}

export default new productController()