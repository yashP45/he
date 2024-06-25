import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { addProduct } from '../api/api';
import ProductForm from './ProductForm';
import ProductList from './ProductList';

interface Product {
  name: string;
  quantity: number;
  rate: number;
}

const AddProductPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const navigate = useNavigate();
  const token = localStorage.getItem('token') || '';
  console.log(token)
  
  const handleAddProduct = async (product: Product) => {
    try {
      const { data } = await addProduct(product, token);
      setProducts([...products, data]);
    } catch (err) {
      alert('Error adding product');
    }
  };

  const handleNext = () => {
    navigate('/generate-pdf');
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Add Products</h2>
      <ProductForm onAddProduct={handleAddProduct} />
      <ProductList products={products} />
      <button 
        className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300" 
        onClick={handleNext}
      >
        Next
      </button>
    </div>
  );
};

export default AddProductPage;
