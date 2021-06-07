// 에디터 설정

$(document).ready(function() {
    renderNote()
  }); 

function renderNote() {
    $('#summernote').summernote({
        toolbar: [
            ['style', ['style']],
            ['font', ['bold', 'underline', 'clear']],
            ['fontname', ['fontname']],
            ['color', ['color']],
            ['para', ['ul', 'ol', 'paragraph']],
            ['insert', []],
            ['view', ['fullscreen', 'codeview', 'help']],
        ],
        minHeight: 100,
        maxHeight: 600,
        focus: true,
        callbacks: {
            onImageUpload: function (files) {
                sendFile(files[0]);
            }
        }
    });
} 

const form = document.querySelector('form');
const content = document.querySelector('#summernote');
const errorElement = document.querySelector('.error');

form.addEventListener('submit',(e)=>{
    console.log('실행됨',content.value== '');
    if(content.value.trim() === '' || content.value == null ){
       
        errorElement.innerText = '댓글은 공백일 수 없습니다'; 
        console.log(errorElement)
        e.preventDefault(); 
    }
})