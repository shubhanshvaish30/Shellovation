const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Address = require('../models/address');

// get address
router.post('/getAddress',async(req,res)=>{
  console.log("kuch");
  
  try {
      const {userId} = req.body;
      console.log(userId);
      
      const addresses = await Address.find({ userId: userId });
      console.log(addresses);
      
      if (!addresses || addresses.length === 0) {
          return res.json({success: false,msg: "No addresses found for this user"});
      }
      console.log(addresses);
      
      return res.json({success: true,addresses});
  } catch (error) {
      console.error("Error fetching addresses:", error);
      return res.json({success: false,msg:"Server error, please try again later"});
  }
})

// Update or Create Address Route
router.post('/addAddress', async (req, res) => {
  try {
    console.log("hello");
    const { userId, address } = req.body;
    
    // Try to find existing address for user
    const existingAddress = await Address.findOne({ userId });

    let result;
    if (existingAddress) {
      // Update existing address
      existingAddress.address = address;
      result = await existingAddress.save();
    } else {
      // Create new address entry
      const newAddress = new Address({
        userId,
        address
      });
      result = await newAddress.save();
      console.log(result);
      
    }

    res.status(200).json({
      success: true,
      message: 'Address updated successfully',
      address: result
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating address',
      error: error.message
    });
  }
});

module.exports = router;