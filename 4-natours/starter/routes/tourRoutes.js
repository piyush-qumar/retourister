const express=require("express");
const router=express.Router();
const tourController=require("../controllers/tourController")
const authController=require('./..//controllers///authController');
const reviewRouter=require("./reviewRoutes");
router.use('/:tourId/reviews',reviewRouter);

//const reviewController=require("./../controllers/reviewController")
//router.param("id",tourController.checkID);

router.route('/5-cheapest').get(tourController.aliass,tourController.getAllTours);
router.route('/get-stats').get(tourController.getTourStats);
router.route('/monthly-plan/:year').get(tourController.getMonthlyPlan);

router.route("/").get(authController.protect,tourController.getAllTours).post(tourController.createTour);

router.route("/:id").get(tourController.getTour).patch(tourController.updateTour).delete(authController.protect,authController.restrictTo('admin','lead-guide'),tourController.deleteTour);
//router.route('/:tourId/reviews').post(authController.protect,authController.restrictTo('user'),reviewController.createReview);
module.exports=router;



