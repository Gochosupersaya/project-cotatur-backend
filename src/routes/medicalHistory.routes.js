import { Router } from 'express';
import {
    getMedicalHistories,
    getMedicalHistory,
    createMedicalHistory,
    deleteMedicalHistory,
    updateMedicalHistory
} from '../controllers/medicalHistory.controllers.js';

const router = Router();

router.get('/medical-histories', getMedicalHistories); // Obtener todos
router.get('/medical-histories/:id', getMedicalHistory); // Obtener uno por ID
router.post('/medical-histories', createMedicalHistory); // Crear nuevo
router.delete('/medical-histories/:id', deleteMedicalHistory); // Eliminar por ID
router.put('/medical-histories/:id', updateMedicalHistory); // Actualizar por ID

export default router;
