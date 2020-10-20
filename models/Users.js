const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const saltRounds = 10;
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
    name: {
        type: String,
        maxlength: 50,
    },
    email: {
        type: String,
        trim: true,
        unique: 1,
    },
    password: {
        type: String,
        maxlength: 50,
    },
    role: {
        type: Number,
        default: 0
    },
    image: String,
    token: {
        type: String,
    },
    tokenExp: {
        type: Number,
    }
});

// arrow function과 일반 function의 차이를 느낄 수 있는 상황
// https://poiemaweb.com/es6-arrow-function
userSchema.pre('save', function (next) {
    const user = this;
    // console.log({user});
    if(user.isModified("password")) {
        bcrypt.genSalt(saltRounds, (err, salt) => {
            if (err) return next(err);
    
            bcrypt.hash(user.password, salt, (err, hash) => {
                if (err) return next(err);
                user.password = hash;
                next();
            })
        })
    } else {
        next();
    }
});

userSchema.methods.comparePassword = function (plainPassword, cb) {
    // plainPassword 1234567 암호화된 비밀번호
    bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
        if (err) return cb(rrr);
        cb(null, isMatch);
    })
}

userSchema.methods.generationToken = function(cb) {
    // jsonwebtoken을 이용해서 토큰 생성하기
    const user = this;
    const token = jwt.sign(user.id, "secretToken");
    user.token = token;
    user.save(function(err, user){
        if(err) return cb(err);
        cb(null, user);
    })
}


const User = mongoose.model('User', userSchema);

module.exports = { User };