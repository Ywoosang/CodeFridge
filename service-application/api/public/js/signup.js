const form = document.querySelector('.log-background');
const email = document.querySelector('input[name="email"]')
const password = document.querySelector('input[name="password"]')
const Username = document.querySelector('input[name="name"]')

form.addEventListener('submit', (e) => {
    checkInputs(e);
});

function checkInputs(e) {
    // get the values from the inputs
    const emailValue = email.value.trim();
    const passwordValue = password.value.trim();
    const nameValue = Username.value.trim();

    if(emailValue === '') {
        alert('이메일은 빈 칸일 수 없습니다.')
        e.preventDefault();
    } else if(!isEmail(emailValue)) {
        alert('유효하지않은 형식의 이메일입니다.')
        e.preventDefault();
    } else {
        // sucess
    }

    if(passwordValue === '') {
        alert('비밀번호는 빈 칸일 수 없습니다.')
        e.preventDefault();
    } else if(!isSpcIn(passwordValue) || !isNumIn(passwordValue) || !isEngIn(passwordValue)) {
        alert('비밀번호는 숫자, 문자, 특수문자를 포함해야 합니다.')
        e.preventDefault();
    } else if(passwordValue.length < 8) {
        alert('비밀번호는 8자 이상입니다.')
        e.preventDefault();
    } else {
        // sucess
    }


    if(nameValue === '') {
        alert('닉네임은 빈 칸일 수 없습니다.')
        e.preventDefault();
    } else if(nameValue.length < 3 || nameValue.length > 10) {
        alert('닉네임은 3자 이상, 10자 이하입니다.')
        e.preventDefault();
    } else if(isSpcIn(nameValue)) {
        alert('닉네임에는 특수문자가 포함될 수 없습니다.')
        e.preventDefault();
    } else {
        // sucess
    }
   
    // show a success message
}

function isEmail(email) {
    return /^([0-9a-zA-Z_\.-]+)@([0-9a-zA-Z_-]+)(\.[0-9a-zA-Z_-]+){1,2}$/.test(email);
}

function isSpcIn(value) {
    return /[~!@#$%^&*()_+|<>?:{}]/.test(value);
}

function isNumIn(value) {
    return /[0-9]/.test(value);
}

function isEngIn(value) {
    return /[a-zA-Z]/.test(value);
}