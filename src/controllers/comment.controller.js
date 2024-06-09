import mongoose, { isValidObjectId } from "mongoose";
import { Comment } from "../models/comment.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const getVideoComments = asyncHandler(async (req, res) => {
    //TODO: get all comments for a video
    const { videoId } = req.params;
    const { page = 1, limit = 10 } = req.query;

    const skip = (page - 1) * limit;

    const comments = await Comment.find({ video: videoId })
        .skip(skip)
        .limit(limit);

    if (!comments) {
        throw new ApiError(500, "Something went wrong while fetching comments");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, comments, "Comments fetched Successfully"));
});

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const { videoId } = req.params;
    const { content } = req.body;

    if (!videoId?.trim()) {
        throw new ApiError(400, "video id is required");
    }

    if (!isValidObjectId(videoId)) {
        throw new ApiError(400, "Not a valid video id");
    }

    if (!content) {
        throw new ApiError(400, "content is required");
    }

    const comment = await Comment.create({
        content,
        video: videoId,
        owner: req.user._id,
    });

    if (!comment) {
        throw new ApiError(500, "Something went wrong while creating comment");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, comment, "Comment created successfully"));
});

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment

    const { commentId } = req.params;
    const { content } = req.body;

    if (!commentId?.trim()) {
        throw new ApiError(400, "comment id is required");
    }

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Not a valid comment id");
    }

    if (!content) {
        throw new ApiError(400, "content is required");
    }

    const comment = await Comment.findByIdAndUpdate(
        commentId,
        { $set: { content } },
        { new: true }
    );

    if (!comment) {
        throw new ApiError(500, "Something went wrong while updating comment");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, comment, "Comment updated successfully"));
});

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment

    const { commentId } = req.params;

    if (!commentId?.trim()) {
        throw new ApiError(400, "comment id is required");
    }

    if (!isValidObjectId(commentId)) {
        throw new ApiError(400, "Not a valid comment id");
    }

    const deletedComment = await Comment.findByIdAndDelete(commentId);

    if (!deletedComment) {
        throw new ApiError(500, "Something went wrong while deleting comment");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Comment deleted successfully"));
});

export { getVideoComments, addComment, updateComment, deleteComment };
