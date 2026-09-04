import express from 'express';
import {
  createCompany,
  getMyCompanies,
  updateCompany,
  deleteCompany,
} from '../controllers/company.controller.js';
import { protect, authorize } from '../middleware/auth.middleware.js';

const router = express.Router();

router.use(protect, authorize('recruiter'));
router.get('/mine', getMyCompanies);
router.post('/', createCompany);
router.put('/:id', updateCompany);
router.delete('/:id', deleteCompany);

export default router;
