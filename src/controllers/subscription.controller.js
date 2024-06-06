import mongoose, { isValidObjectId } from "mongoose";
import { Subscription } from "../models/subscription.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params;
    // TODO: toggle subscription

    if (!channelId?.trim()) {
        throw new ApiError(400, "channel id is required");
    }

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Not a valid Channel id");
    }

    const isSubscribed = await Subscription.findOne({
        channel: channelId,
        subscriber: req.user._id,
    });

    if (!isSubscribed) {
        const channelSubscribed = await Subscription.create({
            subscriber: req.user._id,
            channel: channelId,
        });

        const createdSubscription = await Subscription.findById(
            channelSubscribed._id
        );

        if (!createdSubscription) {
            throw new ApiError(500, "Something went wrong while subscription");
        }

        return res
            .status(200)
            .json(
                new ApiResponse(200, createdSubscription, "Channel Subscribed")
            );
    }

    const unsubscribed = await Subscription.findByIdAndDelete(isSubscribed._id);

    if (!unsubscribed) {
        throw new ApiError(500, "Error while unsubscribing");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Channel Unsubscribed"));
});

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const { channelId } = req.params;

    if (!channelId?.trim()) {
        throw new ApiError(400, "channel id is required");
    }

    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Not a valid Channel id");
    }

    const subscriberList = await Subscription.find({
        channel: channelId,
    });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                subscriberList,
                "Subscribers found successfully"
            )
        );
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params;

    if (!subscriberId?.trim()) {
        throw new ApiError(400, "subscriber id is required");
    }

    if (!isValidObjectId(subscriberId)) {
        throw new ApiError(400, "Not a valid Subscriber id");
    }

    const channelList = await Subscription.find({ subscriber: subscriberId });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                channelList,
                "Subscribed channels found successfully"
            )
        );
});

export { toggleSubscription, getUserChannelSubscribers, getSubscribedChannels };
