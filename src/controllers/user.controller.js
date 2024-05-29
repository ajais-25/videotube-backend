import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/user.model.js";
import { uploadOnCloudinary } from "../utils/cloudinary.js";
import { ApiResponse } from "../utils/ApiResponse.js";

const registerUser = asyncHandler(async (req, res) => {
    const { fullName, email, username, password } = req.body;
    console.log(fullName, email, username);

    if (!fullName || !email || !username || !password) {
        throw new ApiError(400, "All fields are required");
    }

    User.findOne({ email }).then((existingUser) => {
        if (existingUser) {
            throw new ApiError(409, "User already exists");
        }
    });

    let avatarLocalPath;

    if (req.files.avatar) {
        avatarLocalPath = req.files.avatar[0].path;
    }

    console.log(avatarLocalPath);

    let coverImageLocalPath;

    if (req.files.coverImage) {
        coverImageLocalPath = req.files.coverImage[0].path;
    }

    console.log(coverImageLocalPath);

    const avatar = await uploadOnCloudinary(avatarLocalPath);
    const coverImage = await uploadOnCloudinary(coverImageLocalPath);

    if (!avatar) {
        throw new ApiError(500, "Avatar file is required");
    }

    const user = await User.create({
        fullName,
        avatar: avatar.url,
        coverImage: coverImage?.url || "",
        email,
        password,
        username: username.toLowerCase(),
    });

    const createdUser = await User.find(
        { _id: user._id },
        { password: 0, refreshToken: 0 }
    );

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while creating user");
    }

    return res
        .status(201)
        .json(new ApiResponse(200, createdUser, "User created successfully"));
});

export { registerUser };
