const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const protect = require('../middleware/authMiddleware');
const isAdmin = require('../middleware/adminMiddleware')

router.post('/register', register)
router.post('/login', login)

router.get('/profile', protect, async (req, res) => {
  res.status(200).json({
    message: 'This is a protected route',
    user: req.user,
  });
});

router.get('/admin/dashboard', protect, isAdmin, (req, res) => {
    res.json({
        message: 'Welcome, admin',
        user: req.user,
    })
})

// router.get('/admin/dashboard', protect, isAdmin, (req, res) => {
//     res.json({
//         message: 'Welcome, admin',
//         user: req.user,
//     });
// });


module.exports = router;
