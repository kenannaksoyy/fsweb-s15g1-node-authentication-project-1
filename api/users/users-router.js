// `sinirli` middlewareını `auth-middleware.js` dan require edin. Buna ihtiyacınız olacak!


/**
  [GET] /api/users

  Bu uç nokta SINIRLIDIR: sadece kullanıcı girişi yapmış kullanıcılar
  ulaşabilir.

  response:
  durum 200
  [
    {
      "user_id": 1,
      "username": "bob"
    },
    // etc
  ]

  response giriş yapılamadıysa:
  durum 401
  {
    "mesaj": "Geçemezsiniz!"
  }
 */


// Diğer modüllerde kullanılabilmesi için routerı "exports" nesnesine eklemeyi unutmayın.

const router = require("express").Router();
const { sinirli } = require("../auth/auth-middleware");
const { bul } = require("./users-model");


router.get("/", sinirli, async(req, res, next) => {
  try {
    const users = await bul();
    res.status(200).json(users);
  } 
  catch (err) {
    next(err);
  }
});

module.exports = router