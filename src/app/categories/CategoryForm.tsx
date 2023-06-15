'use client';
import { ChangeEvent, FormEvent, useCallback, useState } from 'react';
import axios from 'axios';
import { CategoryDataType, CategoryType, PropertyType } from '../../../types';

interface PropertiesData {
  name: string;
  values: string;
}

function CategoryForm({ categories = [] }: { categories: CategoryType[] }) {
  const [editedCategory, setEditedCategory] = useState<CategoryType | null>(
    null
  );
  const [name, setName] = useState('');
  const [parentCategory, setParentCategory] = useState<string | undefined>();
  const [properties, setProperties] = useState<PropertiesData[]>([]);

  const saveCategory = useCallback(
    async (ev: FormEvent<HTMLFormElement>) => {
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
    },
    [editedCategory, name, parentCategory, properties]
  );

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

  const addProperty = useCallback(() => {
    setProperties((prev) => {
      return [...prev, { name: '', values: '' }];
    });
  }, []);

  const handlePropertyNameChange = useCallback(
    (index: number, newName: string) => {
      setProperties((prev) => {
        const updatedProperties = [...prev];
        updatedProperties[index].name = newName;
        return updatedProperties;
      });
    },
    []
  );

  const handlePropertyValuesChange = useCallback(
    (index: number, newValues: string) => {
      setProperties((prev) => {
        const updatedProperties = [...prev];
        updatedProperties[index].values = newValues;
        return updatedProperties;
      });
    },
    []
  );

  const removeProperty = useCallback((indexToRemove: number) => {
    setProperties((prev) => {
      return [...prev].filter((_, pIndex) => {
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
                  onChange={(ev) =>
                    handlePropertyNameChange(index, ev.target.value)
                  }
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
                    {/* <button
                      onClick={() => deleteCategory(category)}
                      className='btn-red'>
                      Delete
                    </button> */}
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
