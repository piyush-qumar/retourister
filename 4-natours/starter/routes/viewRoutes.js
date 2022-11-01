const express=require('express');
const viewController=require('../controllers/viewController');
const authController=require('../controllers/authController');
const router=express.Router();
//when the token issue is resolved we have to protect the getTour route
//so we will use authController.isLoggedIn before every statement below
router.use(authController.isLoggedIn);

router.get('/',viewController.getOverview);
router.get('/tour/:slug',authController.protect,viewController.getTour);
router.get('/login',viewController.getLoginForm);

module.exports=router;