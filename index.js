const express = require("express");
const app = express();
const port = 5000;

const mongoose = require("mongoose");
mongoose
    .connect(
        "mongodb+srv://ddock4you:tmdgus123!@cluster0.wlayg.mongodb.net/boilerplate?retryWrites=true&w=majority",
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
        }
    )
    .then(() => console.log("MongoDB Conencted"))
    .catch((err) => console.log(err));

app.get("/", (req, res) => res.send("하이염"));

app.listen(port, () => console.log(`server on port ${port}`));
