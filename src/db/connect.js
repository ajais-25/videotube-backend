const mongoose = require("mongoose");

const DB = process.env.MONGO_URI;

mongoose
    .connect(DB)
    .then(() => {
        console.log(`Connection Successful`);
    })
    .catch((err) => console.log(`No Connection`));
