import express from 'express';
import { getMySubscription, checkoutMock, getInvoices } from '../controllers/subscriptionController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(protect);

router.get('/me', getMySubscription);
router.post('/checkout', checkoutMock);
router.get('/invoices', getInvoices);

export default router;
