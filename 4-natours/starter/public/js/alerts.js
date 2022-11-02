//useless js file as of now ..... will decide its future later

export const hideAlert=()=>{
    const el=document.querySelector('.alert');
    if(el) el.parentElement.removeChild(el);
}
// type is 'success' or 'error'
export const showAlert=(type,msg)=>{
    hideAlert();
    const markup=`<div class="alert alert--${type}">${msg}</div>`;
    document.querySelector('body').insertAdjacentHTML('afterbegin',markup);
    window.setTimeout(hideAlert,5000);
}