import { Router } from "express"
import passport from "passport"
import passportCall from "../utils/passportCall.js"
import sessionsController from "../controllers/session.controller.js"

const router = Router()

router.get("/login", sessionsController.getLoginPage) 
router.get('/current', passportCall('jwt'), passport.authenticate('jwt', { session: false }), sessionsController.getCurrentProfile)
router.get("/register", sessionsController.getRegisterPage) 
router.get("/failedregister", sessionsController.getFailedRegisterPage)
router.post("/login", sessionsController.postToLogin) 
router.post("/register", passport.authenticate("register", { failureRedirect: 'api/session/failedregister', session:false }),sessionsController.postToRegister) 

export default router

