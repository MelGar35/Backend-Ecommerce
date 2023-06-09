import { Router } from "express"
import passport from "passport"
import passportCall from "../utils/passportCall.js"
import sessionsController from "../controllers/session.controller.js"

const router = Router()

router.get('/login', sessionsController.getLoginPage) 
router.get('/current', passportCall('jwt'), passport.authenticate('jwt', { session: false }), sessionsController.getCurrentProfile)
router.get('/register', sessionsController.getRegisterPage)
router.get('/restore', sessionsController.getRestorePage) 
router.get('/logout', sessionsController.logout) 
router.get('/updateUser/:token', sessionsController.getUpdateUserPage) 
router.put('/updateUser/:token', sessionsController.updateUser) 
router.post('/login', sessionsController.postToLogin) 
router.post('/register', passport.authenticate('register', { session: false }), sessionsController.postToRegister) 
router.post('/restore', sessionsController.restore) 

export default router

