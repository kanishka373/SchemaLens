import express from 'express';
import { connectDB, getTables, getRelationships, getStats} from '../controllers/schemaController.js';

const router = express.Router();
router.post('/connect', connectDB);
router.get('/tables', getTables);
router.get('/relationships', getRelationships);
router.get('/stats', getStats);

export default router;