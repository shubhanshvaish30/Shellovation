import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { Star } from 'lucide-react';
import { toast } from 'react-toastify';
import ProductImages from '../ProductImages';
import ProductFeatures from '../ProductFeatures';
import AddToCartForm from '../AddToCartForm';
import SimilarProducts from '../SimilarProducts';
import { handleCartSuccess } from '../cartUtils.js';
import { url } from '../../utils/constant.js';
import { setCart } from '../../Redux/cartSlice.js';
// import LoadingSpinner from '../common/LoadingSpinner';

function Show() {    
    const { id } = useParams();
    const dispatch = useDispatch();
    const {  user } = useSelector(store => store.auth);
    const [foundProduct, setFoundProduct] = useState(null);
    const [similarProducts, setSimilarProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [mainImage, setMainImage] = useState("");
    const quantityRef = useRef(null);
  
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`${url}/product/${id}`);   
        console.log(response.data);
             
        setFoundProduct(response.data.product);
        setMainImage(response.data.product.img);
        fetchSimilar(response.data.product);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching product:', error);
        setLoading(false);
      }
    };
    console.log(foundProduct);
    const fetchSimilar=async(similar)=>{
        try{
            console.log(similar.category);
            
            const similarResponse = await axios.post(`${url}/product/category`,{
                category: similar.category});
            setSimilarProducts(similarResponse.data.products.filter(p => p._id !== id).slice(0, 4));
        }catch(err){
            console.log(err);
        }
    }
    console.log(similarProducts);
    
    
    useEffect(() => { 
      fetchProduct();
      window.scrollTo(0, 0);
    }, [id]);
  
    const cartAdd = async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const quantity = formData.get("quantity");
      
      try {
        const response = await axios.post(`${url}/cart/addtocart`, {
          productId: foundProduct.productId,
          userId: user.userId,
          quantity: parseInt(quantity),
        });
        console.log(response.data);
        if(response.data.success){
          if (quantityRef.current) {
            quantityRef.current.value = "1";
          }
          toast.success(response.data.message);
        }
      } catch (error) {
        console.log(error);
        
        toast.error("Please login to add items to cart!");
      }
    };
  
    // if (loading) return <LoadingSpinner />;
    if (!foundProduct) return <div className="flex items-center justify-center min-h-screen"><p className="text-xl text-gray-600">Product not found</p></div>;
  
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Product Details Section */}
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="grid grid-cols-1 md:grid-cols-2">
              {/* Left Column - Product Images */}
              <div className="p-6 border-r border-gray-200">
                <ProductImages 
                  mainImage={mainImage}
                  productImages={foundProduct.img}
                  onImageSelect={setMainImage}
                />
              </div>
  
              {/* Right Column - Product Info */}
              <div className="p-8 space-y-8">
                {/* Product Title and Rating */}
                <div className="space-y-4">
                  <h1 className="text-3xl font-bold text-gray-900 tracking-tight">
                    {foundProduct.name}
                  </h1>
                  <div className="flex items-center space-x-2">
                    <div className="flex items-center bg-gray-100 px-3 py-1.5 rounded-lg">
                      <span className="text-sm font-medium text-gray-900">{foundProduct.rating}</span>
                      <Star className="w-4 h-4 ml-1.5 text-yellow-400 fill-current" />
                    </div>
                  </div>
                </div>
  
                {/* Price */}
                <div className="border-t border-gray-200 pt-6">
                  <p className="text-3xl font-semibold text-gray-900">
                    {foundProduct.price}
                  </p>
                </div>
  
                {/* Features */}
                <div className="border-t border-gray-200 pt-6">
                  <ProductFeatures />
                </div>
  
                {/* Description */}
                <div className="border-t border-gray-200 pt-6">
                  <h3 className="text-sm font-medium text-gray-900 mb-4">Description</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {foundProduct.description || "No description available"}
                  </p>
                </div>
  
                {/* Add to Cart Form */}
                <div className="border-t border-gray-200 pt-6">
                  <AddToCartForm onSubmit={cartAdd} quantityRef={quantityRef} />
                </div>
              </div>
            </div>
          </div>
  
          {/* Similar Products Section */}
          <div className="mt-16">
            <SimilarProducts products={similarProducts} />
          </div>
        </div>
      </div>
    );
  }
  
  export default Show;