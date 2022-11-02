const AppError=require('.//..///utils////AppError');


const handleCastErrorDB=err=>{
    const message=`Invalid ${err.path}:${err.value}`;
    return new AppError(message,400);
}

const handleDuplicateFieldsDB=err=>{
    const value=err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
    const message=`Duplicate field value:${value}.Please use another value`;
    return new AppError(message,400);
}

const handleValidationErrorDB=err=>{
    const errors=Object.values(err.errors).map(el=>el.message);
    const message=`Invalid input data.${errors.join(". ")}`;
    return new AppError(message,400);
}
const handleJWTError=()=>new AppError('Invalid token.Please login again',401);

const TokenExpiredError=()=>new AppError('Token expired',401);

const senderrorDev=(err,req,res)=>{
    //api
    if(req.originalUrl.startsWith('/api')){
    res.status(err.statusCode).json({
        status:err.status,
        error:err,
        message:err.message,
        stack:err.stack
    });
}else{
    //rendered website
    res.status(err.statusCode).render('error',{
        title:'Something went wrong',
        msg:err.message
    });
}
}
const senderrorProd=(err,req,res)=>
{
    //api
    if(req.originalUrl.startsWith('/api'))
    {
        if(err.isOperational)
        {
            return res.status(err.statusCode).json({
            status:err.status,
            message:err.message,
            });
        }
        console.log('ERROR',err);
        res.status(500).json({
            status:'error',
            message:'Something went wrong'
        });

    }
    //rendered website
    if(err.isOperational)
    {
        res.status(err.statusCode).render('error',
        {
            title:'Something went wrong',
            msg:err.message
        });
    }
    console.log('ERROR',err);
    return res.status(err.statusCode).render('error',
    {
        title:'Something went wrong',
        msg:'Please try again later'
    });
}


module.exports=(err,req,res,next)=>{
    //console.log(err.stack);
    err.statusCode=err.statusCode||500;
    err.status=err.status||'error';
    if(process.env.NODE_ENV==='development')
    {
        let error={ ...err };
        error.message=err.message;
        if(error.name==='CastError') error=handleCastErrorDB(error);
        if(error.code===11000) error=handleDuplicateFieldsDB(error);
        if(error.name==='ValidationError') error=handleValidationErrorDB(error);
        if(error.name==='JsonWebTokenError') error= handleJWTError() 
        if(error.name==='TokenExpiredError') error= TokenExpiredError();
        senderrorDev(err,req,res);
    }
    else if(process.env.NODE_ENV==='production')
    {
        //senderrorProd(err,res);
        let error={...err};
        error.message=err.message;
        if(error.name==='CastError') error=handleCastErrorDB(error);
        if(error.code===11000) error=handleDuplicateFieldsDB(error);
        if(error.name==='ValidationError') error=handleValidationErrorDB(error);
        if(error.name==='JsonWebTokenError') error= handleJWTError(error);
        //if(error.name==='TokenExpiredError') error=new AppError('Token expired',401);
       
        senderrorProd(error,req,res);
    }
    
};