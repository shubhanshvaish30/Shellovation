import React, { useState, useEffect } from "react";
import './Display.css';
import axios from 'axios';
import { useDispatch, useSelector } from "react-redux";
import { setList } from "../../Redux/productSlice";
import ProductItem from "../Product-Item/ProductItem";
import { url } from "../../utils/constant";

function Display() {
    const dispatch = useDispatch();
    const { products, category, subCategory } = useSelector(store => store.product);

    const fetchList = async () => {
        try {
            const response = await axios.get(`${url}/get-product`);
            console.log("API Response:", response.data);
            if (response.data.success) {
                dispatch(setList(response.data.products));
            } else {
                console.error("Failed to fetch products:", response.data.message);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
        }
    };

    useEffect(() => {
        fetchList();
    }, [category,subCategory]);
    console.log(products);
    

    return (
        <div className="prod-display" id="prod-display">
            <h1>New Products:</h1>
            <hr />
            <div className="product-item-list" id="product-item">
                {products.length > 0 ? (
                    products.map((item, index) => (
                        <ProductItem 
                            key={index} 
                            id={item._id} 
                            name={item.name} 
                            img={item.img} 
                            price={item.price} 
                            desc={item.desc} 
                            category={item.category} 
                            rating={item.rating} 
                        />
                    ))
                ) : (
                    <p>No products available</p>
                )}
            </div>
        </div>
    );
}

export default Display;
