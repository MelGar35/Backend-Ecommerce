import productValidator from "../validators/product.validator.js"

class productController {

  async getProducts(req, res) {

    let limit = parseInt(req.query.limit)
    let query = req.query.query || null
    let sort = parseInt(req.query.sort)
    let page = parseInt(req.query.page)
    let json = (req.query.json)
    req.logger.debug(`Modo JSON : ${json}`)
    
    
    try {
      const products = await productValidator.getProducts(limit, JSON.parse(query), sort, page)
      req.logger.debug(products.docs)
      if (json) res.status(200).json(products)
      else res.render('products')
    } catch (error) {
      req.logger.error(`Funcion getProducts en controlador: Ha ocurrido un error ${error.message}`)
      res.json(error)
    }
  }

  async getMockingProducts(req, res) {
    const products = await productValidator.getMockingProducts()
    try {
      res.render('mockingProducts', { products, title: "Productos" })
    } catch (error) {
      req.logger.error("Funcion getMockingProducts en controlador: ${error.message}")
      res.json(error)
    }
  }
  
  async getProductById(req, res) {
    const pid = req.params.pid
    const json = req.query.json

    try {
      let products = { docs: [] }
      // products.docs = await productValidator.getProductById(pid)
      let product = await productValidator.getProductById(pid)
      products.docs.push(product)
      req.logger.debug(`Producto encontrado ${products}`)
      if (json) res.status(200).json(products)
      else res.render('products', { products, title: "Search"})
    }
    catch (error) {
      req.logger.error(`Funcion getProductById en controlador: ${Error.message}`)
      res.status(404).json(error.message)
    }
  }

  async createProduct(req, res) {
    const { title, description, category, price, thumbnail, code, stock } = req.body;
    !req.file && console.log("No se ha guardado la imagen")
    req.logger.debug("Creando producto")


    let thumbnailName


    if (!req.file) {
      thumbnailName = "Sin imagen"
    } else {

      thumbnailName = req.file.filename
    }


    const owner = req.user.user
    req.logger.debug(`el usuario es ${owner}`)
    try {
      const addedProduct = await productValidator.createProduct(title, description, category, price, thumbnailName, code, stock, owner)
      res.status(201).json({ info: 'Producto Agregado', addedProduct })
    } catch (error) {
      req.logger.error(`Funcion createProduct en controlador: ${error.message}`)
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
    const user = req.user.user
    const products = await productValidator.getProducts()
    try {
      await productValidator.deleteProduct(pid, user, role)
      res.status(200).json({ message: "Product Eliminated", payload: products })
    } catch (error) {
      console.log(error.message)
      req.logger.error(`Funcion deleteProduct en controlador: ${error.message}`)
      res.status(400).json({ error: error.message })
    }
  }
}

export default new productController()