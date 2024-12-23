import React from 'react';

function ProductImages({ mainImage, productImages, onImageSelect }) {
  return (
    <div className="space-y-4">
      <div className="aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-lg bg-gray-100">
        <img 
          src={mainImage} 
          alt="Product view"
          className="h-full w-full object-cover object-center"
        />
      </div>
      <div className="grid grid-cols-5 gap-2">
        {[...Array(5)].map((_, index) => (
          <button
            key={index}
            onClick={() => onImageSelect(productImages)}
            className={`relative aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md ${
              mainImage === productImages ? 'ring-2 ring-black' : ''
            }`}
          >
            <img
              src={productImages}
              alt={`View ${index + 1}`}
              className="h-full w-full object-cover object-center"
            />
          </button>
        ))}
      </div>
    </div>
  );
}

export default ProductImages;