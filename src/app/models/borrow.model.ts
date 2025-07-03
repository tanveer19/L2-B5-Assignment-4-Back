import { Schema, model, Document, Types } from "mongoose";

export interface IBorrow extends Document {
  book: Types.ObjectId | string;
  quantity: number;
  dueDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

const borrowSchema = new Schema<IBorrow>(
  {
    book: { type: Schema.Types.ObjectId, ref: "Book", required: true },
    quantity: { type: Number, required: true, min: 1 },
    dueDate: { type: Date, required: true },
  },
  { timestamps: true }
);

const Borrow = model<IBorrow>("Borrow", borrowSchema);
export default Borrow;
