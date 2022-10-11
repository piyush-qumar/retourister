const mongoose=require('mongoose');
const slugify=require('slugify');
const validator=require('validator');
// const User=require(".//userModel");
const tourSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true,'Name is required'],
        unique:true,
        trim:true,
        maxlength:[50,'Name must be less than 50 characters'],
        minlength:[10,'Name must be atleast 10 characters'],
        //validate:[validator.isAlpha,'Name must contain only characters']
        // validate(value){
        //     if(value.includes('123')){
        //         throw new Error('Name cannot contain 123');
        //     }
        // }


    },
    slug:{
        type:String,
    },
    duration:{
        type:Number,
        //required:[true,'A tour must have a duration']
    },
    maxGroupSize:{
        type:Number,
        //required:[true,'A tour must have a group size']

    },
    difficulty:{
        type:String,
        required:[true,'A tour must have a difficulty'],
        enum:['easy','medium','difficult']


    },
    price:{
        type:Number,
        //required:[true,'Price is required'],

    },
    ratingsAverage:{
        type:Number,
        default:4.5,
        min:0,
        max:5,
        set:val=>Math.round(val*10)/10

    },
    ratingsQuantity:{
        type:Number,
        default:0
    },
    priceDiscount:{
        type:Number,
        validate:{
            validator:function(val){
                return val<this.price;
            },
            message:'Discount price ({VALUE}) should be below the regular price'
        }
    },
    summary:{
            type:String,
            trim:true,
            //maxlength:[20,'Discount must be less than 20 characters'],
            //required:[true,'Summary is required']
        },
    description:{
        type:String,
        trim:true,
        //required:[true,'Description is required']
    },
    imageCover:{
        type:String,
        //required:[true,'Image is required']
    },
    images:[String],
    createdAt:{
        type:Date,
        default:Date.now(),
        select:false
    },
    startDates:[Date],
    secretTour:{
    type:Boolean,
    default:false
    },
    startLocation:{
        //GeoJSON
        type:{
            type:String,
            default:'Point',
            enum:['Point']
        },
        coordinates:[Number],
        address:String,
        description:String
},
    locations:[
        {
            type:{
                type:String,
                default:'Point',
                enum:['Point']
            },
            coordinates:[Number],
            address:String,
            description:String,
            day:Number
        }
    ],
    guides:[
        {
            type:mongoose.Schema.ObjectId,
            ref:'User'
        }
    ]
    },
    
{
    toJSON:{virtuals:true},                           //importants
    toObject:{virtuals:true}

});
tourSchema.virtual('durarionWeeks').get(function(){
    return this.duration/7;
});
tourSchema.pre('save',function(next){
    this.slug=slugify(this.name,{lower:true});
    next();
});
// tourSchema.pre('save',async function(next){
//     const guidesPromises=this.guides.map(async id=>await User.findById(id));
//     this.guides=await Promise.all(guidesPromises);
//     next();
// })
tourSchema.pre(/^find/,function(next){
    this.find({secretTour:{$ne:true}});
    this.start=Date.now();
    next();
});
// tourSchema.pre(/^find/,function(next){  // this query middleware will remove -v and passwordchanged at from the output
//     this.populate({
//         path:'guides',
//         select:'-__v -passwordChangedAt'
//     });
//     next();
// })
tourSchema.post(/^find/,function(docs,next){
    console.log(`query took ${Date.now()-this.start} milliseconds`);
    //console.log(docs);
    next();
})
tourSchema.pre('aggregate',function(next){
    this.pipeline().unshift({$match:{secretTour:{$ne:true}}});
    console.log(this.pipeline());
    next();
})
//tourSchema.pre(/^find/,function(next){

//})
// tourSchema.pre('save',function(next){
//     console.log('Will save document');
//     next();
// }).post('save',function(doc,next){
//     console.log('Document has been saved');
//     console.log(doc);
//     next();
// });
const Tour=mongoose.model('Tour',tourSchema);
// const testTour=new Tour({
//     name:'jharkhan',
//     price:100,
//     rating:4.5
// });
// testTour.save().then(doc=>{
//     console.log(doc);
// })
// .catch(err=>{
//     console.log(err);
// });
module.exports=Tour;