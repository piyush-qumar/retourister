// import '@babel/polyfill'  // aint't working hence commented out also giving rise to unwanted bugs
//import { showAlert} from './alerts';
//(updatesettings.js)file (login file) and (alert.js) files are submerged into this one file
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
var el=document.querySelector('.form--login')
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

const updateSettings=async(data,type)=>{
    try{
        const url=type==='password'? 'http://127.0.0.1:3000/api/users/updateMyPassword':'http://127.0.0.1:3000/api/users/updateMe';
        const res=await axios({
            method:'PATCH',
            url,
            data
        });
        if(res.data.status==='success'){
            showAlert('success',`${type.toUpperCase()} updated successfully!`);
        }
        }catch(err){
            showAlert('error');
        }
    };
const userDataForm=document.querySelector('.form-user-data');
if(userDataForm)
userDataForm.addEventListener('submit',e=>{
    e.preventDefault();
    const form=new FormData();
    form.append('name',document.getElementById('name').value);
    form.append('email',document.getElementById('email').value);
    form.append('photo',document.getElementById('photo').files[0]);
    console.log(form);
    updateSettings(form,'data');
});

const userPasswordForm=document.querySelector('.form-user-password');

if(userPasswordForm)
userPasswordForm.addEventListener('submit',async e=>{
    e.preventDefault();
    document.querySelector('.btn--save-password').textContent='Updating...';

    const passwordCurrent=document.getElementById('password-current').value;
    const password=document.getElementById('password').value;
    const passwordConfirm=document.getElementById('password-confirm').value;
    await updateSettings({passwordCurrent,password,passwordConfirm},'password');
    
    document.querySelector('.btn--save-password').textContent='Save password';
    document.getElementById('password-current').value='';
    document.getElementById('password').value='';
    document.getElementById('password-confirm').value='';
});
