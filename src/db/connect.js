const mongoose = require("mongoose");
const { app } = require("../app");

const DB = process.env.MONGO_URI;

mongoose
    .connect(DB)
    .then(() => {
        console.log(`Connection Successful`);
        app.listen(process.env.PORT || 3000, () =>
            console.log(`Server is running on port 3000`)
        );
    })
    .catch((err) => console.log(`No Connection`));
