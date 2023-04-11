import { Router } from "express";
import CustomError from "../utils/CustomError.js";
import ErrorList from "../utils/ErrorList.js";

const router = Router()

router.get('/', (req,res) => {
  res.send("Arquitectura en Capas")
})

router.get('*', (req, res) => {
  CustomError.createError({
    name: 'Error al cargar la pagina',
    cause: "El endpoint no funciona",
    message: "No se puede encontrar la pagina que buscas!",
    code: ErrorList.ROUTING_ERROR
  })
})

export default router

