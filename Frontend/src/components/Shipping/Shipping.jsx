import React, { useState } from "react";
import './Shipping.css';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useLocation } from 'react-router-dom'; // Import useLocation
import axios from "axios";
import { url } from "../../utils/constant";
import { toast } from "react-toastify";

function Shipping() {
    const { shippingInfo } = useSelector(store => store.shipping);
    const { user } = useSelector(store => store.auth);
    const userId = localStorage.getItem("userId");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation(); // Hook to get current location
    const [newAddress, setNewAddress] = useState({
        address: '',
    });

    const handleInputChange = (e) => {
        const name = e.target.name;
        const value = e.target.value;
        setNewAddress(prevData => ({ ...prevData, [name]: value }));
        console.log(value);
    };

    const submitAddress = async (e) => {
        e.preventDefault();
        try {
            console.log({ userId, ...newAddress });

            const res = await axios.post(`${url}/address/addAddress`, { userId, ...newAddress });
            console.log(res.data);

            if (res.data.success) {
                toast.success(res.data.message);
                // Check where the user came from and navigate accordingly
                if (location.state?.from === "/place") {
                    navigate("/place"); // Navigate back to place if coming from there
                } else {
                    navigate("/"); // Otherwise, navigate to home page
                }
            } else {
                toast.error("Failed to save address");
            }
        } catch (e) {
            console.error("Error saving address", e);
        }
    };

    return (
        <div className="shipping">
            <form onSubmit={submitAddress} className="shipping-form">
                <h2>Shipping Information :</h2>
                <div className="form-group">
                    <label htmlFor="address">Address:</label>
                    <input
                        name="address"
                        id="address"
                        placeholder="Address"
                        onChange={handleInputChange}
                        value={newAddress.address}
                    />
                </div>
                <button type="submit" className="btn-save">Save Address</button>
            </form>
        </div>
    );
}

export default Shipping;
