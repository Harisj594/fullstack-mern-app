const User = require('../models/User')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register New User
exports.register = async (req, res) => {
    try {
        const {name, email, password, role} = req.body
        
        // Basic input validation
        if (!name || !email || !password) {
          return res.status(400).json({ message: 'All fields are required' });
        }
        
        // Check if user already exists
        const userExists = await User.findOne({email});
        if (userExists) 
            return res.status(400).json({
            message: 'User already registered'
        });

        // HashedPassword 
        const hashedPassword = await bcrypt.hash(password, 10)

        // Create user
        const user = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'user'
        })

        // Create JWT
        const token = jwt.sign({userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: '1h',
        })

        // Response
        res.status(201).json({
          message: 'Registered successfully',
          token,
          user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }   
}

// Login Existing User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

    // Sign JWT
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};