import connectDB from '@/db';
import Product from '@/models/Product';

async function getProducts() {
  connectDB();
  try {
    const products = await Product.find();

    if (!products) {
      return [];
    }

    return products;
  } catch (err) {
    return [];
  }
}

export default getProducts;
