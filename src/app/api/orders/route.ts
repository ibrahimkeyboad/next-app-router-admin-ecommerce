import connectDB from '@/db';
import { Order } from '@/models/Order';
import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    await connectDB();
    const orders = await Order.find().sort({ createdAt: -1 });
    return NextResponse.json(orders);
  } catch (err) {
    return new NextResponse(`${err}`, { status: 500 });
  }
}
