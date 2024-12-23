const express = require('express');
const User = require('../models/user');
const Seller = require('../models/seller');
const router = express.Router();
const bcrypt = require('bcrypt');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: `pecommerce8@gmail.com`,
    pass: `rqrdabxuzpaecigz`
  },
  tls: {
    rejectUnauthorized: false
  }
});

router.post('/signup', async (req, res) => {
    try {
      const { name, email, password, phone } = req.body;
      console.log(name);
      
      // Check if the user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(400).json({ error: 'User already exists' });
      }
  
      // Create a new user
      const userId = require('crypto').randomBytes(8).toString('hex'); // Generate unique user ID
      const user = new User({ name, email, password, userId, phone });
      await user.save();
  
      // Automatically log the user in
      // const token = jwt.sign({ userId: user.userId, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
      req.session.userId = user.userId;
      console.log(req.session);
      
  
      res.status(201).json({success:true, message: 'User registered successfully', user });
    } catch (err) {
      res.status(500).json({ error: 'Error registering user' });
    }
  });
  router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
  
      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ error: 'Invalid email or password' });
      }
  
      // Compare password
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ error: 'Invalid email or password' });
      }

      // Check account status
      if (user.accountStatus === 'suspended') {
        return res.status(403).json({ error: 'Account is suspended' });
      }

      if (user.accountStatus === 'blocked') {
        return res.status(403).json({ error: 'Account is blocked' });
      }

      // If account status is 'open', proceed with login
      if (user.accountStatus === 'open') {
        // Save userId in session
        // const token = jwt.sign({ userId: user.userId, email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
        req.session.userId = user.userId;
        console.log(req.session);
        
    
        // Respond with success
        return res.status(200).json({success:true, message: 'Login successful', user });
      }

      // Handle any other unexpected account status
      return res.status(400).json({ error: 'Invalid account status' });

    } catch (err) {
      console.error('Login error:', err);
      res.status(500).json({ error: 'Error logging in' });
    }
  });

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) return res.status(500).json({ error: 'Error logging out' });
    res.clearCookie('connect.sid');
    res.json({ message: 'Logout successful' });
  });
});

router.get('/user/:userId', async (req, res) => {
    try {
      const { userId } = req.params;
      const user = await User.findOne({ userId }, { name: 1, _id: 0 }); // Fetch only name
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json({ name: user.name });
    } catch (err) {
      res.status(500).json({ error: 'Error fetching user details' });
    }
  });
  

// Seller routes
router.post('/seller/signup', async (req, res) => {
  try {
    const { phoneNumber, emailId, password, name, businessName, businessAddress, businessType } = req.body;

    // Check if seller already exists
    const existingSeller = await Seller.findOne({ email: emailId });
    if (existingSeller) {
      return res.status(400).json({ error: 'Seller already exists' });
    }

    // Generate unique seller ID (MBSLR + 5 digits)
    let sellerId;
    let isUnique = false;
    while (!isUnique) {
      const randomNum = Math.floor(10000 + Math.random() * 90000);
      sellerId = `MBSLR${randomNum}`;
      const existingId = await Seller.findOne({ sellerId });
      if (!existingId) isUnique = true;
    }

    // Create new seller
    const seller = new Seller({
      name,
      phoneNumber,
      email: emailId,
      password,
      sellerId,
      businessName,
      businessAddress, 
      businessType,
      emailVerified: false,
      phoneVerified: false
    });

    await seller.save();
    const emailHtml = `<div>Email Verification for ${name}...</div>
    <div>Seller ID : ${sellerId}</div>`;
    await transporter.sendMail({ from: `pecommerce8@gmail.com`, to: emailId, subject: 'Email Verification', html: emailHtml });
    // Store sellerId in session
    req.session.sellerId = sellerId;
    console.log(req.session);
    

    res.status(201).json({ 
      success:true,
      message: 'Seller registered successfully',
      seller
    });

  } catch (err) {
    res.status(500).json({ error: 'Error registering seller' });
  }
});

router.get('/get-users', async (req, res) => {
  try {
    const users = await User.find();
    
    res.status(200).json({
      success: true,
      users
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching users',
      error: error.message
    });
  }
});

// router.post('/seller/login', async (req, res) => {
//   try {
//     const { sellerId, emailOrPhone, password } = req.body;

//     // Find seller by ID and email/phone
//     const seller = await Seller.findOne({
//       sellerId,
//       $or: [
//         { email: emailOrPhone },
//         { phoneNumber: emailOrPhone }
//       ]
//     });

//     if (!seller) {
//       return res.status(400).json({ error: 'Invalid credentials' });
//     }

//     // Verify password
//     const isMatch = await bcrypt.compare(password, seller.password);
//     if (!isMatch) {
//       return res.status(400).json({ error: 'Invalid credentials' });
//     }

//     // Store sellerId in session
//     req.session.sellerId = sellerId;

//     res.status(200).json({ 
//       message: 'Login successful',
//       sellerId
//     });

//   } catch (error) {
//     res.status(500).json({ error: 'Error logging in' });
//   }
// });

// router.post('/seller/logout', (req, res) => {
//   req.session.destroy((err) => {
//     if (err) return res.status(500).json({ error: 'Error logging out' });
//     res.clearCookie('connect.sid');
//     res.json({ message: 'Seller logout successful' });
//   });
// });

// router.get('/seller/:sellerId', async (req, res) => {
//   try {
//     const { sellerId } = req.params;
//     const seller = await Seller.findOne({ sellerId }, { 
//       name: 1,
//       businessName: 1,
//       businessAddress: 1,
//       businessType: 1,
//       _id: 0 
//     });
    
//     if (!seller) {
//       return res.status(404).json({ error: 'Seller not found' });
//     }
    
//     res.status(200).json(seller);
//   } catch (err) {
//     res.status(500).json({ error: 'Error fetching seller details' });
//   }
// });


module.exports = router;
