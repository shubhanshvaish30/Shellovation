import React from 'react';
import { Link } from 'react-router-dom';

function AddToCartForm({ onSubmit, quantityRef }) {
  return (
    <form onSubmit={onSubmit} className="flex space-x-4">
      <select 
        name="quantity" 
        ref={quantityRef}
        className="rounded-md border-gray-300 py-2 px-4 text-base focus:border-black focus:ring-black"
        defaultValue="1"
      >
        {[...Array(5)].map((_, i) => (
          <option key={i + 1} value={i + 1}>{i + 1}</option>
        ))}
      </select>
      <button
        type="submit"
        className="flex-1 bg-black text-white px-6 py-3 rounded-md hover:bg-gray-800 transition-colors"
      >
        Add to Cart
      </button>
      <Link
        to="/checkout"
        className="flex-1 bg-gray-200 text-gray-900 px-6 py-3 rounded-md hover:bg-gray-300 transition-colors text-center"
      >
        Buy Now
      </Link>
    </form>
  );
}

export default AddToCartForm;