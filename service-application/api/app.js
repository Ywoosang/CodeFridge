const express = require("express");
const morgan = require("morgan");
const path =require('path')
const indexRouter = require('./routes/index');
const authRouter = require('./routes/auth'); 
const resourceRouter = require('./routes/resource'); 
const uploadRouter = require('./routes/upload'); 
const helmet = require('helmet');
const hpp = require('hpp'); 
const { sequelize } = require('./models');
const session = require('express-session');
const csrf = require('csurf');
const csrfProtection = csrf({cookie:true});
const passport = require('passport');
const passportConfig = require('./passport');
const redis = require('redis')
const connectRedis = require('connect-redis');
const nunjucks = require('nunjucks')
const redisStore = connectRedis(session); 
const app = express(); 



app.set('view engine', 'html');
nunjucks.configure('views', {
    express: app,
    watch: true,
});

// 파싱
app.use(express.json());
app.use(express.urlencoded({extended:true}));
 
// 정적 파일 경로 설정
app.use(express.static(path.join(__dirname,'public')));
  
// Mysql 연결 
sequelize.sync({ force: false })
  .then(() => {
    console.log('데이터베이스 연결 성공');
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
