import { Router } from 'express';
import {
  getMedicalHistories,
  getMedicalHistory,
  createMedicalHistory,
  deleteMedicalHistory,
  updateMedicalHistory,
} from '../controllers/medicalHistory.controllers.js';
import { authRequired } from '../middlewares/validateToken.js';

const router = Router();

router.get('/medical-histories', authRequired, getMedicalHistories);
router.get('/medical-histories/:id', authRequired, getMedicalHistory);
router.post('/medical-histories', authRequired, createMedicalHistory);
router.delete('/medical-histories/:id', authRequired, deleteMedicalHistory);
router.put('/medical-histories/:id', authRequired, updateMedicalHistory);

export default router;
