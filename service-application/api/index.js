const express = require("express");
const morgan = require("morgan");
const path =require('path')
const helmet = require('helmet');
const hpp = require('hpp'); 
const { sequelize } = require('./models');
const session = require('express-session');
const csrf = require('csurf');
const csrfProtection = csrf({cookie:true});
const passport = require('passport');
const passportConfig = require('./passport');
const multer = require('multer');
const AWS = require('aws-sdk');
const multerS3 = require('multer-s3');
const redis = require('redis')
const connectRedis = require('connect-redis');
const nunjucks = require('nunjucks')
const redisStore = connectRedis(session); 
const app = express(); 

app.set('view engine', 'html');
const env = nunjucks.configure('views', {
    express: app,
    watch: true,
});

env.addFilter('dateform',function (str) {
  const curr = new Date(str);
  // 2. UTC 시간 계산
  const utc = 
        curr.getTime() + 
        (curr.getTimezoneOffset() * 60 * 1000);
  // 3. UTC to KST (UTC + 9시간)
  const KR_TIME_DIFF = 9 * 60 * 60 * 1000;
  const kr_curr = 
        new Date(utc + (KR_TIME_DIFF));
  const year = kr_curr.getFullYear();
  const month = (kr_curr.getMonth() +1);
  const day = kr_curr.getDate();
  const hours = kr_curr.getHours();
  const minutes = kr_curr.getMinutes();
  const seconds = kr_curr.getSeconds(); 
  return `${ year}-${month}-${ day } ${hours}:${minutes}:${seconds}`;
});

// 파싱
app.use(express.json());
app.use(express.urlencoded({extended:true}));
 
// 정적 파일 경로 설정
app.use(express.static(path.join(__dirname,'public')));
app.use('/img',express.static(path.join(__dirname,'public/img')));
 
// AWS Config 
AWS.config.update({
    accessKeyId : process.env.S3_ACCESS_KEY_ID,
    secretAccessKey : process.env.S3_SECRET_ACCESS_KEY,
    // s3 : region 상관없음
    region: 'ap-northeast-2',
});

// multer 
const storage = multerS3({
    s3: new AWS.S3(),
    bucket : 'ywoosang-s3',
    async key(req,file,cb) {
       try{
        // S3 저장할때 Date 붙여서 구분
        const filePathName = `${Date.now()}-${file.originalname}`;
        req.data = filePathName;
        cb(null,filePathName); 
       } catch(err){
            console.log(err);            
       }
    }}); 

const upload = multer({
    storage,
    preservePath: true,
});
// .single('file') 
exports.upload = upload; 

// Routers
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth'); 
const resourceRouter = require('./routes/resource'); 
const uploadRouter = require('./routes/upload'); 
const downloadRouter = require('./routes/download'); 
const teamRouter = require('./routes/team'); 

// Mysql 연결 
sequelize.sync({ force: false })
  .then(() => {
    console.log('MySQL: connection success');
  })
  .catch((err) => {
    console.error(err);
  });
 
 
// redis 연결 테스트 
const client = redis.createClient({
  host : process.env.REDIS_HOST,
  port:6379,
  db: 0,
  password: 'ywoosang123'
});

client.on("error", (err) => {
  console.error('Redis error',err);
});

client.on("ready", () => {
  console.log("Redis is ready");
});

// 세션 저장 
const redisConfig = {
  "host": process.env.REDIS_HOST,
  "port": 6379,
  "prefix": "session:",
  "db": 0,
  "password" :'ywoosang123',
  "saveUninitialized" : false,
  "client": client
}

// 세션 옵션 (레디스 세션 저장)
const sessionOption = {
  resave: false,
  saveUninitialized: false,
  secret: process.env.COOKIE_SECRET || 'test1234@',
  cookie: {
      httpOnly : true,
      secure:false,
      // 쿠키 수명 설정 
      // maxAge : 1000 * 60 * 3
  },
  store: new redisStore(redisConfig)
}

// 세션 미들웨어 사용 
app.use(session(sessionOption));

// 배포 환경 설정 
if(process.env.NODE_ENV == 'production'){
    // 배포시 ip 기록 
    app.enable('trust proxy'); 
    app.use(morgan('combined'));
    // 외부 공격 보안 
    app.use(helmet({contentSecurityPolicy: false }))
    // nginx 등 proxy server 
    sessionOption.proxy = true;
} else {
    app.use(morgan('dev'));
}
 
// passport 
passportConfig();
app.use(passport.initialize());
app.use(passport.session());


// 라우터 등록 
app.use('/', indexRouter);
app.use('/auth',authRouter); 
app.use('/resource',resourceRouter); 
app.use('/s3',uploadRouter);
app.use('/s3',downloadRouter); 
app.use('/team',teamRouter); 

// 404 라우터
app.use((req,res,next)=>{
  res.status(404).json({ msg : 'Page Not Found'});
});

app.use((error, req, res, next) => {
  // 에러 로깅
  // errorLogger.error(error.stack);
  console.error(error)
  // AJAX 요청인 경우
  if (req.is('json') || req.is('multipart/form-data')) {
    res.status(500).json({ message: '시스템 오류가 발생하였습니다.' });
  }
  // VIEW 요청의 경우
  // res.render('error/500', {
  //   layout: false,
  // });
});


// 서버 실행 
const port = process.env.PORT || 8080;
app.listen(port,()=>{
    console.log('server start',port);
});

 

// 테스트 
