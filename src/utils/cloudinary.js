import { v2 as cloudinary } from "cloudinary";
// const fs = require("fs");
import fs from "fs";

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
    try {
        if (!localFilePath) return null;

        // upload file on cloudinary
        const res = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto",
        });
        // file uploaded successfully
        console.log("File uploaded successfully", res.url);
        return res;
    } catch (error) {
        fs.unlinkSync(localFilePath); // remove the localy saved temporary file
        return null;
    }
};

export { uploadOnCloudinary };
