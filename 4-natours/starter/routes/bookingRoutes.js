const exprress=require('express');
const router=exprress.Router();
const authController=require('./../controllers/authController');
const bookingController=require('./../controllers/bookingController');
const reviewRouter=require('./../routes/reviewRoutes');

//router.use('/:tourId/reviews',reviewRouter);
router.get('/checkout-session/:tourId',authController.protect,bookingController.getCheckoutSession);
// router.use(authController.protect);
// router.get('/checkout-session/:tourId',bookingController.getCheckoutSession);
// router.use(authController.restrictTo('admin','lead-guide'));
// router
// .route('/')
// .get(bookingController.getAllBookings)
// .post(bookingController.createBooking);
// router
// .route('/:id')
// .get(bookingController.getBooking)
// .patch(bookingController.updateBooking)
// .delete(bookingController.deleteBooking);

module.exports=router;
