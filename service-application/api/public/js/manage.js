// 멤버 초대
const searchMember = document.querySelector('.invite');
const userWrapper = document.querySelector('.users');
 

// 팀원 등록
const enrollTeamMember = (user,userWrapper) => {
    return {
        setContent(user) {
            return `
            <div>닉네임: ${user.nickname}</div>
            <div>아이디: ${user.nickId}</div>
            <select id="auth">
                <option value="member">노예</option>
                <option value="manager">관리자</option>
            </select>
            <button type='button' class="enroll">초대하기</button>
            `
        },
        setEvent(){
            const userDom = document.createElement('li');
            userDom.innerHTML = this.setContent(user);
            userDom.querySelector('.enroll').onclick = this.enrollUser.bind(userDom);
            userWrapper.appendChild(userDom);
        },
        async enrollUser() {
            const userId = user.id;
            const nickId = user.nickId; 
            const rank = this.querySelector('#auth').value;
            // dom
            if(!rank || !userId)  throw new Error('value is undefined')
            try{
                axios({
                    url : `${window.origin}/team/member`,
                    method: 'post',
                    data : {
                        userId,
                        rank,
                        nickId
                    }
                })
                .then((res)=>{
                    alert(res.data.message);
                })
            }catch(err){
                console.log(err);
            }
        }
    }
}

const serarchNewMember = async()=>{
        const nickId = searchMember.value.trim();
        if(nickId === '' || nickId.length > 11) return;
        try{
            const response = await axios({
                url : `${window.origin}/team/users?nickId=${nickId}`,
                method:'get', 
            });
            const users = response.data.users;
            console.log(users);
            userWrapper.innerHTML = ''; 
            users.forEach(user => {
                const member = enrollTeamMember(user,userWrapper); 
                member.setEvent();
            }); 
        }catch(err){
            console.log(err);
        }
    }
 

// 
searchMember.addEventListener('keyup', serarchNewMember)