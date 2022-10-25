exports.getOverview=(req,res)=>{
    res.status(200).render('overview',{
        title:"All Tours"
    });
}
exports.getTour=(req,res)=>{
    res.status(200).render('tour',{
        title:"The Forest Hiker"
    });
}
exports.getLoginForm=(req,res)=>{
    res.status(200).render('login',{
        title:"Log into your account"
    });
}
exports.getAccount=(req,res)=>{
    res.status(200).render('account',{
        title:"Your account"
    });
}
exports.getMyTours=(req,res)=>{
    res.status(200).render('overview',{
        title:"My Tours"
    });
}
