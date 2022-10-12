//const fs=require('fs');
const User=require(".//..///models////userModel");
const AppError=require(".//..//utils///AppError");
const catchAsync=require("..///utils///catchAsync");
const factory=require("./handlerFactory");


const filterObj=(obj, ...allowedFields)=>{
    const newObj={};
    Object.keys(obj).forEach(el=>{
        if(allowedFields.includes(el)) 
        newObj[el]=obj[el];
    })
    return newObj;
}

exports.getAllUsers=factory.getAll(User);
// catchAsync(async(req,res,next)=>{
//     const user=await User.find();
//     res.status(200).json({
//         status:"success",
//         requestedAt:req.time,
//         results: user.length,
//         data: {
//             user
//         }
//     })
// });
exports.updateMe=catchAsync(async(req,res,next)=>{
    // 1> error if user tries to update password in this route
    if(req.body.password||req.body.passwordConfirm){
        return next(new AppError("This route is not for password updates",400));
    }
    // 2> filtered out unwanted field names that are not allowed to be updated  
    const flteredBody=filterObj(req.body,'name','email');
    // 3> update user document
    const updatedUser=await User.findByIdAndUpdate(req.user.id,flteredBody,{
        new:true,
        runValidators:true
    });
    res.status(200).json({
        status:"success",
        data:{
            user:updatedUser
        }
    })
});
exports.deleteMe=catchAsync(async(req,res,next)=>{
    await User.findByIdAndUpdate(req.user.id,{active:false});
    res.status(204).json({
        status:"success",
        data:null
    })
}
);

exports.createUser=(req,res)=>{
    res.status(500).json({
        status:"error",
        message:"Please use signup instead of this route"
    })
};
exports.getUser=factory.getOne(User);
// (req,res)=>{
//     res.status(500).json({
//         status:"error",
//         message:"This route is not yet defined"
//     })
// };
exports.updateUser=factory.updateOne(User);
//(req,res)=>{
//     res.status(500).json({
//         status:"error",
//         message:"This route is not yet defined"
//     })
// };
exports.deleteUser= factory.deleteOne(User);
// (req,res)=>{
//     res.status(500).json({
//         status:"error",
//         message:"This route is not yet defined"
//     })
// };
