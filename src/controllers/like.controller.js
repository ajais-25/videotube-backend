import mongoose, { isValidObjectId } from "mongoose";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    //TODO: toggle like on video

    if (!videoId?.trim()) {
        throw new ApiError(400, "video id is missing");
    }

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Not a valid video id");
    }

    const likedVideo = await Like.findOne({ video: videoId });

    if (!likedVideo) {
        const videoLiked = await Like.create({
            video: videoId,
            likedBy: req.user._id,
        });

        if (!videoLiked) {
            throw new ApiError(500, "Something went wrong while liking video");
        }

        return res
            .status(200)
            .json(new ApiResponse(200, videoLiked, "Video Liked"));
    }

    const videoUnliked = await Like.findByIdAndDelete(likedVideo._id);

    if (!videoUnliked) {
        throw new ApiError(500, "Something went wrong while unliking video");
    }

    return res.status(200).json(new ApiResponse(200, {}, "Video Unliked"));
});

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params;
    //TODO: toggle like on comment

    if (!commentId?.trim()) {
        throw new ApiError(400, "comment id is missing");
    }

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Not a valid comment id");
    }

    const likedComment = await Like.findOne({ comment: commentId });

    if (!likedComment) {
        const commentLiked = await Like.create({
            comment: commentId,
            likedBy: req.user._id,
        });

        if (!commentLiked) {
            throw new ApiError(
                500,
                "Something went wrong while liking comment"
            );
        }

        return res
            .status(200)
            .json(new ApiResponse(200, commentLiked, "Comment Liked"));
    }

    const commentUnliked = await Like.findByIdAndDelete(likedComment._id);

    if (!commentUnliked) {
        throw new ApiError(500, "Something went wrong while unliking comment");
    }

    return res.status(200).json(new ApiResponse(200, {}, "Comment Unliked"));
});

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params;
    //TODO: toggle like on tweet

    if (!tweetId?.trim()) {
        throw new ApiError(400, "tweet id is missing");
    }

    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Not a valid tweet id");
    }

    const likedTweet = await Like.findOne({ tweet: tweetId });

    if (!likedTweet) {
        const tweetLiked = await Like.create({
            tweet: tweetId,
            likedBy: req.user._id,
        });

        if (!tweetLiked) {
            throw new ApiError(500, "Something went wrong while liking tweet");
        }

        return res
            .status(200)
            .json(new ApiResponse(200, tweetLiked, "tweet Liked"));
    }

    const tweetUnliked = await Like.findByIdAndDelete(likedTweet._id);

    if (!tweetUnliked) {
        throw new ApiError(500, "Something went wrong while unliking tweet");
    }

    return res.status(200).json(new ApiResponse(200, {}, "tweet Unliked"));
});

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos

    const likedItems = await Like.find({ likedBy: req.user._id });

    console.log(likedItems);

    const likedVideos = likedItems.filter((likedItem) => {
        return likedItem.video;
    });

    console.log(likedVideos);

    if (!likedVideos) {
        throw new ApiError(
            500,
            "Something went wrong while fetching liked Videos"
        );
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                likedVideos,
                "Liked videos fetched successfully"
            )
        );
});

export { toggleCommentLike, toggleTweetLike, toggleVideoLike, getLikedVideos };
