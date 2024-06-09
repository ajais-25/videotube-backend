import mongoose, { isValidObjectId } from "mongoose";
import { Video } from "../models/video.model.js";
import { User } from "../models/user.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import {
    uploadOnCloudinary,
    deleteFromCloudinary,
    deleteVideoFromCloudinary,
} from "../utils/cloudinary.js";

const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, userId } = req.query;
    //TODO: get all videos based on query, sort, pagination

    if (!userId?.trim()) {
        throw new ApiError(400, "user id is missing");
    }

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Not a valid user id");
    }

    const skip = (page - 1) * limit;

    const videos = await Video.find({ owner: userId })
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 });

    if (!videos) {
        throw new ApiError(500, "Something went wrong while fetching videos");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, videos, "Videos fetched Successfully"));
});

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body;
    // TODO: get video, upload to cloudinary, create video

    if (!title || !description) {
        throw new ApiError(400, "title or description is required");
    }

    let videoFileLocalPath;

    if (req.files.videoFile) {
        videoFileLocalPath = req.files.videoFile[0].path;
    }

    console.log(videoFileLocalPath);

    let thumbnailLocalPath;

    if (req.files.thumbnail) {
        thumbnailLocalPath = req.files.thumbnail[0].path;
    }

    console.log(thumbnailLocalPath);

    const videoFile = await uploadOnCloudinary(videoFileLocalPath);
    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    console.log(videoFile);

    if (!videoFile || !thumbnail) {
        throw new ApiError(500, "Video file or thumbnail is required");
    }

    const video = await Video.create({
        videoFile: videoFile.url,
        thumbnail: thumbnail.url,
        title,
        description,
        duration: videoFile.duration,
        owner: req.user?._id,
    });

    const createdVideo = await Video.findById(video._id).select(
        "-views -isPublished"
    );

    if (!createdVideo) {
        throw new ApiError(500, "Something went wrong while creating a video");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, createdVideo, "Video created successfully"));
});

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    //TODO: get video by id

    if (!videoId?.trim()) {
        throw new ApiError(400, "video id is missing");
    }

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Not a valid video id");
    }

    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(500, "Video not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, video, "Video found successfully"));
});

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    const { title, description } = req.body;
    //TODO: update video details like title, description, thumbnail

    if (!videoId?.trim()) {
        throw new ApiError(400, "video id is missing");
    }

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Not a valid video id");
    }

    if (!title || !description) {
        throw new ApiError(400, "title or description is required");
    }

    let thumbnailLocalPath;

    if (req.file) {
        thumbnailLocalPath = req.file.path;
    }

    if (!thumbnailLocalPath) {
        throw new ApiError(400, "thumbnail file is required");
    }

    console.log(thumbnailLocalPath);

    const video = await Video.findById(videoId);

    const oldLink = video.thumbnail.split("/");
    const publicId = oldLink[oldLink.length - 1].split(".")[0];
    console.log(publicId);
    await deleteFromCloudinary(publicId);

    const thumbnail = await uploadOnCloudinary(thumbnailLocalPath);

    if (!thumbnail.url) {
        throw new ApiError(400, "Error while uploading thumbnail");
    }

    video.title = title;
    video.description = description;
    video.thumbnail = thumbnail.url;
    await video.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(new ApiResponse(200, video, "Video updated successfully"));
});

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    //TODO: delete video

    if (!videoId?.trim()) {
        throw new ApiError(400, "video id is missing");
    }

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Not a valid video id");
    }

    const video = await Video.findByIdAndDelete(videoId);

    console.log(video);

    const videoOldLink = video.videoFile.split("/");
    const videoPublicId = videoOldLink[videoOldLink.length - 1].split(".")[0];
    console.log(videoPublicId);
    const deletedVideo = await deleteVideoFromCloudinary(videoPublicId);

    console.log(deletedVideo);

    const thumbnailOldLink = video.thumbnail.split("/");
    const thumbnailPublicId =
        thumbnailOldLink[thumbnailOldLink.length - 1].split(".")[0];
    console.log(thumbnailPublicId);
    await deleteFromCloudinary(thumbnailPublicId);

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Video deleted successfully"));
});

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    if (!videoId?.trim()) {
        throw new ApiError(400, "video id is missing");
    }

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Not a valid video id");
    }

    const video = await Video.findById(videoId);

    video.isPublished = !video.isPublished;
    await video.save({ validateBeforeSave: false });

    return res
        .status(200)
        .json(new ApiResponse(200, video, "Published status changed"));
});

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus,
};
