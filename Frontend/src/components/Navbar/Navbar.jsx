import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { clearAuth, clearAuthSeller } from "../../Redux/authSlice";
import { setCategory } from "../../Redux/productSlice";
import { toast } from "react-toastify";
import axios from "axios";
import { url } from "../../utils/constant";
import { assets } from "../../assets/assets";

function Navbar({ setShowLogin }) {
  const { user,seller } = useSelector((store) => store.auth);
  const { totalQuantity } = useSelector((store) => store.cart);
  const { category } = useSelector((store) => store.product);
  const userId = localStorage.getItem("userId");
  const sellerId = localStorage.getItem("sellerId");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleCategoryClick = (itemCateg) => {
    const newCategory = category === itemCateg ? "All" : itemCateg;
    dispatch(setCategory(newCategory));
    navigate(`/${newCategory.toLowerCase()}`);
    setIsMenuOpen(false);
  };

  const handleLogout = async () => {
    try {
      let path=url;
      if(userId){
        path+="/auth/logout"
      }else{
        path+="/admin/logout"
      }
      console.log(path);
      
      const res=await axios.post(path,{sellerId});
      localStorage.removeItem("userId");
      localStorage.removeItem("sellerId");
      dispatch(clearAuth());
      dispatch(clearAuthSeller());
      navigate("/login");
      toast.success(res.data.msg);
    } catch (error) {
      console.log(error);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?query=${searchQuery}`);
    }
  };

  return (
    <nav className="sticky top-0 w-full z-50 bg-white/10 backdrop-blur-md shadow-sm transition-all duration-300">
      <div className="max-w-8xl mx-auto px-2 sm:px-10">
        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center justify-between h-14">
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-gray-800 hover:text-black"
          >
            <i className={`fas ${isMenuOpen ? 'fa-times' : 'fa-bars'} text-2xl`} />
          </button>
          
          <Link to="/" className="flex items-center space-x-2">
            <img src={assets.logo} alt="Mytalorzone By Sahiba Logo" className="h-8 w-auto" />
            <span className="text-xl font-semibold text-gray-800">Mytalorzone By Sahiba</span>
          </Link>

          <NavLink to="/cart" className="relative text-gray-800 hover:text-black">
            <i className="fas fa-cart-plus text-xl" />
            {totalQuantity > 0 && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                {totalQuantity}
              </span>
            )}
          </NavLink>
        </div>

        {/* Mobile Search Bar */}
        {(userId || sellerId) && <div className="md:hidden py-2">
          <form onSubmit={handleSearch} className="flex items-center">
            <div className="relative w-full">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-1.5 rounded-full bg-white border-2 border-transparent
                focus:border-black outline-none transition-all duration-300 text-base"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black"
              >
                <i className="fas fa-search" />
              </button>
            </div>
          </form>
        </div>}

        {/* Mobile Menu */}
        <div className={`md:hidden ${isMenuOpen ? 'block' : 'hidden'} py-2`}>
          <div className="flex flex-col space-y-3">
            <NavLink to="/" 
              className="px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-md text-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </NavLink>
            
            {!seller && <div className="px-4 py-2">
              <div className="text-gray-800 text-lg mb-2">Categories</div>
              <div className="flex flex-col space-y-2 pl-4">
                {['Mens', 'Womens', 'Kids', 'Footwears', 'Beauty'].map((cat) => (
                  <Link
                    key={cat}
                    to={`/${cat.toLowerCase()}`}
                    onClick={() => handleCategoryClick(cat)}
                    className="text-gray-600 hover:text-black"
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </div>}

            {user && <NavLink to="/location" 
              className="px-4 py-2 text-gray-800 hover:bg-gray-100 rounded-md text-lg"
              onClick={() => setIsMenuOpen(false)}
            >
              <i className="fas fa-map-marker-alt mr-2" />
              Location
            </NavLink>}

            <div className="px-4 py-2">
              <div className="text-gray-800 text-lg mb-2">Profile</div>
              <div className="flex flex-col space-y-2 pl-4">
                <Link to="/profile" 
                  className="text-gray-600 hover:text-black"
                  onClick={() => setIsMenuOpen(false)}
                >
                  View Profile
                </Link>
                <Link to="/addCompaint"
                  className="text-gray-600 hover:text-black"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Post Complaint
                </Link>
                {user && <Link to="/orders"
                  className="text-gray-600 hover:text-black"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Orders
                </Link>}
              </div>
            </div>

            {(userId || sellerId) ? (
              <button
                onClick={() => {
                  handleLogout();
                  setIsMenuOpen(false);
                }}
                className="mx-4 px-4 py-4 rounded-full bg-black text-white hover:bg-gray-800 
                transition-colors duration-300 text-lg font-medium"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => {
                  setShowLogin(true);
                  navigate("/login");
                  setIsMenuOpen(false);
                }}
                className="mx-4 px-4 py-4 rounded-full bg-black text-white hover:bg-gray-800 
                transition-colors duration-300 text-lg font-medium"
              >
                Login
              </button>
            )}
          </div>
        </div>

        {/* Desktop View*/}
        <div className="hidden md:flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            <Link to="/" className="flex items-center space-x-2">
              <img src={assets.logo} alt="Mytalorzone By Sahiba Logo" className="h-10 w-auto" />
              <span className="text-2xl font-semibold text-gray-800">Mytalorzone By Sahiba</span>
            </Link>

            <div className="hidden md:flex items-center space-x-6">
              <NavLink to="/" className="nav-link text-gray-800 hover:text-black text-lg font-medium">
                Home
              </NavLink>

              {!seller && <div className="group relative">
                <button className="nav-link text-gray-800 hover:text-black text-lg font-medium">Categories</button>
                <div className="dropdown-content">
                  {['Mens', 'Womens', 'Kids', 'Footwears', 'Beauty'].map((cat) => (
                    <Link
                      key={cat}
                      to={`/${cat.toLowerCase()}`}
                      onClick={() => handleCategoryClick(cat)}
                      className="first:rounded-t-md last:rounded-b-md"
                    >
                      {cat}
                    </Link>
                  ))}
                </div>
              </div>}
            </div>
          </div>

          <form onSubmit={handleSearch} className="hidden md:flex items-center">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-96 px-6 py-2 rounded-full bg-white focus:bg-white border-2 border-gray-400
                focus:border-black outline-none transition-all duration-300 text-lg"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-black"
              >
                <i className="fas fa-search" />
              </button>
            </div>
          </form>

          <div className="hidden md:flex items-center space-x-8">
            <NavLink to="/newAddress" className="nav-link text-gray-800 hover:text-black text-lg">
              <i className="fas fa-map-marker-alt" />
            </NavLink>

            <NavLink to="/cart" className="nav-link relative text-gray-800 hover:text-black text-lg">
              <i className="fas fa-cart-plus" />
              {totalQuantity > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {totalQuantity}
                </span>
              )}
            </NavLink>

            {user && (
              <span className="text-lg text-gray-700">Hello, {user.name}</span>
            )}

            {(userId || sellerId) ? (
              <button
                onClick={handleLogout}
                className="px-4 py-2 rounded-full bg-black text-white hover:bg-gray-800 
                transition-colors duration-300 text-lg font-medium"
              >
                Logout
              </button>
            ) : (
              <button
                onClick={() => {
                  setShowLogin(true);
                  navigate("/login");
                }}
                className="px-4 py-2 rounded-full bg-black text-white hover:bg-gray-800 
                transition-colors duration-300 text-lg font-medium"
              >
                Login
              </button>
            )}

            <div className="group relative">
              <button className="nav-link text-gray-800 hover:text-black text-lg">
                <i className="fas fa-user" />
              </button>
              <div className="dropdown-content right-0">
                <Link to="/profile">View Profile</Link>
                <Link to="/addComplaint">Post Complaint</Link>
                {user && <Link to="/orders">Orders</Link>}
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;