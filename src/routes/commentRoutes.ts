import { Router } from 'express';
import * as commentController from '../controllers/commentController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router({ mergeParams: true });

router.get('/', commentController.getComments);
router.post('/', authMiddleware, commentController.createComment);
router.post('/:id/like', commentController.likeComment);

export default router;