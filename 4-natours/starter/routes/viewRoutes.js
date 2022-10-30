const express=require('express');
const viewController=require('../controllers/viewController');
const authController=require('../controllers/authController');
const router=express.Router();

router.get('/',viewController.getOverview);
//when the token issue is resolved we have to protect the getTour route
//so we will use authController.protect before viewController.getTour in the line below
router.get('/tour/:slug',viewController.getTour);
router.get('/login',viewController.getLoginForm);

module.exports=router;