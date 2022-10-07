const dotenv=require('dotenv');
const mongoose=require('mongoose');
dotenv.config({path:'./config.env'});
//console.log(process.env);
const app=require("./app")
const DB=process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD);
//process.env.DATABASE_LOCAL
mongoose.connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser:true,  
    //useCreateIndex: true,
    useUnifiedTopology: true, //to avoid deprecation warning
}).then(()=>console.log(`DB is connected`));//.catch(err=>console.log(err));

// const testTour=new Tour({
//     name:'jharkhand',
//     price:100,
//     rating:4.5
// });
// testTour.save().then(doc=>{
//     console.log(doc);
// }).catch(err=>{
//     console.log(err);
// }
// );


const server=app.listen(3000,()=>{
    console.log("Server started at 3000");
});
//ted
process.on('unhandledRejection',err=>{
    console.log(err.name,err.message);
    console.log('UNHANDLED REJECTION! shutting down...');
    server.close(()=>{
        process.exit(1);
    }
    );
})