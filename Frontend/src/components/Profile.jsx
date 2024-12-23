import React from "react";
import { useSelector } from "react-redux";

const Profile = () => {
  const { user, seller } = useSelector((store) => store.auth);

  const renderDetails = () => {
    if (user) {
      return (
        <div className="p-6  bg-white shadow-lg rounded-lg max-w-2xl mx-auto">
          <div className="flex items-center space-x-4">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">{user.name}</h2>
              <p className="text-gray-500 text-sm">{user.email}</p>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-700">Account Details</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <span className="font-medium text-gray-600">User ID: </span>
                {user.userId}
              </li>
              <li>
                <span className="font-medium text-gray-600">Phone: </span>
                {user.phone}
              </li>
              <li>
                <span className="font-medium text-gray-600">Account Status: </span>
                {user.accountStatus}
              </li>
            </ul>
          </div>
        </div>
      );
    }

    if (seller) {
      return (
        <div className="p-6 bg-white shadow-lg rounded-lg max-w-2xl mx-auto">
          <div className="flex items-center space-x-4">
            <div>
              <h2 className="text-2xl font-semibold text-gray-800">{seller.name}</h2>
              <p className="text-gray-500 text-sm">{seller.email}</p>
            </div>
          </div>
          <div className="mt-6">
            <h3 className="text-lg font-medium text-gray-700">Business Details</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <span className="font-medium text-gray-600">Seller ID: </span>
                {seller.sellerId}
              </li>
              <li>
                <span className="font-medium text-gray-600">Phone Number: </span>
                {seller.phoneNumber}
              </li>
              <li>
                <span className="font-medium text-gray-600">Business Name: </span>
                {seller.businessName}
              </li>
              <li>
                <span className="font-medium text-gray-600">Business Address: </span>
                {seller.businessAddress}
              </li>
              <li>
                <span className="font-medium text-gray-600">Business Type: </span>
                {seller.businessType}
              </li>
              <li>
                <span className="font-medium text-gray-600">Email Verified: </span>
                {seller.emailVerified ? "Yes" : "No"}
              </li>
              <li>
                <span className="font-medium text-gray-600">Phone Verified: </span>
                {seller.phoneVerified ? "Yes" : "No"}
              </li>
            </ul>
          </div>
        </div>
      );
    }

    return (
      <div className="text-center mt-10">
        <h2 className="text-2xl font-bold text-gray-800">No Profile Found</h2>
        <p className="text-gray-600 mt-2">Please log in to view your profile.</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-10">
      <h1 className="text-3xl font-bold text-center text-gray-800 mt-8 mb-8">
        {user ? "User Profile" : seller ? "Seller Profile" : "Profile"}
      </h1>
      {renderDetails()}
    </div>
  );
};

export default Profile;
