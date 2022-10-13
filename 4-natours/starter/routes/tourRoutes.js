const express=require("express");
const router=express.Router();
const tourController=require("../controllers/tourController")
const authController=require('./..//controllers///authController');
const reviewRouter=require("./reviewRoutes");
router.use('/:tourId/reviews',reviewRouter);

router.route('/5-cheapest')
.get(tourController.aliass,tourController.getAllTours);

router.route('/get-stats')
.get(tourController.getTourStats);

router.route('/monthly-plan/:year')
.get(authController.protect,authController.restrictTo('admin','lead-guide','guide'),tourController.getMonthlyPlan);

router.route('/tours-nearMe/:distance/center/:latlng/unit/:unit')
.get(tourController.getToursNearMe);
// /tours-nearMe?distance=233&center=-40,45&unit=mi

router.route('/distances/:latlng/unit/:unit')
.get(tourController.getDistances);

router.route("/")
.get(tourController.getAllTours)
.post(authController.protect,authController.restrictTo('admin','lead-guide'),tourController.createTour);

router.route("/:id")
.get(tourController.getTour)
.patch(authController.protect,authController.restrictTo('admin','lead-guide'),tourController.updateTour)
.delete(authController.protect,authController.restrictTo('admin','lead-guide'),tourController.deleteTour);

module.exports=router;



