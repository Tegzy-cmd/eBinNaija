import mongoose, { Schema, Document } from 'mongoose';

export interface IWallet extends Document {

  walletId: string;
  userId: string;
  companyId?: string;
  balance: number;
  type: 'user' | 'recycler';
}

const walletSchema = new Schema<IWallet>({
  walletId: { type: String, required: true },
  userId: { type: String, required: true },
  companyId: { type: String, required: false },
  balance: { type: Number, default: 0 },
  type: { type: String, enum: ['user', 'recycler'], required: true }
});

export default mongoose.model<IWallet>('Wallet', walletSchema);