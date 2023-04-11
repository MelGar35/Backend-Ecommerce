import {Schema, model} from "mongoose"
import mongoosePaginate from "mongoose-paginate-v2"

const productCollection = "products"

const productSchema = new Schema({
  title: String,
  description: String,
  category: String,
  price: String,
  thumbnailPath: String,
  code: {
    type: String,
    unique: true
  },
  status: {
    type: Boolean,
    default: true
  },
  stock: Number
})

productSchema.plugin(mongoosePaginate)

export const productModel = model(productCollection, productSchema)
