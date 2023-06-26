const authorization = (role) => {
    return async (req, res, next) => {
      req.logger.debug(`El rol del usuario es: ${req.user.role}`)
      if(!req.user) {
        return res.status(401).json({ message: "No estas logueado" })
      }
  
      let permiso = false
      role.forEach(rol => {
        if(req.user.role === rol) {
          permiso = true
        }
      })
  
  
     if(permiso === false) {
      req.logger.warning("No has iniciado sesion")
      return res.status(403).json({ message: `No tienes permisos para realizar esta tarea, debes tener el rol de: ${role}`})
      }
    
      next()
 }
}
  
export default authorization
  