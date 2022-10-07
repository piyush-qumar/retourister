const mongoose=require('mongoose');
const crypto=require('crypto');
const validator=require('validator');
const bcrypt=require('bcryptjs');
const userSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'A user must have a name'],
        unique:true,
        trim:true,
        maxlength:[40,'A user name must have less or equal than 40 characters'],
        //minlength:[10,'A user name must have more or equal than 10 characters']
    },
    email:{
        type:String,
        required:[true,'A user must have an email'],
        unique:true,
        lowercase:true,
        validate:[validator.isEmail,'Please provide a valid email']
    },
    photo:String,
    role:{
        //required:[true,'A user must have a role'],
        type:String,
        //trim:true,
        enum:['user','guide','lead-guide','admin'],
        default:'user'
    },
    password:{
        type:String,
        required:[true,'A user must have a password'],
        minlength:[5,'A user password must have more or equal than 5 characters'],
        select:false
    },
    passwordConfirm:{
        type:String,
        required:[true,'A user must have a password confirmation'],
        validate:{
            validator:function(el){
                return el===this.password;
            },
            message:'Passwords are not the same'
        }
    },
    passwordChangedAt:Date,
    passwordResetToken:String,
    passwordResetExpires:Date,
    active:{
        type:Boolean,
        default:true,
        select:false
    }
});
userSchema.pre('save',async function(next){
    //Only run this function if password was actually modified
    if(!this.isModified('password')) return next();
    //Hash the password with cost of 12
    this.password=await bcrypt.hash(this.password,12);
    //Delete passwordConfirm field
    //this.passwordConfirm=undefined;
    next();
});
 
userSchema.methods.correctPassword=async function(candidatePassword,userPassword){
    return await bcrypt.compare(candidatePassword,userPassword);
};
userSchema.methods.changedPasswordAfter=function(JWTTimestamp){
    if(this.passwordChangedAt){
        const changedTimestamp=parseInt(this.passwordChangedAt.getTime()/1000,10);
        //console.log(this.changedTiemstamp,JWTTimestamp);
        return JWTTimestamp<changedTimestamp;
    }
    return false;
}
userSchema.methods.createPasswordResetToken=function(){
    const resetToken=crypto.randomBytes(32).toString('hex');
    this.passwordResetToken=crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires=Date.now()+10*60*1000;
    console.log({resetToken},this.passwordResetToken);
    return resetToken;
}
const User=mongoose.model('User',userSchema);   
module.exports=User;
