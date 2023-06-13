import React from 'react';
import CategoryForm from './CategoryForm';

async function CategoryPage() {
  const res = await fetch('http://localhost:3000/api/category', {
    next: { revalidate: 10 },
  });
  const categories = await res.json();
  console.log(categories);
  return <CategoryForm categories={categories} />;
}

export default CategoryPage;


