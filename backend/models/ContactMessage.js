import mongoose from 'mongoose';

const contactMessageSchema = mongoose.Schema(
  {
    portfolio: { type: mongoose.Schema.Types.ObjectId, ref: 'Portfolio', required: true },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    senderName: { type: String, required: true },
    senderEmail: { type: String, required: true },
    company: { type: String },
    message: { type: String, required: true },
    read: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const ContactMessage = mongoose.model('ContactMessage', contactMessageSchema);
export default ContactMessage;
