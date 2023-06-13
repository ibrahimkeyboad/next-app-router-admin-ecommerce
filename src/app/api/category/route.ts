import { Category } from '@/models/Category';
import { NextResponse } from 'next/server';
import { CategoryDataType } from '../../../../types';
import connectDB from '@/db';

export async function GET(req: Request) {
  connectDB();
  try {
    const categories = await Category.find().populate('parent');
    return NextResponse.json(categories);
  } catch (err) {
    return new NextResponse('Something went wrong', { status: 500 });
  }
}

export async function POST(req: Request) {
  connectDB();

  try {
    const body: CategoryDataType = await req.json();
    const { name, properties, parent } = body;

    const categoryDoc = await Category.create({
      name,
      parent: parent || undefined,
      properties,
    });
    return NextResponse.json(categoryDoc);
  } catch (err) {
    return new NextResponse('Something went wrong', { status: 500 });
  }
}

export async function PUT(req: Request) {
  connectDB();

  try {
    const body: CategoryDataType = await req.json();

    const { name, properties, parent, _id } = body;

    const categoryDoc = await Category.updateOne(
      { _id },
      {
        name,
        parent: parent || undefined,
        properties,
      }
    );

    return NextResponse.json(categoryDoc);
  } catch (err) {
    return new NextResponse('Something went wrong', { status: 500 });
  }
}

export async function DELETE(req: Request) {
  connectDB();

  try {
    const { _id } = await req.json();
    await Category.deleteOne({ _id });
    return NextResponse.json('ok');
  } catch (err) {
    return new NextResponse('Something went wrong', { status: 500 });
  }
}
