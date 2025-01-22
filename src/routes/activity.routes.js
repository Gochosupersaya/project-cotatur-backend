import { Router } from 'express';
import {
  getActivities,
  getActivity,
  createActivity,
  deleteActivity,
  updateActivity,
} from '../controllers/activity.controllers.js';
import { authRequired } from '../middlewares/validateToken.js';

const router = Router();

router.get('/activities', authRequired, getActivities); // Obtener todas las actividades
router.get('/activities/:id', authRequired, getActivity); // Obtener una actividad específica por ID
router.post('/activities', authRequired, createActivity); // Crear una nueva actividad
router.delete('/activities/:id', authRequired, deleteActivity); // Eliminar una actividad por ID
router.put('/activities/:id', authRequired, updateActivity); // Actualizar una actividad por ID

export default router;
