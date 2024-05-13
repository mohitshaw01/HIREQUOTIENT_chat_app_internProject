import expresss from 'express';
import { getUsersForSidebar , getStatus,updateStatus} from '../controllers/user.controller.js';
import  protectRoute  from '../middlewares/protectRoute.js';

const router = expresss.Router();

router.get("/", protectRoute, getUsersForSidebar);
//
router.get("/get/status/:id", protectRoute, getStatus);
router.put("/update/status", protectRoute, updateStatus);

export default router;