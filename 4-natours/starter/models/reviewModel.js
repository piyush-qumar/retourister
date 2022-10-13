// {
//     "name":"test tour",
//     "duration":5,
//     "maxGroupSize":25,
//     "difficulty":"easy",
//     "ratingsAverage":4.7,
//     "ratingsQuantity":37,
//     "price":497,
//     "summary":"test tour",
//     "description":"test tour",
//     "imageCover":"tour-1-cover.jpg",
//     "images":["tour-1-1.jpg","tour-1-2.jpg","tour-1-3.jpg"],
//     "startDates":["2021-03-01","2021-04-01"]
// }
const mongoose=require('mongoose');
//const User=require(".//userModel");
const Tour=require(".//tourModel");
const reviewSchema=new mongoose.Schema({
    review:{
        type:String,
        required:[true,'Review can not be empty']
    },
    rating:{
        type:Number,
        min:1,
        max:5
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    tour:{
        type:mongoose.Schema.ObjectId,
        ref:'Tour',
        required:[true,'Review must belong to a tour']
    },
    user:{
        type:mongoose.Schema.ObjectId,
        ref:'User',
        required:[true,'Review must belong to a user']
    }
},
{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});
reviewSchema.index({tour:1,user:1},{unique:true});
reviewSchema.pre(/^find/,function(next){
    this.populate({
        path:'user',
        select:'name photo'
     })//.populate({
    //     path:'tour',
    //     select:'name'
    // });
    next();
}
);
reviewSchema.statics.calcAverageRatings=async function(tourId){
    const stats=await this.aggregate([
        {
            $match:{tour:tourId}
        },
        {
            $group:{
                _id:'$tour',
                nRating:{$sum:1},
                avgRating:{$avg:'$rating'}
            }
        }
    ]);console.log(stats);
    if(stats.length>0){
        await Tour.findByIdAndUpdate(tourId,{
            ratingsQuantity:stats[0].nRating,
            ratingsAverage:stats[0].avgRating
        });
    }else{
        await Tour.findByIdAndUpdate(tourId,{
            ratingsQuantity:0,
            ratingsAverage:4.5
        });
    }
 }
///////////////////////////////////////////////////
reviewSchema.post('save',function(){                //post middleware dos not get access to next
    this.constructor.calcAverageRatings(this.tour);
    //next();
}
);
////////////////////////////////////////////
reviewSchema.pre(/^findOneAnd/,async function(next){
    this.r=await this.findOne();
    next();
}
);
/////////////////////////////////////////////////
reviewSchema.post(/^findOneAnd/,async function(){
    await this.r.constructor.calcAverageRatings(this.r.tour); //await this.findOne() does not work here, query has already executed
}
);
const Review=mongoose.model('Review',reviewSchema);
module.exports=Review;
