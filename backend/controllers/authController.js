const catchAsyncError = require('../middlewares/catchAsyncError');
const User = require('../models/userModel');
const ErrorHandler = require('../utils/errorHandler');
const sendToken = require('../utils/jwt');

exports.registerUser = catchAsyncError(async (req, res, next) => {
    const { name, email, password } = req.body;

    let avatar;
    let BASE_URL = process.env.BACKEND_URL;
    if (process.env.NODE_ENV === "production") {
        BASE_URL = `${req.protocol}://${req.get('host')}`;
    }

    if (req.file) {
        avatar = `${BASE_URL}/uploads/user/${req.file.originalname}`;
    }

    const user = await User.create({
        name,
        email,
        password,
        avatar
    });

    sendToken(user, 201, res);
});

exports.loginUser = catchAsyncError(async (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return next(new ErrorHandler('Please enter email & password', 400));
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.isValidPassword(password))) {
        return next(new ErrorHandler('Invalid email or password', 401));
    }

    sendToken(user, 201, res);
});

exports.logoutUser = (req, res, next) => {
    res.cookie('token', null, {
        expires: new Date(Date.now()),
        httpOnly: true
    }).status(200).json({
        success: true,
        message: "Logged out"
    });
};

// Get User Profile - /api/v1/myprofile
exports.getUserProfile = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.user.id);
    res.status(200).json({
        success: true,
        user
    });
});

// Update Profile - /api/v1/update
exports.updateProfile = catchAsyncError(async (req, res, next) => {
    let newUserData = {
        name: req.body.name,
        email: req.body.email
    };

    let avatar;
    let BASE_URL = process.env.BACKEND_URL;
    if (process.env.NODE_ENV === "production") {
        BASE_URL = `${req.protocol}://${req.get('host')}`;
    }

    if (req.file) {
        avatar = `${BASE_URL}/uploads/user/${req.file.originalname}`;
        newUserData = { ...newUserData, avatar };
    }

    const user = await User.findByIdAndUpdate(req.user.id, newUserData, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        user
    });
});

// Admin: Get All Users - /api/v1/admin/users
exports.getAllUsers = catchAsyncError(async (req, res, next) => {
    const users = await User.find();
    res.status(200).json({
        success: true,
        users
    });
});

// Admin: Get Specific User - api/v1/admin/user/:id
exports.getUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler(`User not found with this ID: ${req.params.id}`));
    }
    res.status(200).json({
        success: true,
        user
    });
});

// Admin: Update User - api/v1/admin/user/:id
exports.updateUser = catchAsyncError(async (req, res, next) => {
    const newUserData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    };

    const user = await User.findByIdAndUpdate(req.params.id, newUserData, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        user
    });
});

// Admin: Delete User - api/v1/admin/user/:id
exports.deleteUser = catchAsyncError(async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ErrorHandler(`User not found with this ID: ${req.params.id}`));
    }
    await user.remove();
    res.status(200).json({
        success: true,
        message: "User deleted successfully"
    });
});
