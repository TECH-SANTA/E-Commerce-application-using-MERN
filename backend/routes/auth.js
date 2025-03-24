const express = require('express');
const multer = require('multer');
const path = require('path');

const upload = multer({
    storage: multer.diskStorage({
        destination: function(req, file, cb) {
            cb(null, path.join(__dirname, '..', 'uploads/user'));
        },
        filename: function(req, file, cb) {
            cb(null, file.originalname);
        }
    })
});

const { 
    registerUser,
    loginUser,
    logoutUser,
    getUserProfile,
    updateProfile,
    getAllUsers,
    getUser,
    updateUser,
    deleteUser
} = require('../controllers/authController');  // ✅ Import only existing functions

const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/authenticate');

router.route('/register').post(upload.single('avatar'), registerUser);
router.route('/login').post(loginUser);
router.route('/logout').get(logoutUser);
router.route('/myprofile').get(isAuthenticatedUser, getUserProfile);
router.route('/update').put(isAuthenticatedUser, upload.single('avatar'), updateProfile);

// Admin routes
router.route('/admin/users').get(isAuthenticatedUser, authorizeRoles('admin'), getAllUsers);
router.route('/admin/user/:id')
    .get(isAuthenticatedUser, authorizeRoles('admin'), getUser)
    .put(isAuthenticatedUser, authorizeRoles('admin'), updateUser)
    .delete(isAuthenticatedUser, authorizeRoles('admin'), deleteUser);

module.exports = router;
