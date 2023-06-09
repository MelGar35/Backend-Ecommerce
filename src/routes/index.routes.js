import {Router} from "express"
import productRoutes from "./products.routes.js"
import cartRoutes from "./carts.routes.js"
import sessionRoutes from "./session.routes.js"
import userRoutes from './user.routes.js'
import viewsRoutes from "./views.routes.js"

const router = Router()

router.use("/products", productRoutes)

router.use("/carts", cartRoutes)

router.use("/", viewsRoutes)

router.use("/session", sessionRoutes)

router.use('/users', userRoutes)

export default router