const open = () => {
    document.querySelector(".modal").classList.remove("hidden");
}
const open2 = () => {
    document.querySelector(".modal2").classList.remove("hidden2");
}

const close = () => {
    document.querySelector(".modal").classList.add("hidden");
}
const close2 = () => {
    document.querySelector(".modal2").classList.add("hidden2");
}
document.querySelector(".openBtn").addEventListener("click", open);
document.querySelector(".closeBtn").addEventListener("click", close);
document.querySelector(".changebtn").addEventListener("click", close);
document.querySelector(".bg").addEventListener("click", close);

document.querySelector(".openBtn2").addEventListener("click", open2);
document.querySelector(".closeBtn2").addEventListener("click", close2);
document.querySelector(".changebtn2").addEventListener("click", close2);
document.querySelector(".bg2").addEventListener("click", close2);

const fileCheck = document.querySelector('.user-img');
console.log(fileCheck);
fileCheck.onchange  = () => {
    console.log('바뀜');
}

