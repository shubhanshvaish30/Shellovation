import React, { useState, useEffect } from "react";
import './Place.css';
import OrderBar from "../../components/OrderBar/OrderBar";
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import axios from "axios";
import { setShippingInfo } from "../../Redux/shippingSlice";
import { url } from "../../utils/constant";

function Place() {
    const { user } = useSelector(store => store.auth);
    const userId=localStorage.getItem("userId");
    const { shippingInfo } = useSelector(store => store.shipping);
    const [addresses, setAddresses] = useState([]);
    const [selectedAddress, setSelectedAddress] = useState(null);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchAddresses() {
            try {
                const res = await axios.post(`${url}/address/getAddress`, {userId});
                console.log(res.data);
                setAddresses(res.data.addresses || []);
            } catch (error) {
                console.error("Error fetching addresses", error);
                setAddresses([]);
            }
        }
        fetchAddresses();
    }, [userId]);

    const handleSelectAddress = (address) => {
        setSelectedAddress(address);
        const shippingInfo = {
            addressId: address._id,
            address: address.address,
        };
        dispatch(setShippingInfo(shippingInfo));
        console.log(shippingInfo.addressId);
    };
    
    const handleProceed = () => {
        if (selectedAddress) {
            navigate('/confirm');
        } else {
            alert("Please select an address");
        }
    };

    return (
        <div>
            <OrderBar currentStep={1} />
            <div className="place-container">
                <h2>Select Shipping Address</h2>
                {addresses.length > 0 ? (
                    <div className="address-list">
                        {addresses.map((address) => (
                            <div 
                                key={address._id} 
                                className={`address-item ${selectedAddress?._id === address._id ? 'selected' : ''}`}
                                onClick={() => handleSelectAddress(address)}
                            >
                                <p>{address.address}</p>
                            </div>
                        ))}
                        <div className="button-container">
                            <button onClick={() => navigate('/newAddress')} className="btn-add-new">Add New Address</button>
                            <button onClick={()=>handleProceed()} className="btn-proceed">Proceed</button>
                        </div>
                    </div>
                ) : (
                    <div className="no-address">
                        <p>No addresses found.</p>
                        <button onClick={() => navigate('/newAddress')} className="btn-add-new">Add New Address</button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Place;
