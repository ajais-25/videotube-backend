import mongoose, { isValidObjectId } from "mongoose";
import { Tweet } from "../models/tweet.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const { content } = req.body;

    if (!content) {
        throw new ApiError(400, "content is required");
    }

    const tweet = await Tweet.create({
        content,
        owner: req.user._id,
    });

    console.log(tweet);

    if (!tweet) {
        throw new ApiError(500, "Something went wrong while creating tweet");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, tweet, "Tweet created successfully"));
});

const getUserTweets = asyncHandler(async (req, res) => {
    // TODO: get user tweets
    const { userId } = req.params;

    if (!userId?.trim()) {
        throw new ApiError(400, "user id is missing");
    }

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Not a valid userId");
    }

    const userTweets = await Tweet.find({ owner: userId });

    if (!userTweets) {
        throw new ApiError(500, "User tweets not found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(200, userTweets, "User tweets fetched successfully")
        );
});

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const { tweetId } = req.params;
    const { content } = req.body;

    if (!tweetId?.trim()) {
        throw new ApiError(400, "tweet id is missing");
    }

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Not a valid tweet id");
    }

    if (!content) {
        throw new ApiError(400, "Content is required");
    }

    const tweet = await Tweet.findByIdAndUpdate(
        tweetId,
        { $set: { content } },
        { new: true }
    );

    if (!tweet) {
        throw new ApiError(500, "Something went wrong while updating tweet");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, tweet, "Tweet updated successfully"));
});

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet
    const { tweetId } = req.params;

    if (!tweetId?.trim()) {
        throw new ApiError(400, "tweet id is missing");
    }

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Not a valid tweet id");
    }

    const deletedTweet = await Tweet.findByIdAndDelete(tweetId);

    console.log(deletedTweet);

    if (!deletedTweet) {
        throw new ApiError(500, "Something went wrong while deleting tweet");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Tweet deleted successfully"));
});

export { createTweet, getUserTweets, updateTweet, deleteTweet };
