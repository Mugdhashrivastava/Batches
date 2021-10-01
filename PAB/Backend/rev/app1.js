// npm init -y
// npm i express
const express = require("express");
const fs = require("fs");
const path = require("path");
const jwt = require('jsonwebtoken');
const { JWT_SECRET } = require("./secrets");
const cookieParser = require('cookie-parser');
let userModel = require("./model/userModel");
// Server: // route  -> request -> response/file 
// File system// path -> interact/type -> file /folder
// server init
const app = express();
// this line 
// post -> /
// app.post("/", function (req, res, next) {
//     let body = req.body;
//     console.log("before", body);
//     next();
// })
// inbuilt menthods of express has next already implmeneted
// always use me
//  express json -> req.body add
// reserve a folder only from which client can acces the files 
app.use(express.static("Frontend_folder"));
app.use(express.json());
app.use(cookieParser());

// // function -> route  path
// // frontend -> req -> /
// read data storage
// localhost/user/10 -> post 
let content = JSON.parse(fs.readFileSync("./data.json"));
const userRouter = express.Router();
const authRouter = express.Router();
// // localhost / auth / 10-> patch
app.use('/api/user', userRouter);
app.use('/api/auth', authRouter);

userRouter
    .route('/')
    // localhost/user -> get
    .get(protectRoute, getUsers)
//     localhost/user -> post
//     .post(bodyChecker, isAuthenticated, isAuthorized, createUser);
// userRouter
//     .route("/:id")
//     // localhost/user/10-> post
//     .get(getUser)

authRouter.route("/signup")
    .post(bodyChecker, signupUser);

authRouter.route("/login")
    .post(bodyChecker, loginUser);
function getUsers(req, res) {
    res.status(200).json({
        "message": content
    })
}
function protectRoute(req, res, next) {
    try {
        console.log("reached body checker");
        // cookie-parser
        console.log("61", req.cookies)
        // jwt 
        // -> verify everytime that if 
        // you are bringing the token to get your response
        let decryptedToken = jwt.verify(req.cookies.JWT, JWT_SECRET);
        // console.log("66", decryptedToken)
        console.log("68", decryptedToken)
        if (decryptedToken) {
            next();
        } else {
            res.send("kindly login to access this resource ");
        }
    } catch (err) {

        res.status(200).json({
            message: err.message
        })
    }

}
function bodyChecker(req, res, next) {
    console.log("reached body checker");
    let isPresent = Object.keys(req.body).length;
    console.log("ispresent", isPresent)
    if (isPresent) {
        next();
    } else {
        res.send("kind send details in body ");
    }
}
async function signupUser(req, res) {
    try {
        let newUser = await userModel.create(req.body);
        res.status(200).json({
            "message": "user created successfully",
            user: newUser
        })
    } catch (err) {
        console.error(err);
        res.status(500).json({
            message: err.message
        })
    }
}

function loginUser(req, res) {
    let { email, password } = req.body;
    let obj = content.find((obj) => {
        return obj.email == email
    })
    if (!obj) {
        return res.status(404).json({
            message: "User not found"
        })
    }
    if (obj.password == password) {
        var token = jwt.sign({ email: obj.email },
            JWT_SECRET);
        // header
        console.log(token);
        res.cookie("JWT", token);
        // sign with RSA SHA256
        // res body 
        res.status(200).json({
            message: "user logged In",
            user: obj
        })
    } else {
        res.status(422).json({
            message: "password doesn't match"
        })
    }
}
// authRouter.route("/:id").patch(forgetPassword)
// function createUser(req, res) {
//     console.log("create users");
//     let body = req.body;
//     console.log("req.body", req.body);
//     content.push(body);
//     // put data storage 
//     fs.writeFileSync("./data.json", JSON.stringify(content));
//     res.json({ message: content });
// }
// function getUsers(req, res) {
//     res.json({ message: content });
// }
app.listen(8081, function () {
    console.log("server started");
})
app.post("/", function (req, res, next) {
    let body = req.body;
    console.log("inside first post", body);
    next();
})
app.use(function (req, res, next) {
    console.log("inside app.use",)
    next();
})
app.get("/", function (req, res) {
    let body = req.body;
    console.log("inside first get", body);

})
app.post("/", function (req, res, next) {
    let body = req.body;
    console.log("inside second post ", body);
    res.send("tested next");
})
app.use(function (req, res) {
    // console.log("fullPath", fullPath);
    res.status(404).sendFile
        (path.join(__dirname, "404.html"));
})
// app.get("/", function (req, res) {
//     console.log("hello from home page")
//     // res.send("<h1>Hello from Backend</h1>");
//     res.status(200).json(
//         { message: content }
//     )
// })
// app.put("/", function (req, res) {
//     console.log("hello from home page")
//     res.send("<h1>Hello from Backend</h1>");
// })
// app.update("/", function (req, res) {
//     console.log("hello from home page")
//     res.send("<h1>Hello from Backend</h1>");
// })
// app.delete("/", function (req, res) {
//     console.log("hello from home page")
//     res.send("<h1>Hello from Backend</h1>");
// })
// app.get("/user", function (req, res) {
//     console.log("users")
//     // for sending key value pair
//     res.json(obj);
// })
// //localhost:8080 ??
    // / port, ip,localhost