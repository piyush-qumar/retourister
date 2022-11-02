// import '@babel/polyfill'  // aint't working hence commented out also giving rise to unwanted bugs
//import { showAlert} from './alerts';
const hideAlert=()=>{
    const el=document.querySelector('.alert');
    if(el) el.parentElement.removeChild(el);
}
// type is 'success' or 'error'
const showAlert=(type,msg)=>{
    hideAlert();
    const markup=`<div class="alert alert--${type}">${msg}</div>`;
    document.querySelector('body').insertAdjacentHTML('afterbegin',markup);
    window.setTimeout(hideAlert,5000);
}
const login=async(email,password)=>{
    // console.log(email,password);
    // axios.defaults.withCredentials = true;
    try{
        const res=await axios({
            method:'POST',
            url:'http://127.0.0.1:3000/api/users/login',
            data:{
                email,
                password
            }
        });
        //console.log(res);
        if(res.data.status==='success'){
            showAlert('success','Logged in successfully');
            window.setTimeout(()=>{
                location.assign('/');
            },1500);
        }
    }
    catch(err){
        console.log(err);
        showAlert('error',err.response.data.message);
    }
};
// var el=document.querySelector('.form');
// document.querySelector('.form').addEventListener('submit',e=>{
var el=document.querySelector('.form')
if(el){
    el.addEventListener('submit',e=>{
    e.preventDefault();
    const email=document.getElementById('email').value;
    const password=document.getElementById('password').value;
    login(email,password);
}
)
}
else
{
    console.log("Not found");
    
}
const logout=async()=>{
    try{
        const res=await axios({
            method:'GET',
            url:'http://127.0.0.1:3000/api/users/logout',
        });
        if(res.data.status==='success') location.reload(true);
    }
    catch(err){
        showAlert('error','Error logging out! Try again.');
    }
};
if(document.querySelector('.nav__el--logout')) 
document.querySelector('.nav__el--logout').addEventListener('click',logout);
