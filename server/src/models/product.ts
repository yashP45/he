import mongoose, { Document, Schema } from 'mongoose';

export interface IProduct extends Document {
  userId: string;
  name: string;
  quantity: number;
  rate: number;
}

const productSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  quantity: { type: Number, required: true },
  rate: { type: Number, required: true }
});

export default mongoose.model<IProduct>('Product', productSchema);
