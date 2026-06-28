import mongoose from 'mongoose';

const paymentSchema = mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'usd' },
    status: { type: String, enum: ['succeeded', 'pending', 'failed'], default: 'succeeded' },
    paymentMethod: { type: String, default: 'card' },
    stripeInvoiceId: { type: String },
    planTier: { type: String, required: true },
  },
  { timestamps: true }
);

const Payment = mongoose.model('Payment', paymentSchema);
export default Payment;
