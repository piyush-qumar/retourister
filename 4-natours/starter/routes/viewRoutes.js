const express=require('express');
const router=express.Router();

app.get('/',(req,res)=>{
    res.status(200).render("base",{
        tour:"The Forest Hiker",
        user:"Piyush"
    });
})
app.get('/overview',(req,res)=>{
    res.status(200).render('overview',{
        title:"All Tours"
    });
})
app.get('/tour',(req,res)=>{
    res.status(200).render('tour',{
        title:"The Forest Hiker"
    });
}
)
module.exports=router;