const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const saltRounds = 10;
var jwt = require('jsonwebtoken');
const nodemailer = require("nodemailer");

// mongoose.connect(process.env.dbURI)
// .then(()=>{
//     console.log("DB connected");
// })
// .catch((err)=>{
//     console.log("Error occured in DB: \n", err);
// })

const userSchema = new mongoose.Schema({
    name: String,
    student_roll: String,
    phone: String,
    email: String,
    room_number: String,
    building: String,
    password: String 
});
const User = mongoose.model("User", userSchema);

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(express.json());

app.get("/",(req,res)=>{
    res.status(200).send({message: "handbook"})
})
app.post("/register",async (req, res)=>{
    const {
        name,
        student_roll,
        phone,
        email,
        room_number,
        building,
        password,
    } = req.body;
    User.findOne({email}, (err, userFound)=>{
        if(err){
            console.log(err);
            res.status(400).send({message: "DB Error"})
        }
        if(userFound) res.status(409).send({message: "User already exist with this email. Please try with another email"})
        else{
            const newUser = new User({
                name,
                student_roll,
                phone,
                email,
                room_number,
                building,
                password,
            });
            bcryptjs.hash(req.body.password, saltRounds, function(err, hash) {
                if(err){
                    console.log("bcryptjs error: ", err);
                    res.status(400).send({message: "Please try again later"});
                }
                newUser.password=hash;
                newUser.save((err, savedUser)=>{
                    if(err){
                        console.log("save to db error: ", err);
                    }
                    // console.log(savedUser);
                    // console.log(`${savedUser._id}`);
                    var token = jwt.sign({ authkey: `${savedUser._id}` }, process.env.JWTkey);
                    res.status(200).send({
                        token: token,
                        User: savedUser,
                    });
                });
            });
        }
        
    });
})
app.post("/login", (req, res)=>{
    if(req.body.email){
        User.findOne({email: req.body.email}, (err, userFound)=>{
            if(err){
                console.log(err);
                res.status((400).send({message: "Please try again later"}))
            }
            if(userFound){
                var token = jwt.sign({ authkey: `${userFound._id}` }, process.env.JWTkey);
                // console.log("authotoken: ", token);
                bcryptjs.compare(req.body.password, userFound.password, (bcrptErr, matched)=>{
                    if(bcrptErr) {
                        console.log(bcrptErr);
                        res.status(404).send({message: "Username or Password incorrect"});
                    }
                    if(matched){
                        res.status(200).send({
                            token: token,
                            User: userFound,
                        });
                    }
                })
            }
            else{
                res.status(404).send({message: "Username or Password incorrect"});
            }
        })
    }
    else{
        User.findOne({phone: req.body.phone}, (err, userFound)=>{
            if(err){
                console.log(err);
                res.status((400).send({message: "Please try again later"}))
            }
            if(userFound){
                var token = jwt.sign({ authkey: `${userFound._id}` }, process.env.JWTkey);
                // console.log("authotoken: ", token);
                bcryptjs.compare(req.body.password, userFound.password, (bcrptErr, matched)=>{
                    if(bcrptErr) {
                        console.log(bcrptErr);
                        res.status(404).send({message: "Username or Password incorrect"});
                    }
                    if(matched){
                        res.status(200).send({
                            token: token,
                            User: userFound,
                        });
                    }
                })
            }
            else{
                res.status(404).send({message: "Username or Password incorrect"});
            }
        })
    }
})
const bookSchema = new mongoose.Schema({
    book: {
        name: String,
        author: String,
        publication: String,
        imageLink: String,
        price: String,
    },
    user: {
        _id: String,
        name: String,
        student_roll: String,
        phone: String,
        email: String,
        room_number: String,
        building: String,
    }
})
const Book = mongoose.model("Book", bookSchema);
app.post("/book-add", (req, res)=>{
    const token = req.headers.authtoken;
    // console.log(token);
    jwt.verify(token, process.env.JWTkey, (err, decoded)=>{
        // console.log("verifying");decoded.authkey
        if(err){
            // console.log("err occured");
            if(err.message=='invalid token') res.status(404).send({message: "Authentication failed"})
            console.log(err);
            res.status(404).send({message: "Authentication failed"})
        }
        else{
            // console.log("no error");
            // console.log("decoded key: ", decoded.authkey);
            User.findById( decoded.authkey , (err, userFound)=>{
                if(err){
                    console.log(err);
                }
                if(userFound){
                    // console.log("userfound: ", userFound);
                    const newBook= new Book({
                        book: req.body.book,
                        user: req.body.user,
                    })
                    // console.log("new Book", newBook);
                    newBook.save((err, addedBook)=>{
                        if(err){
                            console.log(err);
                            res.status(400).send({message: "Please try again later"})
                        }
                        if(addedBook){
                            // console.log("Book added ",addedBook);
                            res.status(200).send({message: "book added", addedBook})
                        }
                    })
                }
                else{
                    res.status(401).send({message: "Authentication failed"})
                }
            })
        }
    })


    
})
app.get("/home", (req, res)=>{
    Book.find({}, (err, booksFound)=>{
        if(err){
            console.log(err);
            res.send({message: "error in fetching items"})
        }
        if(booksFound){
            res.status(200).send(booksFound);
        }
        else{
            res.status(200).send({message: "No item available for sell"})
        }
    })
})
app.post("/buy",(req, res)=>{
    const{ buyer, seller, book, time, date } = req.body;
    console.log(req.body);
    console.log(process.env.USER);
    console.log(process.env.PASS);
    
    let mailOptions = {
        from: `"handbook 📚" <${process.env.USER}>`,
        to: `${seller.email}`,
        subject: `${buyer.name} is interested to buy your book "${book.name}"`,
        html: `Hii ${seller.name}. <br> It seems ${buyer.name} is interested to buy your book <i>${book.name}<i>
        which you posted recetly on <b>Bookshala</b> <br> ${buyer.name}(${buyer.phone}) can be contacted on ${date} at ${time}.`,
    };

    transporter.sendMail(mailOptions, function (err, info) {
        if (err) {
            console.log(err);
            res.send({message: "Please try again later"});
        } else {
            console.log(info);
            res.status(200).send({message: "Seller will contact you soon"});
        }
    });
    
})
let transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
});

app.post("/book-delete", (req, res)=>{
    const bookID = req.query.book_id;
    try{
        Book.findByIdAndDelete( bookID, (err, bookDeleted)=>{
            if(err){
                console.log(err);
                res.status(400).send({message: "Please try again later"});
            }
            if(bookDeleted){
                console.log(bookDeleted);
                res.status(200).send({message: `'${bookDeleted.book.name}' deleted`});
            }
            else{
                res.send({message: "No book found to delete"})
            }
        })
    }catch(err){
        console.log(err);
        res.send({message: "Please try again later"})
    }
})
const port = process.env.PORT || 5000
app.listen(port, ()=>{
    console.log(`Server Listening on PORT ${port}`);
})