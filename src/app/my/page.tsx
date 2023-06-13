'use client';
import React, { ChangeEvent, useCallback, useState } from 'react';

interface PropertiesType {
  name: string;
  values: string[];
}

function Category() {
  const [properties, setProperties] = useState<PropertiesType[]>([]);

  const addProperty = useCallback(() => {
    setProperties([...properties, { name: '', values: [''] }]);
  }, [properties]);

  const handleChange = useCallback(
    (index: number, event: ChangeEvent<HTMLInputElement>) => {
      const { name, value } = event.target;
      const updatedProperties = [...properties];
      updatedProperties[index] = { ...updatedProperties[index], [name]: value };
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
    <form>
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
              onChange={(ev) => handleChange(index, ev)}
              placeholder='property name (example: color)'
            />
            <input
              type='text'
              className='mb-0'
              onChange={(ev) => handleChange(index, ev)}
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
    </form>
  );
}

export default Category;
