const passport = require('passport');
const KakaoStrategy = require('passport-kakao').Strategy;
const { User } = require('../models');

module.exports = () => {
   passport.use(new KakaoStrategy({
       // 카카오 서비스로 로그인하도록 구현 
       clientID : process.env.KAKAO_ID,
       callbackURL : '/auth/kakao/callback',
   },async (accessToken,refreshToken,profile,done)=>{
       console.log('kakao profile',profile);
       try {
           const user = await User.findOne({
               where : { authId: profile.id,
               provider :'kakao'
           }});
           if(user){
               done(null,user);
           }else {
               const newUser = await User.create({
                   email : profile._json && profile._json.kakao_account.email,
                   name : profile.displayName,
                   authId : profile.id,
                   provider : 'kakao'
               });
               done(null,newUser); 
           }
       }catch(error) {
           console.error(error);
           done(error)
       }

   }))
}