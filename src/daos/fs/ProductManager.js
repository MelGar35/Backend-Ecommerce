import fs from "fs"

class ProductManager {
  constructor(path){
    this.path = path
    try{
      this.products = fs.readFileSync(this.path, "utf-8")
      this.products = JSON.parse(this.products)
    }catch(error){
      this.products=[]
    }
  }

  async addProduct(title, description, category, price, thumbnail, code,status,stock){
    let product = {
      title,
      description,
      category,
      price,
      thumbnail,
      code,
      status,
      stock,
    }

  if (this.products.length === 0) {
    product["id"] = 1;
  } else {
    product["id"] = this.products[this.products.length - 1]["id"] + 1;
    }

  let codeCopy = this.products.some(copy => copy.code === code) 
    if(codeCopy){
      console.log("El codigo ya existe, vuelva a intentarlo")
    }else{
      this.products.push(product);
    await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, '\t'))
    }
  }

  getProducts(){
    return this.products
  }

getProductById(id){
    try{
      return this.products.find((product)=> product.id === id)
    } catch(error){
      return "Error, id not found"
    }
  }

  async updateProduct(id, product){
    try {
      const oldProduct = this.products.find((product) => product.id === id)
      const index = this.products.findIndex((prod) => prod.id === id)

      if(index !== -1) {
        const newProduct = {...oldProduct, ...product }
        this.products[index] = newProduct
        await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, '\t'))
        console.log('Product updated')
      }
    } catch(error) {
      console.log('Error update:', error)
    }
  }

  delete() {
    fs.unlinkSync(this.path)
  }

  async deleteProduct(id) {
    try {
      const product = this.products.findIndex((product) => product.id === id)

      if(product !== -1) {
        this.products.splice(product, 1)
        await fs.promises.writeFile(this.path, JSON.stringify(this.products, null, '\t'))
      }
      else {
        console.log('Product not found')
      }
    } catch (error) {
      console.log('Error delete Product:', error)
    }
  }

  }

 
export default new ProductManager("./productos.json")


