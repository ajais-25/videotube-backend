import mongoose from "mongoose";
import { Video } from "../models/video.model.js";
import { Subscription } from "../models/subscription.model.js";
import { Like } from "../models/like.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.

    const currUserId = req.user._id;

    const subscribers = await Subscription.find({ channel: currUserId });

    if (!subscribers) {
        throw new ApiError(
            500,
            "Something went wrong while fetching subscribers"
        );
    }

    const totalSubscribers = subscribers.length;

    const videos = await Video.find({ owner: currUserId });

    if (!videos) {
        throw new ApiError(500, "Something went wrong while fetching videos");
    }

    const totalVideos = videos.length;

    let totalViews = 0;
    videos.forEach((video) => {
        totalViews += video.views;
    });

    return res.status(200).json(
        new ApiResponse(
            200,
            {
                totalSubscribers,
                totalVideos,
                totalViews,
            },
            "Stats fetched successfully"
        )
    );
});

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel

    const videos = await Video.find({ owner: req.user._id });

    if (!videos) {
        throw new ApiError(500, "Something went wrong while finding videos");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, videos, "Videos fetched successfully"));
});

export { getChannelStats, getChannelVideos };
