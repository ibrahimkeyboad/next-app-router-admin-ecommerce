import ProductForm from '@/components/ProductForm';
import { ProductType } from '../../../../../types';
interface IParams {
  id: string;
}

async function Page({ params }: { params: IParams }) {
  const res = await fetch(`http://localhost:3000/api/products/${params.id}`, {
    next: { revalidate: 10 },
  });

  const data = await res.json();

  return (
    <>
      <h1>Edit product </h1>
      <ProductForm product={data.product} categories={data.categories} />
    </>
  );
}

export default Page;
