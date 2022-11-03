const express=require("express");
const router=express.Router();
const userController=require("./../controllers/userController")
const authController=require("./../controllers/authController")


router.post('/signup',authController.signup);
router.post('/login',authController.login);
router.get('/logout',authController.logout);

router.post('/forgotPassword',authController.forgotPassword);
router.patch('/resetPassword/:token',authController.resetPassword);

//router.use(authController.protect);

router.patch('/updateMyPassword',authController.protect,authController.updatePassword);
router.patch('/updateMe',authController.protect,userController.uploadUserPhoto,userController.resizeUserPhoto,userController.updateMe);
router.delete('/deleteMe',authController.protect,userController.deleteMe);
router.get('/me',authController.protect,userController.getMe,userController.getUser);

router.use(authController.restrictTo('admin'));//all routes below are restricted to admin only

router.route("/")
.get(authController.protect,userController.getAllUsers)
.post(userController.createUser);

router.route("/:id")
.get(authController.protect,userController.getUser)
.patch(authController.protect,userController.updateUser)
.delete(authController.protect,userController.deleteUser);

module.exports=router;

// there is yet another way of doing it we can induce the rotect middleware in router 
//itself just before the required route and all further will automatically b covered as
//code is executed sequence wise
// the code has been commented for future reference in line 10