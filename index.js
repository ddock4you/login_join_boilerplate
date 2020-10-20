const express = require("express");
const app = express();
const port = 5000;
const config = require("./config/key");

const { User } = require("./models/Users")

// application/x-www-form-urlencoded 데이터를 가져와서 분석
app.use(express.urlencoded({ extended : false }));

app.use(express.json());

const mongoose = require("mongoose");
mongoose
    .connect(
        config.mongoURI,
        {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true,
            useFindAndModify: false,
        }
    )
    .then(() => console.log("MongoDB Conencted"))
    .catch((err) => console.log(err));

app.get("/", (req, res) => res.send("하이염!"));
app.post("/register", (req, res) => {
    // 회원 가입할 때 필요한 정보들을 client에서 가져오면 그것들을 데이터베이스에 넣어준다.
    console.log(req.body);
    const user = new User(req.body);
    
    user.save((err, doc) => {
        if(err) return res.json({ success: false, err});
        return res.status(200).json({
            success: true
        });
    });
});


app.listen(port, () => console.log(`server on port ${port}`));
