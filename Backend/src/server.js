
require("dotenv").config({ path: "./src/.env" });

const app = require("./app");
const connectToDB = require("./config/database");

const startServer = async () => {
    try {
        await connectToDB();

        app.listen(3000, () => {
            console.log("Server is running on port 3000");
        });
    } catch (err) {
        console.log(err);
    }
};

startServer();