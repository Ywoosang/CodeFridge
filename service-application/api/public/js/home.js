const $ = (exp) => document.querySelector(exp);

const container = $('.container');
const uploadFolderBtn = $('.upload_folder');
const uploadFileBtn = $('.upload_file');
const uploadFolderInput = $('#folder');
const uploadFileInput = $('#file');
const logoutBtn = $('.logout button');



// 이벤트 리스너 등록 

// 로그아웃
logoutBtn.addEventListener('click',()=>{
    location.href = `${window.origin}/auth/logout`;
});
uploadFolderBtn.addEventListener('click', () => {
    uploadFolderInput.click();
});
uploadFileBtn.addEventListener('click', () => {
    uploadFileInput.click();
});
uploadFileInput.addEventListener('change', showUploadModal);
uploadFolderInput.addEventListener('change', showUploadModal);

function showUploadModal() {
    let totalSize = 0;
    Object.values(this.files).forEach(el => {
        totalSize += el.size;
    });
    // 용량이 1기가 이상인 경우 제한 
    if(totalSize >  Math.pow(1000,3)){
        return alert('파일 용량이 한도를 초과했습니다.')
    }; 
    totalSize = totalSize / (1024 * 1024);
    // 소수점 아래 네번째 자리에서 반올림
    let tmp = totalSize * 1000;
    if (tmp - parseInt(tmp) > 0.5) {
        totalSize = (parseInt(tmp) + 1) / 1000
    } else {
        totalSize = parseInt(tmp) / 1000
    };

    const modal = document.createElement('div');
    modal.classList.add('modal');
    const uploadContent = `
        <div class="upload">
            <h1>업로드 대기중..</h1>
            <ul class="upload-list">
            </ul>
            <div class="upload-button">
                <div class="size">업로드 용량: ${totalSize}mb</div>
                <button type="button" class="cancel">취소</button>
                <button type="button" class="submit">업로드</button>
            </div>
        </div>
     `
    modal.innerHTML = uploadContent;
    const list = modal.querySelector('.upload-list');
    Object.values(this.files).forEach(el => {
        const liTag = document.createElement('li');
        liTag.textContent = el.name  
        list.appendChild(liTag);
        
    })
    const cancelButton = modal.querySelector('.cancel');
    cancelButton.addEventListener('click', cancelModal);
    const uploadButton = modal.querySelector('.submit');
    uploadButton.addEventListener('click',()=> upload(this.files));
    container.appendChild(modal);
}

function cancelModal(){
    const modal = document.querySelector('.modal');
    modal.parentNode.removeChild(modal);
}

//   file/folder
async function upload(files) {
    console.log(files);
    const uploadBtnArea = document.querySelector('.upload-button');
    uploadBtnArea.innerHTML = ''
    const num = new Date().valueOf();
    try {
        let idx = 0; 
        const list = document.querySelectorAll('.modal ul li');
        for (let file of files) {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('num',num);
            // url,FormData,options 
            const res = await axios.post(`${window.origin}/s3/file`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            if (!res.data.msg === 'uploaded') {
                alert('업로드 중 오류가 발생했습니다.');
            }
            const liTag = list[idx]; 
            const spanTag = document.createElement('span');
            spanTag.innerHTML = `<i class="fas fa-check"></i>`;
            liTag.appendChild(spanTag);
            console.log(idx);
            ++ idx;  
        }
        const msg = document.querySelector('.upload h1');
        msg.textContent = '업로드 완료';
        const acceptBtn = document.createElement('button');
        acceptBtn.classList.add('submit');
        acceptBtn.textContent = '확인';
        uploadBtnArea.appendChild(acceptBtn);
        acceptBtn.addEventListener('click',()=>{
            cancelModal();
        })
    } catch (err) {
        console.log(err);
    }
}

window.onload = async function () {
    resetNode();
    renderComponents();
}

const resetNode = () => {
    // article 기존 내용을 지우고 빈 article 로 대체 
    const article = document.querySelector('article');
    article.parentNode.replaceChild(document.createElement('article'), article);
}; 


const renderComponents = async () => {
    try {
        const article = document.querySelector('article');
        const res = await axios.post(`${window.origin}/resource/all`);
        if(res.data.expired){
            alert('세션이 만료되었습니다.');
            setTimeout(()=>{
                location.href = `${window.origin}/`
            },2000)
            return;
        }
       
        console.log(files);
        files.forEach(el => {
            const file = fileComponent(el.fileUrl, el.name);
            article.appendChild(file);
        })
        folders.forEach(el => {
            const url = `${window.origin}/resource/folder/${el.id}`
            const folder = folderComponent(url, el.name);
            article.appendChild(folder);
        })
    } catch (err) {
        console.log(err);
    }
}

const fileComponent = (path, name) => {
    const div = document.createElement('div');
    const file = `
        <a href="${path}"> 
            <img src="img/folder.svg"> 
            <h1>${name}</h1>
        </a>`;
    div.innerHTML = file;
    return div;
}
const folderComponent = (url, name) => {
    const article = document.querySelector('article');
    const div = document.createElement('div');
    const folder = `
        <a> 
            <img src="img/folder.svg"> 
            <h1>${name}</h1>
        </a>`;
    div.innerHTML = folder;
    const folderBtn = div.getElementsByTagName('a')[0];
    console.log(folderBtn);
    folderBtn.addEventListener('click',()=>{
        axios.post(url)
        .then(res=>{
            article.innerHTML = '';
            for(let el of res.data.folders){
                const url = `${window.origin}/resource/folder/${el.id}`
                const folder = folderComponent(url, el.name);
                article.appendChild(folder);
            }
            for(let el of res.data.files){
                const file = fileComponent(el.fileUrl, el.name);
                article.appendChild(file);
            }
        })
        .catch(err=>{
            console.log(err); 
        })
    })
    return div;
}
