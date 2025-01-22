import { Router } from 'express';
import {
  getMedicalHistories,
  getMedicalHistory,
  createMedicalHistory,
  deleteMedicalHistory,
  updateMedicalHistory,
} from '../controllers/medicalHistory.controllers.js';

const router = Router();

router.get('/medical-histories', getMedicalHistories);
router.get('/medical-histories/:id', getMedicalHistory);
router.post('/medical-histories', createMedicalHistory);
router.delete('/medical-histories/:id', deleteMedicalHistory);
router.put('/medical-histories/:id', updateMedicalHistory);

export default router;
