'use client';

import { useEffect, useState, ChangeEvent, FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import Spinner from '@/components/Spinner';
import Image from 'next/image';

interface Property {
  name: string;
  values: string[];
}

interface Category {
  _id: string;
  name: string;
  properties: Property[];
  parent?: {
    _id: string;
  };
}

interface ProductFormProps {
  _id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  properties: Record<string, string>;
}

export default function ProductForm({
  _id,
  title: existingTitle,
  description: existingDescription,
  price: existingPrice,
  images: existingImages,
  category: assignedCategory,
  properties: assignedProperties,
}: ProductFormProps) {
  const [title, setTitle] = useState<string>(existingTitle || '');
  const [description, setDescription] = useState<string>(
    existingDescription || ''
  );
  const [category, setCategory] = useState<string>(assignedCategory || '');
  const [productProperties, setProductProperties] = useState<
    Record<string, string>
  >(assignedProperties || {});
  const [price, setPrice] = useState<number>(existingPrice || 0);
  const [images, setImages] = useState<string[]>(existingImages || []);
  const [goToProducts, setGoToProducts] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const router = useRouter();

  useEffect(() => {
    axios.get('/api/categories').then((result) => {
      setCategories(result.data);
    });
  }, []);

  async function saveProduct(ev: FormEvent) {
    ev.preventDefault();
    const data = {
      title,
      description,
      price,
      images,
      category,
      properties: productProperties,
    };

    if (_id) {
      // update
      await axios.put('/api/products', { ...data, _id });
    } else {
      // create
      await axios.post('/api/products', data);
    }

    setGoToProducts(true);
  }

  useEffect(() => {
    if (goToProducts) {
      router.push('/products');
    }
  }, [goToProducts]);

  async function uploadImages(ev: ChangeEvent<HTMLInputElement>) {
    const files = ev.target?.files;

    if (!files) {
      return;
    }

    if (files?.length > 0) {
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

  function updateImagesOrder(newImages: string[]) {
    setImages(newImages);
  }

  function setProductProp(propName: string, value: string) {
    setProductProperties((prev) => {
      const newProductProps = { ...prev };
      newProductProps[propName] = value;
      return newProductProps;
    });
  }

  const propertiesToFill: Property[] = [];
  if (categories.length > 0 && category) {
    let catInfo = categories.find(({ _id }) => _id === category);

    if (catInfo) {
      propertiesToFill.push(...catInfo.properties);
      while (catInfo?.parent?._id) {
        const parentCat = categories.find(
          ({ _id }) => _id === catInfo?.parent?._id
        );
        propertiesToFill.push(...(parentCat?.properties as Property[]));
        catInfo = parentCat;
      }
    }
  }

  return (
    <form onSubmit={saveProduct}>
      <label>Product name</label>
      <input
        type='text'
        placeholder='product name'
        value={title}
        onChange={(ev) => setTitle(ev.target.value)}
      />
      <label>Category</label>
      <select value={category} onChange={(ev) => setCategory(ev.target.value)}>
        <option value=''>Uncategorized</option>
        {categories.length > 0 &&
          categories.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name}
            </option>
          ))}
      </select>
      {propertiesToFill.length > 0 &&
        propertiesToFill.map((p) => (
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
        onChange={(ev) => setPrice(Number(ev.target.value))}
      />
      <button type='submit' className='btn-primary'>
        Save
      </button>
    </form>
  );
}
