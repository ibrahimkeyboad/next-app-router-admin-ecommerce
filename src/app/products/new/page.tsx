import React from 'react';

function NewProduct() {
  return (
    <section>
      <main className='flex flex-col'>
        <h1>New Product</h1>
        <label>Product name</label>
        <input type='text' placeholder='Product name' />
        <label>Description</label>
        <textarea placeholder='Description'></textarea>
      </main>
    </section>
  );
}

export default NewProduct;
