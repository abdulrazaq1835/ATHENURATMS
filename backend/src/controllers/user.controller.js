import User from '../models/user.model.js';
import ApiError from '../utils/ApiError.js';
import ApiResponse from '../utils/ApiResponse.js';
import asyncHandler from '../utils/asyncHandler.js';

// Superuser: Bulk Upload Users to Global Pool
const bulkUploadUsers = asyncHandler(async (req, res) => {
    const { users } = req.body; // Expecting [{ name, email, phone }]
    
    if (!users || !Array.isArray(users) || users.length === 0) {
        throw new ApiError(400, "Please provide an array of users.");
    }

    const defaultPassword = process.env.DEFAULT_USER_PASSWORD || "Welcome@123";
    
    // Create new array of users mapping default properties
    const newUsers = users.map(user => ({
        name: user.name,
        email: user.email,
        phone: user.phone || "",
        password: defaultPassword,
        domain: user.domain || "",
        joiningDate: user.joiningDate ? new Date(user.joiningDate) : null,
        internId: user.internId || "",
    }));

    // Insert multiple (Mongoose handles pre-save hooks on create in an iterative way if done sequentially, 
    // or we can use insertMany but insertMany bypasses 'pre' save hooks in mongoose so passwords won't hash)
    const createdUsers = [];
    const errors = [];

    for (let u of newUsers) {
        try {
            const exists = await User.findOne({ email: u.email });
            if (!exists) {
                const newUser = await User.create(u);
                createdUsers.push(newUser);
            } else {
                errors.push(`${u.email} already exists`);
            }
        } catch (error) {
            errors.push(`Failed for ${u.email}: ${error.message}`);
        }
    }

    return res.status(200).json(
        new ApiResponse(
            200, 
            { created: createdUsers.length, errors }, 
            "Bulk upload complete"
        )
    );
});

// Any User: Change Password
const changePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;

    if (!oldPassword || !newPassword) {
        throw new ApiError(400, "Old and new passwords are required");
    }

    const user = await User.findById(req.user._id);
    const isPasswordCorrect = await user.isPasswordCorrect(oldPassword);
    
    if (!isPasswordCorrect) {
        throw new ApiError(400, "Invalid old password");
    }

    user.password = newPassword;
    user.defaultPasswordChanged = true;
    await user.save({ validateBeforeSave: false });

    return res.status(200).json(new ApiResponse(200, {}, "Password changed successfully"));
});

// Superuser: Get all users in global pool
const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select("-password -refreshToken").sort({ createdAt: -1 });
    return res.status(200).json(new ApiResponse(200, users, "Users fetched successfully"));
});

export { bulkUploadUsers, changePassword, getAllUsers };
