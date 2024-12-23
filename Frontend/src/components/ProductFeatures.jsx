import React from 'react';

function ProductFeatures() {
  const features = [
    { icon: "↩️", label: "Return" },
    { icon: "🔄", label: "Exchange" },
    { icon: "🏷️", label: "Offers" },
    { icon: "🚚", label: "Free Shipping" }
  ];

  return (
    <div className="border-t border-b border-gray-200 py-4">
      <div className="grid grid-cols-4 gap-4">
        {features.map((feature, index) => (
          <div key={index} className="flex flex-col items-center text-center">
            <div className="w-12 h-12 rounded-full border-2 border-gray-300 flex items-center justify-center mb-2">
              <span className="text-xl">{feature.icon}</span>
            </div>
            <span className="text-sm text-gray-600">{feature.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProductFeatures;