const fs=require('fs');
const dotenv=require('dotenv');
const mongoose=require('mongoose');
dotenv.config({path:'./config.env'});
//console.log(process.env);
//const app=require("./app")
const Tour=require("../..//models//tourModel");
//const User=require("../..//models//userModel");
const DB=process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD);
mongoose.connect(process.env.DATABASE_LOCAL, {
    useNewUrlParser:true,   //to avoid deprecation warning
}).then(()=>console.log(`DB is connected`)).catch(err=>console.log(err));
const tours= JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`,'utf-8'));
//const users= JSON.parse(fs.readFileSync(`${__dirname}/users.json`,'utf-8'));
//send all data to the db
const bringData=async()=>{
    try
    {
        await Tour.create(tours);
        console.log('DATA LOADED SUCCESSFULLY');
        
    }catch(err)
    {
        console.log(err);
    }process.exit();
};
//delete all data from the database
const deleteAll=async()=>{
    try
    {
        await Tour.deleteMany();
        console.log('DATA DELETED SUCCESSFULLY');
        
    }catch(err)
    {
        console.log(err);
    }process.exit();
}
if(process.argv[2]==='--import')
{
    bringData();
}
else if(process.argv[2]==='--delete')
{
    deleteAll();
}
console.log(process.argv);