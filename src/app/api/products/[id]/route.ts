import { NextResponse } from 'next/server';
import connectDB from '@/db';
import { Category } from '@/models/Category';
import Product from '@/models/Product';

export async function GET(request: Request) {
  connectDB();
  try {
    const { searchParams } = new URL(request.url);
    console.log(searchParams);
    const id = searchParams.get('id');
    console.log(id);
    const product = await Product.findOne({ id });
    const categories = await Category.find();

    return NextResponse.json({ product, categories });
  } catch (err) {}
}
export async function PUT() {}
export async function DELETE() {}
