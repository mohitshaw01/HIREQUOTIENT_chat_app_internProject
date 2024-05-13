import express from 'express';
import {sendMessage,getMessages,botMessage} from '../controllers/message.controller.js';
import protectRoute from '../middlewares/protectRoute.js';
const router = express.Router();


router.post('/send/:id',protectRoute, sendMessage); // here id is the participant id not the user id;
router.get('/:id',protectRoute, getMessages);

router.post('/aiMessage',protectRoute,botMessage);
export default router;