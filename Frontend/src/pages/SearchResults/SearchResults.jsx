import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import ProductItem from '../../components/Product-Item/ProductItem';
import { url } from '../../utils/constant';

function SearchResults() {
  const [products, setProducts] = useState([]);
  const location = useLocation();

  const query = new URLSearchParams(location.search).get('query');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${url}/products?keyword=${query}`);
        console.log(response);
        
        setProducts(response.data.data);
      } catch (error) {
        console.log(error);
      }
    };
    
    if (query) {
      fetchProducts();
    }
  }, [query]);

  return (
    <div>
      <h1>Search Results for "{query}"</h1>
      <div className="product-item-list">
        {products.map((item, index) => (
          <ProductItem key={index} id={item._id} name={item.name} img={item.img} price={item.price} desc={item.desc} category={item.category} reviews={item.reviews} />
        ))}
      </div>
    </div>
  );
}

export default SearchResults;
