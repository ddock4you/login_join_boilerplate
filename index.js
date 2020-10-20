const express = require("express");
const app = express();
const port = 5000;
const config = require("./config/key");
const cookieParser = require("cookie-parser");

const { User } = require("./models/Users")

// application/x-www-form-urlencoded 데이터를 가져와서 분석
app.use(express.urlencoded({ extended : false }));

app.use(express.json());
app.use(cookieParser());

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
    // console.log(req.body);
    const user = new User(req.body);
    
    user.save((err, doc) => {
        if(err) return res.json({ success: false, err});
        return res.status(200).json({
            success: true
        });
    });
});

app.post("/login", (req, res) => {
    // 요청된 이메일을 데이터베이스에서 찾는다.
    User.findOne({ email: req.body.email}, (err, user) => {
        if (!user) {
            return res.json({
                login: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다."
            });
        }
        
        // 요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는지 체크
        user.comparePassword(req.body.password, (err, isMatch) => {
            if(!isMatch) return res.json({ loginSuccess: false, message: "비밀번호가 틀렸습니다."})
        })
        
        // 비밀번호까지 맞다면 토큰을 새성하기.
        user.generateToken((err, user) => {
            if(err) return res.status(400).send(err);

            res.cookie("x_auth", user.token).status(200).json({ loginSuccess: true, userId: user._id });            
        });

    });
    

});

app.listen(port, () => console.log(`server on port ${port}`));


// git test3