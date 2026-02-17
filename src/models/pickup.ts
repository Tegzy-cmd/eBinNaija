import mongoose, { Schema, Document } from 'mongoose';

export interface IPickup extends Document {
  userId: string;
  recyclerId?: string;
  companyID?: string;
  wasteImageUrl: string;
  wasteType: string;
  status: 'requested' | 'accepted' | 'enroute' | 'delivered' | 'processed';
  scheduledAt: Date;
}
const pickupSchema = new Schema<IPickup>({
  userId: { type: String, required: true },
  recyclerId: { type: String, required: true },
  companyID: { type: String, required: true },
  wasteImageUrl: { type: String, required: true },
  wasteType: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['requested', 'accepted', 'enroute', 'delivered', 'processed'],
    default: 'requested'
  },
  scheduledAt: { type: Date, default: Date.now }
});
export default mongoose.model<IPickup>('Pickup', pickupSchema);