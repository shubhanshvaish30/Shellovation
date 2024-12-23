import React from "react";
import './Explore.css'
import { explore_list } from "../../assets/assets";
import { NavLink } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setCategory } from "../../Redux/productSlice";

function Explore(){
    const dispatch=useDispatch()
    const {category}=useSelector(store=>store.product)
    const handleCategoryClick = (itemCateg) => {
        const newCategory = category === itemCateg ? "All" : itemCateg;
        dispatch(setCategory(newCategory));
    };
    return (
        <div className="explore">
            <h1>Categories:</h1>
            <hr />
            <div className="explore-list">
                {explore_list.map((item,index)=>{
                    return (
                        <div onClick={()=>handleCategoryClick(item.categ)} key={index} className="explore-list-item">
                            <NavLink to={`/${item.categ.toLowerCase()}`}>
                                <img className={category===item.categ?"active":""} src={item.categ_img} alt="" />
                                <p>{item.categ}</p>
                            </NavLink>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Explore