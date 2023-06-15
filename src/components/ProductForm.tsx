'use client';

import { ChangeEvent, FormEvent, useCallback, useState } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Spinner from '@/components/Spinner';
import { CategoryType, ProductType, PropertyType } from '../../types';
import Image from 'next/image';

interface ProductProps {
  product: ProductType;
  categories: CategoryType[];
}

export default function ProductForm({ product, categories }: ProductProps) {
  const [title, setTitle] = useState(product.title || '');
  const [description, setDescription] = useState(product.description || '');
  const [category, setCategory] = useState<string>(product.category.name || '');
  const [productProperties, setProductProperties] = useState(
    product.properties || {}
  );
  const [price, setPrice] = useState(product.price || '');
  const [images, setImages] = useState<string[]>(product.images || []);
  const [goToProducts, setGoToProducts] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const id = product._id;
  console.log(product.images);
  const router = useRouter();

  async function saveProduct(ev: FormEvent<HTMLFormElement>) {
    ev.preventDefault();
    const data = {
      title,
      description,
      price,
      images,
      category,
      properties: productProperties,
    };
    if (id) {
      //update
      await axios.put('/api/products', { ...data, id });
    } else {
      //create
      await axios.post('/api/products', data);
    }
    setGoToProducts(true);
  }
  if (goToProducts) {
    router.push('/products');
  }
  async function uploadImages(ev: ChangeEvent<HTMLInputElement>) {
    const files = ev.target?.files;

    if (!files) {
      return;
    }

    if (files.length > 0) {
      setIsUploading(true);
      const data = new FormData();
      for (const file of files) {
        data.append('file', file);
      }
      const res = await axios.post('/api/upload', data);
      setImages((oldImages) => {
        return [...oldImages, ...res.data.links];
      });
      setIsUploading(false);
    }
  }
  function updateImagesOrder(images: string[]) {
    setImages(images);
  }
  function setProductProp(propName: string, value: string) {
    setProductProperties((prev: any) => {
      const newProductProps = { ...prev };
      newProductProps[propName] = value;
      return newProductProps;
    });
  }

  const propertiesToFill: PropertyType[] = [];
  if (categories.length > 0 && category) {
    let catInfo = categories.find(({ _id }) => _id === category._id);
    if (catInfo) {
      propertiesToFill.push(...(catInfo.properties as PropertyType[]));

      while (catInfo?.parent?._id) {
        const parentCat = categories.find(
          ({ _id }) => _id === catInfo?.parent?._id
        );
        if (parentCat) {
          propertiesToFill.push(...(parentCat.properties as PropertyType[]));
        }
        catInfo = parentCat;
      }
    }
  }

  const setCategoryHandler = useCallback(
    (ev: ChangeEvent<HTMLSelectElement>) => {
      const name = ev.target.value;
      setCategory(name);
    },
    []
  );

  return (
    <form className='flex flex-col gap-2' onSubmit={saveProduct}>
      <label>Product name</label>
      <input
        type='text'
        placeholder='product name'
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />
      <label>Category</label>
      <select value={category} onChange={setCategoryHandler}>
        <option value=''>Uncategorized</option>
        {categories.length > 0 &&
          categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
      </select>
      {propertiesToFill.length > 0 &&
        propertiesToFill.map((p: PropertyType) => (
          <div key={p.name} className=''>
            <label>{p.name[0].toUpperCase() + p.name.substring(1)}</label>
            <div>
              <select
                value={productProperties[p.name]}
                onChange={(ev) => setProductProp(p.name, ev.target.value)}>
                {p.values.map((v) => (
                  <option key={v} value={v}>
                    {v}
                  </option>
                ))}
              </select>
            </div>
          </div>
        ))}
      <label>Photos</label>
      <div className='mb-2 flex flex-wrap gap-1'>
        {!!images?.length &&
          images.map((link) => (
            <div
              key={link}
              className='h-24 relative bg-white p-4 shadow-sm rounded-sm border border-gray-200'>
              <Image fill src={link} alt='' className='rounded-lg' />
            </div>
          ))}
        {isUploading && (
          <div className='h-24 flex items-center'>
            <Spinner />
          </div>
        )}
        <label className='w-24 h-24 cursor-pointer text-center flex flex-col items-center justify-center text-sm gap-1 text-primary rounded-sm bg-white shadow-sm border border-primary'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='w-6 h-6'>
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5'
            />
          </svg>
          <div>Add image</div>
          <input type='file' onChange={uploadImages} className='hidden' />
        </label>
      </div>
      <label>Description</label>
      <textarea
        placeholder='description'
        value={description}
        onChange={(ev) => setDescription(ev.target.value)}
      />
      <label>Price (in USD)</label>
      <input
        type='number'
        placeholder='price'
        value={price}
        onChange={(ev) => setPrice(ev.target.value)}
      />
      <button type='submit' className='btn-primary self-start'>
        Save
      </button>
    </form>
  );
}
