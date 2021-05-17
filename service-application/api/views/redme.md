 css 작업

# 프로젝트 이름정하기

code fridge  이걸로 결정!

# 테마 정하기

가입 -> 팀생성(프로젝트 조원 생성) -> 기존 가입 아이디 검색
-> 팀원선택(팀에 팀원넣기) -> 공유 저장소 + 코드, 메시지 등 공유 게시판




1. 메뉴 레이아웃 짜기 (모바일 버전에서 뷰)
2. 파일/폴더 아이콘 (벡터이미지, 아이콘 구하기)
3. 로고만들기
5. 테마
6. 메모 디자인
 

데이터베이스 작업


시퀄라이즈

If you don't define a primaryKey then sequelize uses id by default.

If you want to set your own, just use primaryKey: true on your column. 
```
AcademyModule = sequelize.define('academy_module', {
    academy_id: {
        type: DataTypes.INTEGER,
        primaryKey: true
    },
    module_id: DataTypes.INTEGER,
    module_module_type_id: DataTypes.INTEGER,
    sort_number: DataTypes.INTEGER,
    requirements_id: DataTypes.INTEGER
}, {
    freezeTableName: true
});
```
https://stackoverflow.com/questions/29233896/sequelize-table-without-column-id 



