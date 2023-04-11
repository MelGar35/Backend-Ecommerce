const authorization = (role) => {
    return async (req, res, next) => {
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
        return res.status(401).json({ message: "Not an Admin, dont have permission" })
      }
    
      next()
    }
  }
  
    export default authorization
  