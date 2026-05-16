import { Router } from 'express';
import multer from 'multer';
import * as articleController from '../controllers/articleController';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = Router();
const upload = multer({ storage: multer.memoryStorage() });

router.get('/', articleController.getAll);
router.get('/:id', articleController.getById);
router.post('/', authMiddleware, upload.single('banner'), articleController.create);
router.put('/:id', authMiddleware, upload.single('banner'), articleController.update);
router.delete('/:id', authMiddleware, articleController.remove);
router.post('/:id/like', articleController.like);  // ← nova rota de curtida

export default router;