import { model, Schema, models } from 'mongoose';
import { Category } from './Category';

const ProductSchema = new Schema(
  {
    title: { type: String, required: true },
    description: String,
    price: { type: Number, required: true },
    images: [{ type: String }],
    category: { type: Schema.Types.ObjectId, ref: Category },
    properties: {
      name: {
        type: String,
      },
      values: [{ type: String }],
    },
  },
  {
    timestamps: true,
  }
);

const Product = models?.Product || model('Product', ProductSchema);

export default Product;
