import { Router } from "express"
import passport from "passport"
import passportCall from "../utils/passportCall.js"
import sessionsController from "../controllers/session.controller.js"
import authorization from "../utils/autorization.js"

const router = Router()

router.get('/failedregister', sessionsController.getFailedRegisterPage)
router.get('/login', sessionsController.getLoginPage) 
router.get('/current', passportCall('jwt'), passport.authenticate('jwt', { session: false }), sessionsController.getCurrentProfile)
router.get('/register', sessionsController.getRegisterPage) 
router.get('/restore', sessionsController.getRestorePage) 
router.get('/updateUser/:token', sessionsController.getUpdateUserPage) 
router.put('/updateUser/:token', sessionsController.updateUser) 
router.post('/login', sessionsController.postToLogin)  
router.post('/register', passport.authenticate('register', { session: false }), sessionsController.postToRegister) 
router.post('/restore', sessionsController.restore) 
router.get('/changeToPremium', passportCall('jwt'), authorization(['admin']), passport.authenticate('jwt', { session: false }), sessionsController.changeRolePage) 
router.put('/changeToPremium/:uid', passportCall('jwt'), authorization(['admin']), passport.authenticate('jwt', { session: false }), sessionsController.changeRole) 


export default router

