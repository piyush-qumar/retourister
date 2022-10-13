//const Tour=require("..//models//tourModel");
const Tour=require(".//..//models//tourModel");
const APIFeatures=require("..//utils///apiFeatures");
const catchAsync=require("..///utils///catchAsync");
const AppError=require("..///utils////AppError");
const factory=require("./handlerFactory");


exports.aliass=(req,res,next)=>{
    req.query.sort='price';
    req.query.fields='name,price,ratingsAverage,summary,difficulty';
    req.query.limit='5';
    next();
};

exports.getAllTours=catchAsync(async(req,res,next)=>{
    
   
       // console.log(req.query);
   
    const features=new APIFeatures(Tour.find(),req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate(); 
    const x=await features.query;
    res.status(200).json({
        status:"success",
        requestedAt:req.time,
        results: x.length,
        data: {
            x
        }
    })
})
exports.getTour=factory.getOne(Tour,{path:'reviews'});  //"select only name and photo" can also be used
// catchAsync(async(req,res,next)=>{                    //for ex:  select:'name photo'
// const x=await Tour.findById(req.params.id).populate({       
//             path:'guides reviews',                              // guides and select can be removed
//             select:'-__v -passwordChangedAt'
//         });
//         if(!x)
//         {
//             return next(new AppError('No tour found with that ID',404));
//         }
//         res.status(200).json({
//             status:"success",
//             requestedAt:req.time,
//             data: {
//                 x
//             }
//         })
// })

exports.createTour=factory.createOne(Tour);
// catchAsync(async(req,res,next)=>{
//     const newTour=await Tour.create(req.body);
//     res.status(201).json({
//         status:"success",
//         data:{
//             tour:newTour,
//         }
//     });
//     try{
       
// }catch(err){
//     res.status(400).json({
//         status:"fail",
//         message:err,
//     });
// 
//});
    
exports.updateTour= factory.updateOne(Tour);
// catchAsync(async(req,res,next)=>{
  
//         const x=await Tour.findByIdAndUpdate(req.params.id,req.body,{
//             new:true,
//             runValidators:true
//         });
//         if(!x)
//         {
//             return next(new AppError('No tour found with that ID',404));
//         }

//         res.status(200).json({
//             status:"success",
//             data:
//             {
//                 x
//             }
//         })
// })
    exports.deleteTour=factory.deleteOne(Tour);
// exports.deleteTour=catchAsync(async(req,res,next)=>{
   
//         const x=await Tour.findByIdAndDelete(req.params.id);
//         if(!x)
//         {
//             return next(new AppError('No tour found with that ID',404));
//         }
//         res.status(204).json({
//             status:"success",
//             data:
//             {
//                 x
//             }
//         })
// })
exports.getTourStats=catchAsync(async(req,res,next)=>{
        const stats=await Tour.aggregate([
            {
                $group:{
                    _id:{$toUpper:"$difficulty"},
                    numTours:{$sum:1},
                    numRatings:{$sum:'$ratingsQuantity'},
                    avgRating:{$avg:'$ratingsAverage'},
                    avgPrice:{$avg:'$price'},
                    minPrice:{$min:'$price'},
                    maxPrice:{$max:'$price'}
                }
            },
            {
                $sort:{avgPrice:1}
            }
        ]);
        res.status(200).json({
            status:"success",
            data:{
                stats
            }
        })
})
exports.getMonthlyPlan=catchAsync(async(req,res,next)=>{
        const year=req.params.year*1;
        const plan=await Tour.aggregate([
            {
                $unwind:"$startDates"
            },
            {
                $match: {
                    startDates:{
                        $gte:new Date(`${year}-01-01`),$lt:new Date(`${year}-12-31`)}}
            },
            {
                $group:{
                    _id:{$month:"$startDates"},
                    numTourStarts:{$sum:1},
                    tours:{$push:'$name'},}
                },
                {
                    $addFields:{month:{$toString:"$_id"}}
                },
                {
                    $project:{
                        _id:0
                    }
                },
                {
                    $sort:{numTourStarts:-1}
                },
                {
                    $limit:12
                    // $limit:6
                }
        ]);
        res.status(200).json({
            status:"success",
            results:plan.length,
            data:{
                plan
            }
        })
})
exports.getToursNearMe=catchAsync(async(req,res,next)=>{
    const {distance,latlng,unit}=req.params;
    const [lat,lng]=latlng.split(',');
    const radius=unit==='mi'?distance/3963.2:distance/6378.1;
    if(!lat||!lng)
    {
        next(new AppError('Please provide latitude and longitude in the format lat,lng',400));
    }
    //console.log(distance,lat,lng,unit);
    const tours=await Tour.find({startLocation:{$geoWithin:{$centerSphere:[[lng,lat],radius]}}});
    res.status(200).json({
        status:"success",
        results:tours.length,
        data:{
            data:tours
        }
    })
})
exports.getDistances=catchAsync(async(req,res,next)=>{
    const {latlng,unit}=req.params;
    const [lat,lng]=latlng.split(',');
    const multiplier=unit==='mi'?0.000621371:0.001;
    if(!lat||!lng)
    {
        next(new AppError('Please provide latitude and longitude in the format lat,lng',400));
    }
    const distances=await Tour.aggregate([
        {
            $geoNear:{
                near:{
                    type:'Point',
                    coordinates:[lng*1,lat*1]
                },
                distanceField:'distance',
                distanceMultiplier:multiplier
            }
        },
        {
            $project:{
                distance:1,
                name:1
            }
        }
    ]);
    res.status(200).json({
        status:"success",
        data:{
            data:distances
        }
    })
})

