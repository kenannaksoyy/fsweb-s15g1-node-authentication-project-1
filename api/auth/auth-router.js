// `checkUsernameFree`, `checkUsernameExists` ve `checkPasswordLength` gereklidir (require)
// `auth-middleware.js` deki middleware fonksiyonları. Bunlara burda ihtiyacınız var!


/**
  1 [POST] /api/auth/register { "username": "sue", "password": "1234" }

  response:
  durum 200
  {
    "user_id": 2,
    "username": "sue"
  }

  response username alınmış:
  durum 422
  {
    "mesaj": "Username kullaniliyor"
  }

  response şifre 3 ya da daha az karakterli:
  durum 422
  {
    "mesaj": "Şifre 3 karakterden fazla olmalı"
  }
 */


/**
  2 [POST] /api/auth/login { "username": "sue", "password": "1234" }

  response:
  durum 200
  {
    "mesaj": "Hoşgeldin sue!"
  }

  response geçersiz kriter:
  durum 401
  {
    "mesaj": "Geçersiz kriter"
  }
 */


/**
  3 [GET] /api/auth/logout

  response giriş yapmış kullanıcılar için:
  durum 200
  {
    "mesaj": "çıkış yapildi"
  }

  response giriş yapmamış kullanıcılar için:
  durum 200
  {
    "mesaj": "oturum bulunamadı"
  }
 */

 
// Diğer modüllerde kullanılabilmesi için routerı "exports" nesnesine eklemeyi unutmayın.
const db = require("../../data/db-config");
const express = require("express");
const { usernameBostami, sifreGecerlimi, usernameVarmi, sifreLoginCheck } = require("./auth-middleware");
const { ekle } = require("../users/users-model");
const router = express.Router();
const bcrypt = require('bcryptjs');

router.post("/register",usernameBostami,sifreGecerlimi, async(req, res, next)=>{
  try{
    const hashPassword = bcrypt.hashSync(req.body.password, 10);
    const cObj = {
      username: req.body.username,
      password: hashPassword
    }
    const createdUser = await ekle(cObj);
    res.status(200).json(createdUser);
  }
  catch(err){
    next(err);
  }
});

router.post("/login",usernameVarmi,sifreLoginCheck, async(req, res, next)=>{
  try{
    req.session.user_id = req.user.user_id;
    res.status(200).json({
      message: `Hoşgeldin ${req.user.username}!`
    })
  }
  catch(err){
    next(err);
  }
});


router.get("/logout", (req, res, next) => {
  try {
    if(req.session.user_id){
      req.session.destroy(err => {
        if(err){
          next({
            message:"Logout Hata"
          });
        }
        else{
          next({
            status:200,
            message: "çıkış yapildi"
          });
        }
      })
    }
    else{
      next({
        status:200,
        message:"oturum bulunamadı no session"
      });
    }
  } catch (err) {
    next(err);
  }
});
module.exports = router;