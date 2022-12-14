const express=require('express');
const viewController=require('../controllers/viewController');
const authController=require('../controllers/authController');
const router=express.Router();
//when the token issue is resolved we have to protect the getTour route
//so we will use authController.isLoggedIn before every statement below
//router.use(authController.isLoggedIn);

router.get('/',authController.isLoggedIn,viewController.getOverview);
router.get('/tour/:slug',authController.isLoggedIn,authController.protect,viewController.getTour);
router.get('/login',authController.isLoggedIn,viewController.getLoginForm);
router.get('/me',authController.protect,viewController.getAccount);
//router.get('/my-tours',authController.protect,viewController.getMyTours);
router.post('/submit-user-data',authController.protect,viewController.updateUserData)


module.exports=router;