import mongoose, { Schema, Document } from 'mongoose';
export interface ITransaction extends Document {
  transactionId: string;
  walletId: string;
  amount: number;
  type: 'credit' | 'debit';
  reference: string;
  status: 'pending' | 'completed' | 'failed';
  createdAt: Date;
}

const transactionSchema = new Schema<ITransaction>({
  transactionId: { type: String, required: true },
  walletId: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: ['credit', 'debit'], required: true },
  reference: { type: String, required: true },
  status: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model<ITransaction>('Transaction', transactionSchema);