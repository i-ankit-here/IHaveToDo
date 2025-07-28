import jwt from "jsonwebtoken"
import { apiError } from "../utils/apiError.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import apiResponse from "../utils/apiResponse.js";
import { User } from "../models/user.model.js"

const generateAccessRefreshToken = async (id) => {
    const user = await User.findById(id);
    const refreshToken = await user.generateRefreshTokens();
    const accessToken = await user.generateAccessTokens();
    user.refreshToken = refreshToken;
    await user.save();
    return { refreshToken, accessToken };
}

const registerUser = asyncHandler(async (req, res) => {
    const { username, email, password, firstname, lastname } = req.body;
    console.log(username, email, password, firstname, lastname);
    if ([username, email, password, firstname, lastname].some((item) => (item == undefined || !item))) {
        throw new apiError(401, "All details are necessary")
    }
    const exists = await User.findOne({
        $or: [{ username: username }, { email: email }]
    })
    console.log(exists);
    if (exists) throw new apiError(401, "username or email already exists");
    // if(!req.file.path)throw new apiError(500,"avatar not saved");
    const user = await User.create({
        username: username.toLowerCase(),
        email: email,
        password: password,
        firstname: firstname,
        lastname: lastname,
        avatar: "",
    })
    const { refreshToken, accessToken } = await generateAccessRefreshToken(user._id);
    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    const options = { httpOnly: true, secure: true, sameSite: "none" }
    if (!createdUser) throw new apiError(500, "User not created")
    res.status(200).cookie("refreshToken", refreshToken, options).cookie("accessToken", accessToken, options).json(new apiResponse(200, createdUser));
})

const loginUser = asyncHandler(async (req, res) => {
    const { password, username } = req.body;
    if (!username) throw new apiError(401, "username is required");
    const user = await User.findOne({ username: username });
    if (!user) throw new apiError(401, "Username does not exist");
    const flag = await user.isPasswordCorrect(password);
    if (!flag) throw new apiError(401, "Password is incorrect");
    const { refreshToken, accessToken } = await generateAccessRefreshToken(user._id);
    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    const options = { httpOnly: true, secure: true, sameSite: "none" }
    res.status(200).cookie("refreshToken", refreshToken, options).cookie("accessToken", accessToken, options).json(
        new apiResponse(200, {
            user: createdUser,
            refreshToken: refreshToken,
            accessToken: accessToken
        },
            "User logged in successfully")
    )
})

const logoutUser = asyncHandler(async (req, res) => {
    const user = await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: null
            }
        },
        {
            new: true
        }
    )
    console.log(user)
    const options = { httpOnly: true, secure: true, sameSite: "none" }
    res.status(200)
        .clearCookie("accessToken", options)
        .clearCookie("refreshToken", options)
        .json(new apiResponse(200, {}, "User logged out successfully"))
})

const regenerateAccessToken = asyncHandler(async (req, res) => {
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
        throw new apiError(401, "Unauthorized request");
    }
    const payload = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(payload._id);
    if (!user) {
        throw new apiError(401, "Invalid refresh token");
    }
    if (refreshToken !== user.refreshToken) {
        throw new apiError(401, "Invalid refresh token");
    }
    const { newAccessToken, newRefreshToken } = generateAccessRefreshToken(user._id);
    user.refreshToken = newRefreshToken;
    await user.save();
    const createdUser = await User.findById(user.id);
    const options = { httpOnly: true, secure: true, sameSite: "none" };

    res.status(200)
        .cookies("accessToken", newAccessToken, options)
        .cookies("refreshToken", newRefreshToken, options)
        .json(new apiResponse(200, {
            user: createdUser,
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        }))
})

const updatePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(req.user._id);
    if (!user) {
        throw new apiError(401, "Unauthorized request");
    }
    const flag = await user.isPasswordCorrect(oldPassword);
    if (!flag) {
        throw new apiError(401, "Wrong old password");
    }
    user.password = newPassword;
    await user.save()
    const createdUser = await User.findById(user._id).select("-password -refreshToken");
    res.status(200).json(new apiResponse(200, { user: createdUser }, "Password changed successfully"))
})

const getUser = asyncHandler(async (req, res) => {
    console.log(req.user);
    res.status(200).json(new apiResponse(200, { user: req.user }, "user sent successfully"));
})

const getUserByIds = asyncHandler(async (req, res) => {
    const { userIds } = req.body;
    if (!userIds) {
        throw new apiError(400, "User IDs are required");
    }
    const users = await User.find({ _id: { $in: userIds } }).select("-password -refreshToken");
    if (!users || users.length === 0) {
        throw new apiError(404, "No users found");
    }
    res.status(200).json(new apiResponse(200, users, "Users fetched successfully"));
})

const getUserById = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    if (!userId) {
        throw new apiError(400, "User ID is required");
    }
    const user = await User.findById(userId).select("-password -refreshToken");
    if (!user) {
        throw new apiError(404, "User not found");
    }
    res.status(200).json(new apiResponse(200, user, "User fetched successfully"));
})


const updateUser = asyncHandler(async (req, res) => {
    const { username, email, firstname, lastname } = req.body;
    console.log(username, email, firstname, lastname);
    if ([username, email, firstname, lastname].some((item) => (item == undefined || !item))) {
        throw new apiError(401, "All details are necessary")
    }
    const exists = await User.findOne({
        $or: [{ username: username }, { email: email }]
    })
    console.log(exists);
    if (!exists) throw new apiError(401, "username or email does not exists");
    // if(!req.file.path)throw new apiError(500,"avatar not saved");
    exists.username = username;
    exists.email = email;
    exists.firstname = firstname;
    exists.lastname = lastname;
    const user = await exists.save();
    if (!user) throw new apiError(500, "User not created")
    res.status(200).json(new apiResponse(200, user));
})

export { registerUser, loginUser, logoutUser, regenerateAccessToken, updatePassword, getUser, updateUser, getUserByIds, getUserById };