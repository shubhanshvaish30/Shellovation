import React from 'react';
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';

function SimilarProducts({ products }) {
  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Similar Products</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <Link 
            key={product._id} 
            to={`/products/${product._id}`}
            className="group"
          >
            <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-100">
              <img
                src={product.img}
                alt={product.name}
                className="h-full w-full object-cover object-center group-hover:opacity-75 transition-opacity"
              />
            </div>
            <div className="mt-4 space-y-2">
              <h3 className="text-sm text-gray-700">{product.name}</h3>
              <p className="text-lg font-medium text-gray-900">{product.price}</p>
              <div className="flex items-center">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span className="ml-1 text-sm text-gray-600">{product.rating}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default SimilarProducts;