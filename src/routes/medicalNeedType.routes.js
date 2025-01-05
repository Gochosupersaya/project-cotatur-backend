import { Router } from 'express';
import {
    getMedicalNeedTypes,
    getMedicalNeedType,
    createMedicalNeedType,
    deleteMedicalNeedType,
    updateMedicalNeedType
} from '../controllers/medicalNeedType.controllers.js';

const router = Router();

router.get('/medical-need-types', getMedicalNeedTypes); 
router.get('/medical-need-types/:id', getMedicalNeedType); 
router.post('/medical-need-types', createMedicalNeedType);
router.delete('/medical-need-types/:id', deleteMedicalNeedType); 
router.put('/medical-need-types/:id', updateMedicalNeedType); 

export default router;
