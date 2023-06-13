'use client';
import { ChangeEvent, FormEvent, useCallback, useState } from 'react';
import axios from 'axios';
import { CategoryDataType, CategoryType, PropertyType } from '../../../types';

function CategoryForm({ categories = [] }: { categories: CategoryType[] }) {
  const [editedCategory, setEditedCategory] = useState<CategoryType | null>(
    null
  );
  const [name, setName] = useState('');
  const [parentCategory, setParentCategory] = useState<string | undefined>();
  const [properties, setProperties] = useState<PropertyType[]>([]);

  const saveCategory = useCallback(async (ev: FormEvent<HTMLFormElement>) => {
    ev.preventDefault();
    const data: CategoryDataType = {
      name,
      parent: parentCategory,
      properties: properties.map((p) => ({
        name: p.name,
        values: p.values.split(','),
      })),
    };
    if (editedCategory) {
      data._id = editedCategory._id;
      await axios.put('/api/category', data);
      setEditedCategory(null);
    } else {
      console.log(data);
      await axios.post('/api/category', data);
    }
    setName('');
    setParentCategory('');
    setProperties([]);
  }, []);

  const editCategory = useCallback((category: CategoryType) => {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category.parent?._id);

    if (category.properties) {
      setProperties(
        category.properties.map(({ name, values }) => ({
          name,
          values: values.join(','),
        }))
      );
    }
  }, []);
  function deleteCategory(category: CategoryType) {
    // swal
    //   .fire({
    //     title: 'Are you sure?',
    //     text: `Do you want to delete ${category.name}?`,
    //     showCancelButton: true,
    //     cancelButtonText: 'Cancel',
    //     confirmButtonText: 'Yes, Delete!',
    //     confirmButtonColor: '#d55',
    //     reverseButtons: true,
    //   })
    //   .then(async (result: any) => {
    //     if (result.isConfirmed) {
    //       const { _id } = category;
    //       await axios.delete('/api/categories?_id=' + _id);
    //     }
    //   });
  }
  const addProperty = useCallback(() => {
    setProperties([...properties, { name: '', values: [''] }]);
  }, [properties]);

  const handlePropertyNameChange = useCallback(
    (index: number, event: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      const updatedProperties = [...properties];
      updatedProperties[index] = { ...updatedProperties[index], [name]: value };
      setProperties(updatedProperties);
    },
    [properties]
  );

  const handlePropertyValuesChange = useCallback(
    (index: number, event: ChangeEvent<HTMLInputElement>) => {
      const { value } = event.target;
      const updatedProperties = [...properties];
      updatedProperties[index].values[valueIndex] = value;
      setProperties(updatedProperties);
    },
    [properties]
  );

  const removeProperty = useCallback((indexToRemove: number) => {
    setProperties((prev) => {
      return [...prev].filter((p, pIndex) => {
        return pIndex !== indexToRemove;
      });
    });
  }, []);

  return (
    <>
      <h1>Categories</h1>
      <label>
        {editedCategory
          ? `Edit category ${editedCategory.name}`
          : 'Create new category'}
      </label>
      <form onSubmit={saveCategory}>
        <div className='flex gap-1'>
          <input
            type='text'
            placeholder={'Category name'}
            onChange={(ev) => setName(ev.target.value)}
            value={name}
          />
          <select
            onChange={(ev) => setParentCategory(ev.target.value)}
            value={parentCategory}>
            <option value=''>No parent category</option>
            {categories.length > 0 &&
              categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
          </select>
        </div>
        <div className='mb-2'>
          <label className='block'>Properties</label>
          <button
            onClick={addProperty}
            type='button'
            className='btn-default text-sm mb-2'>
            Add new property
          </button>
          {properties.length > 0 &&
            properties.map((property, index) => (
              <div key={property.name} className='flex gap-1 mb-2'>
                <input
                  type='text'
                  value={property.name}
                  className='mb-0'
                  onChange={(ev) => handlePropertyNameChange(index, ev)}
                  placeholder='property name (example: color)'
                />
                <input
                  type='text'
                  className='mb-0'
                  onChange={(ev) =>
                    handlePropertyValuesChange(index, ev.target.value)
                  }
                  value={property.values}
                  placeholder='values, comma separated'
                />
                <button
                  onClick={() => removeProperty(index)}
                  type='button'
                  className='btn-red'>
                  Remove
                </button>
              </div>
            ))}
        </div>
        <div className='flex gap-1'>
          {editedCategory && (
            <button
              type='button'
              onClick={() => {
                setEditedCategory(null);
                setName('');
                setParentCategory('');
                setProperties([]);
              }}
              className='btn-default'>
              Cancel
            </button>
          )}
          <button type='submit' className='btn-primary py-1'>
            Save
          </button>
        </div>
      </form>
      {!editedCategory && (
        <table className='basic mt-4'>
          <thead>
            <tr>
              <td>Category name</td>
              <td>Parent category</td>
              <td></td>
            </tr>
          </thead>
          <tbody>
            {categories.length > 0 &&
              categories.map((category) => (
                <tr key={category._id}>
                  <td>{category.name}</td>
                  <td>{category?.parent?.name}</td>
                  <td>
                    <button
                      onClick={() => editCategory(category)}
                      className='btn-default mr-1'>
                      Edit
                    </button>
                    <button
                      onClick={() => deleteCategory(category)}
                      className='btn-red'>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      )}
    </>
  );
}

export default CategoryForm;
