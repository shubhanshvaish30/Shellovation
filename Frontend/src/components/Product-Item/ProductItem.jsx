import React from "react";
import { NavLink } from "react-router-dom";
import { FaStar, FaEye } from "react-icons/fa";

function ProductItem({ name, id, desc, category, price, rating, img }) {
  return (
    <div className="w-full mx-auto rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-lg">
      <NavLink to={`/products/${id}`} className="text-black no-underline">
        <div className="relative w-full h-64 overflow-hidden rounded-t-lg bg-gray-100">
          <img
            src={img}
            alt={name}
            className="w-full h-full object-cover"
          />
        </div>
        <div className="p-5">
          <div className="flex justify-between items-center mb-3">
            <p className="text-lg font-medium">{name}</p>
          </div>
          <div className="flex items-center text-yellow-500 mb-2">
            <span className="text-base font-medium">{rating}</span>
            <FaStar className="ml-1" />
          </div>
          <p className="text-xl font-semibold text-black mt-2">
            Rs. {price}
          </p>
          {/* View Product Button */}
          <div className="mt-4">
            <button className="flex items-center justify-center w-full py-2 text-white bg-primary rounded-md transition-transform duration-300 hover:scale-105 hover:shadow-md">
              <FaEye className="mr-2" />
              View Product
            </button>
          </div>
        </div>
      </NavLink>
    </div>
  );
}

export default ProductItem;
