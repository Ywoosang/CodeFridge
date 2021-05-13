const passport = require('passport');
const GitHubStrategy = require('passport-github').Strategy;
const { User,sequelize } = require('../models');
module.exports = () => {
passport.use(new GitHubStrategy({
    clientID: process.env.GITHUB_CLIENT_ID,
    clientSecret: process.env.GITHUB_CLIENT_SECRET,
    callbackURL: "/auth/github/callback"
  }, async (accessToken, refreshToken, profile, done) => {
      try{
          const user = await User.findOne({
            where : { 
                authId: profile.id,
                provider :'github'
              }});
              if(user) {
                  done(null,user); 
              }else {
                  const email = profile._json.html_url;
                  const newUser = await User.create({
                    email,
                    nickname : profile.username,
                    authId : profile.id,
                    provider : 'github'
                  });
                  done(null,newUser); 
              }
      } catch(err){
          done(err); 
      }}));
} 
