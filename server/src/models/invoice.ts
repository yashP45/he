import mongoose, { Document, Schema } from 'mongoose';

export interface IInvoice extends Document {
  userId: string;
  products: string[];
  date: Date;
}

const invoiceSchema: Schema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  products: [{ type: Schema.Types.ObjectId, ref: 'Product', required: true }],
  date: { type: Date, default: Date.now }
});

export default mongoose.model<IInvoice>('Invoice', invoiceSchema);
