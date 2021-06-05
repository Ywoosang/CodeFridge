const open = () => {
    document.querySelector(".modal").classList.remove("hidden");
}
const open2 = () => {
    document.querySelector(".modal2").classList.remove("hidden2");
}

const open3 = () => {
    document.querySelector(".modal3").classList.remove("hidden3");
}

const close = () => {
    document.querySelector(".modal").classList.add("hidden");
}
const close2 = () => {
    document.querySelector(".modal2").classList.add("hidden2");
}
const close3 = () => {
    document.querySelector(".modal3").classList.add("hidden3");
}


document.querySelector(".openBtn").addEventListener("click", open);
document.querySelector(".closeBtn").addEventListener("click", close);
document.querySelector(".changebtn").addEventListener("click", close);
document.querySelector(".bg").addEventListener("click", close);

document.querySelector(".openBtn2").addEventListener("click", open2);
document.querySelector(".closeBtn2").addEventListener("click", close2);
document.querySelector(".changebtn2").addEventListener("click", close2);
document.querySelector(".bg2").addEventListener("click", close2);

document.querySelector(".img-preview").addEventListener("click", open3);
document.querySelector(".img-submit").addEventListener("click", close3);
document.querySelector(".bg3").addEventListener("click", close3);
document.querySelector(".closeBtn3").addEventListener("click", close3);

const fileCheck = document.querySelector('.user-img');
console.log(fileCheck);
fileCheck.onchange  = () => {
    console.log('바뀜');
}

