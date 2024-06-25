import React from 'react';

interface Product {
  name: string;
  quantity: number;
  rate: number;
}

interface ProductListProps {
  products: Product[];
}

const ProductList: React.FC<ProductListProps> = ({ products }) => {
  const calculateTotal = (quantity: number, rate: number) => quantity * rate;
  const calculateGST = (total: number) => total * 0.18;
  const calculateGrandTotal = (total: number, gst: number) => total + gst;

  const total = products.reduce((sum, product) => sum + calculateTotal(product.quantity, product.rate), 0);
  const gst = calculateGST(total);
  const grandTotal = calculateGrandTotal(total, gst);

  return (
    <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
      <h3 className="text-lg font-bold mb-4">Product List</h3>
      <ul>
        {products.map((product, index) => (
          <li key={index} className="flex justify-between items-center border-b border-gray-300 py-2">
            <span className="text-gray-700">{product.name}</span>
            <span className="text-gray-700">{product.quantity} x {product.rate} = {calculateTotal(product.quantity, product.rate)}</span>
          </li>
        ))}
      </ul>
      <div className="mt-4">
        <p className="text-gray-700">Total: {total.toFixed(2)}</p>
        <p className="text-gray-700">GST (18%): {gst.toFixed(2)}</p>
        <p className="text-xl font-bold">Grand Total: {grandTotal.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default ProductList;
