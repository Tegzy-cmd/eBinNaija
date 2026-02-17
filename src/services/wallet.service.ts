import Wallet from '../models/wallet';
import Transaction from '../models/transaction';
import { Types } from 'mongoose';

// **Credit Wallet Logic**
export const creditWallet = async (userId: string, amount: number, reference: string) => {
  // Find the user's wallet
  const wallet = await Wallet.findOne({ userId });
  if (!wallet) {
    throw new Error('Wallet not found');
  }

  // Credit the user's wallet with the amount
  wallet.balance += amount;
  await wallet.save();

  // Log the transaction (credit)
const transaction = new Transaction({
    walletId: wallet.walletId,
    amount,
    type: 'credit',
    reference,
    status: 'completed',
    createdAt: new Date(),
  });
  await transaction.save();
};
