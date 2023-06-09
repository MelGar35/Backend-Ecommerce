import { Router } from "express";
import passport from 'passport'
import passportCall from "../utils/passportCall.js";
import usersController from "../controllers/users.controller.js";
import authorization from "../utils/autorization.js";
import { uploader } from "../utils/multer.js";
import roleValidation from "../utils/roleValidation.js";


const router = Router();

router.get('/documents', passportCall('jwt'), authorization(['admin', 'user', 'premium']), passport.authenticate('jwt', { session: false }), usersController.getDocumentsPage) 
router.get('/premium', passportCall('jwt'), authorization(['admin']), passport.authenticate('jwt', { session: false }), usersController.changeRolePage) 
router.put('/premium/:uid', passportCall('jwt'), authorization(['admin']), passport.authenticate('jwt', { session: false }), roleValidation(), usersController.changeRole) 
router.post('/:uid/documents', passportCall('jwt'), authorization(['user']), passport.authenticate('jwt', { session: false }), uploader.fields([{ name: 'profilePic', maxCount: 1 }, { name: 'productImage', maxCount: 5 }, { name: 'identification', maxCount: 1 }, { name: 'location', maxCount: 1 }, { name: 'accountStatus', maxCount: 1 }]), usersController.uploadDocs) 
router.delete('/', passportCall('jwt'), authorization(['admin']), passport.authenticate('jwt', { session: false }), usersController.deleteInactiveUsers) 
router.delete('/:uid', passportCall('jwt'), authorization(['admin']), passport.authenticate('jwt', { session: false }), usersController.deleteUser) 



export default router;




