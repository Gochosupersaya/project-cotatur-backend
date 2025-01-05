import { Router } from 'express';
import { getClients, getClient, createClient, deleteClient, updateClient } from '../controllers/clients.controllers.js';

const router = Router();

router.get('/clients', getClients);
router.get('/clients/:id', getClient);
router.post('/clients', createClient);
router.delete('/clients/:id', deleteClient);
router.put('/clients/:id', updateClient);

export default router;
