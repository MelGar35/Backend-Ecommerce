import { Router } from "express";
//import CustomError from "../utils/CustomError.js";
//import ErrorList from "../utils/ErrorList.js"

const router = Router()

router.get('/', (req,res) => {
  res.send("Arquitectura en Capas")
})

//router.get('*', (req, res) => {
//  CustomError.createError({
//       name: 'Error al cargar la pagina',
//    cause: "El endpoint no funciona",
//    message: "No se puede encontrar la pagina que buscas!",
//   code: ErrorList.ROUTING_ERROR  }) })

router.get('/loggerTest', (req, res) => {
  req.logger.fatal("Este es un log a nivel fatal")
  req.logger.error("Este es un log a nivel error")
  req.logger.warning("Este es un log a nivel warning")
  req.logger.info("Este es un log a nivel info")
  req.logger.http("Este es un log a nivel http")
  req.logger.debug("Este es un log a nivel debug")
  res.send("Comprobar en consola los logs ")
})


export default router

