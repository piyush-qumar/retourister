const login=async(email,password)=>{
    console.log(email,password);
    axios.defaults.withCredentials = true;
    try{
        const res=await axios({
            method:'POST',
            url:'http://127.0.0.1:3000/api/users/login',
            data:{
                email,
                password
            }
        });
        console.log(res);
        // if(res.data.status==='success'){
        //     alert('Logged in successfully');
        //     window.setTimeout(()=>{
        //         location.assign('/');
        //     },1500);
        // }
    }
    catch(err){
        console.log(err);
        //alert(err.response.data.message);
    }
};
document.querySelector('.form').addEventListener('submit',e=>{
    e.preventDefault();
    const email=document.getElementById('email').value;
    const password=document.getElementById('password').value;
    login(email,password);
}
);