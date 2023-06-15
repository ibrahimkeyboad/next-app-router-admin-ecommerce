import React from 'react';
import OrderContainer from './OrderContainer';
import { OrderType } from '../../../types';

async function getOrders(): Promise<OrderType[]> {
  const res = await fetch('http://localhost:3000/api/orders');

  return res.json();
}

async function Page() {
  const orders = await getOrders();
  return (
    <>
      <OrderContainer orders={orders} />
    </>
  );
}

export default Page;
