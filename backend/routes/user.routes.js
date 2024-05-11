import expresss from 'express';
import { getUsersForSidebar} from '../controllers/user.controller.js';
import  protectRoute  from '../middlewares/protectRoute.js';

const router = expresss.Router();

router.get("/", protectRoute, getUsersForSidebar);

export default router;