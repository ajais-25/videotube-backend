import mongoose, { isValidObjectId } from "mongoose";
import { Playlist } from "../models/playlist.model.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { asyncHandler } from "../utils/asyncHandler.js";

const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body;

    //TODO: create playlist

    if (!name || !description) {
        throw new ApiError(400, "Name and description are required");
    }

    const playlist = await Playlist.create({
        name,
        description,
        videos: [],
        owner: req.user._id,
    });

    const createdPlaylist = await Playlist.findById(playlist._id);

    if (!createdPlaylist) {
        throw new ApiError(500, "Something went wrong while creating playlist");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                createdPlaylist,
                "Playlist created successfully"
            )
        );
});

const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params;
    //TODO: get user playlists

    if (!userId?.trim()) {
        throw new ApiError(400, "user id is missing");
    }

    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Not a valid user id");
    }

    const userPlaylists = await Playlist.find({ owner: userId });

    if (!userPlaylists) {
        throw new ApiError(500, "No playlists found");
    }

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                userPlaylists,
                "Playlists fetched successfully"
            )
        );
});

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    //TODO: get playlist by id

    if (!playlistId?.trim()) {
        throw new ApiError(400, "Playlist id is missing");
    }

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Not a valid playlist id");
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, playlist, "Playlist found successfully"));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;

    if (!playlistId?.trim() || !videoId?.trim()) {
        throw new ApiError(400, "Playlist or Video id is missing");
    }

    if (!isValidObjectId(channelId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Not a valid playlistId id or video id");
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new ApiError(400, "Playlist not found");
    }

    playlist.videos = playlist.videos.push(videoId);
    await playlist.save({ validateBeforeSave: false });

    return res.status(200).json(200, playlist, "Video added successfully");
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, videoId } = req.params;
    // TODO: remove video from playlist

    if (!playlistId?.trim() || !videoId?.trim()) {
        throw new ApiError(400, "Playlist or Video id is missing");
    }

    if (!isValidObjectId(channelId) || !isValidObjectId(videoId)) {
        throw new ApiError(400, "Not a valid playlistId id or video id");
    }

    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new ApiError(400, "Playlist not found");
    }

    playlist.videos = playlist.videos.pull(videoId);
    await playlist.save({ validateBeforeSave: false });

    return res.status(200).json(200, playlist, "Video removed successfully");
});

const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    // TODO: delete playlist

    if (!playlistId?.trim()) {
        throw new ApiError(400, "Playlist id is missing");
    }

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Not a valid playlist id");
    }

    const deletedPlaylist = await Playlist.deleteOne({ _id: playlistId });

    console.log(deletedPlaylist);

    if (deletedPlaylist.deletedCount !== 1) {
        throw new ApiError(500, "Playlist not found");
    }

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Playlist deleted successfully"));
});

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const { name, description } = req.body;
    //TODO: update playlist

    if (!playlistId?.trim()) {
        throw new ApiError(400, "Playlist id is missing");
    }

    if (!isValidObjectId(playlistId)) {
        throw new ApiError(400, "Not a valid playlist id");
    }

    if (!name || !description) {
        throw new ApiError(400, "name or description is required");
    }

    const updatedPlaylist = await Playlist.findByIdAndUpdate(
        playlistId,
        {
            $set: { name, description },
        },
        { new: true }
    );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedPlaylist,
                "Playlist updated successfully"
            )
        );
});

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist,
};
