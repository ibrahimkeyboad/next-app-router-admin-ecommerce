import connectDB from '@/db';
import Product from '@/models/Product';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    connectDB();
    const products = await Product.find();
    console.log(products);

    return NextResponse.json(products, { status: 200 });
  } catch (err) {
    console.log('error', err);
  }
}
