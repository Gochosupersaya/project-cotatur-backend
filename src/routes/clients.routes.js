import { Router } from 'express';
import {
  getClients,
  getClient,
  createClient,
  deleteClient,
  updateClient,
} from '../controllers/clients.controllers.js';
import { authRequired } from '../middlewares/validateToken.js';

const router = Router();

router.get('/clients', authRequired, getClients);
router.get('/clients/:id', authRequired, getClient);
router.post('/clients', authRequired, createClient);
router.delete('/clients/:id', authRequired, deleteClient);
router.put('/clients/:id', authRequired, updateClient);

export default router;
