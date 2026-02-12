import mongoose, { Schema, Document } from 'mongoose';

export interface IPickup extends Document {
  userId: string;
  collectorId?: string;
  wasteImage: string;
  wasteType: string;
  status: 'requested' | 'accepted' | 'enroute' | 'delivered' | 'processed';
}
const pickupSchema = new Schema<IPickup>({
  userId: { type: String, required: true },
  collectorId: { type: String, required: false },
  wasteImage: { type: String, required: true },
  wasteType: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['requested', 'accepted', 'enroute', 'delivered', 'processed'],
    default: 'requested'
  }
});
export default mongoose.model<IPickup>('Pickup', pickupSchema);