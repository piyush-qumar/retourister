const express=require("express");
const path=require("path");
const bodyParser=require("body-parser");
const rateLimit=require("express-rate-limit");
const morgan=require("morgan");
const helmet=require("helmet");
const app=express();
const tourRouter=require("./routes/tourRoutes");
const userRouter=require("./routes/userRoutes");
const reviewRouter=require("./routes/reviewRoutes");
const AppError=require("./utils/AppError")
const errorHandler=require(".//controllers//errorController");
const mongoSanitize=require("express-mongo-sanitize");
const xss=require("xss-clean"); 
const hpp=require("hpp");
app.set('view engine','pug');
app.set('views',path.join(__dirname,'views'));
 // serving static files
 app.use(express.static(path.join(__dirname,'public')));
// 1) GLOBAL MIDDLEWARES
// Set security HTTP headers
const limiter=rateLimit({
    max:100,
    windowMs:60*60*1000,
    message:"Too many requests from this IP,please try again in an hour"
});
app.use("/api",limiter);
app.use(helmet());

//middlewares
app.use(express.json());
// data saniize using ,ongosantize(for ex {"$gt":""}) and xss(for ex <script>alert("hello")</script>)
app.use(mongoSanitize());
// data sanitize against xss
app.use(xss())
// prevent parameter pollution
app.use(hpp({
    whitelist:[
        "duration",
        "ratingsQuantity",
        "ratingsAverage",
        "maxGroupSize",
        "difficulty",
        "price"
    ]
}))

if(process.env.NODE_ENV==='development'){  // development login
app.use(morgan('dev'));}
//console.log(app.get('env'));
//console.log(process.env);

app.use((req,res,next)=>{
    console.log("Request received");
    //console.log(req.headers);// its task is to dispaly the headers of the request
    next();
}) ;
app.use((req,res,next)=>{
    req.time=new Date().toString();
    //console.log(req.headers);// this is to check the headers
    next();
})


// app.get("/api/tours",getAllTours);
// app.get("/api/tours/:id",getTour);
// app.post("/api/tours",createTour);
// app.patch("/api/tours/:id",updateTour);
// app.delete("/api/tours/:id",deleteTour);
app.use("/api/tours",tourRouter);
app.use("/api/users",userRouter);
app.use("/api/reviews",reviewRouter);
app.all("*",(req,res,next)=>{
    next(new AppError(`Invalid endpoint`));
    // const err=new Error(`Invalid endpoint`);
    // err.status='fail';
    // err.statusCode=404;
    // next(err);

});
// app.use((err,req,res,next)=>{
//     console.log(err.stack);
//     err.statusCode=err.statusCode||500;
//     err.status=err.status||'error';
//     res.status(err.statusCode).json({
//         status:err.status,
//         message:err.message
//     });
// })
app.use(errorHandler);
module.exports=app;