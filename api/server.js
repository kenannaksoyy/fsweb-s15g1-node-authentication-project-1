const express = require("express");
const helmet = require("helmet");
const cors = require("cors");
const { bul } = require("./users/users-model");

/**
  Kullanıcı oturumlarını desteklemek için `express-session` paketini kullanın!
  Kullanıcıların gizliliğini ihlal etmemek için, kullanıcılar giriş yapana kadar onlara cookie göndermeyin. 
  'saveUninitialized' öğesini false yaparak bunu sağlayabilirsiniz
  ve `req.session` nesnesini, kullanıcı giriş yapana kadar değiştirmeyin.

  Kimlik doğrulaması yapan kullanıcıların sunucuda kalıcı bir oturumu ve istemci tarafında bir cookiesi olmalıdır,
  Cookienin adı "cikolatacips" olmalıdır.

  Oturum ramde tutulabilir (canlı üründe uygun olmaz)
  veya "connect-session-knex" gibi bir oturum deposu kullanabilirsiniz.
 */

const server = express();

server.use(helmet());
server.use(express.json());
server.use(cors());

const authRouter = require("./auth/auth-router");
server.use('/api/auth', authRouter);
const session = require('express-session');

server.use(
  session({
    name: 'cikolatacips',
    secret: 'TopSecret',
    cookie: {
      maxAge: 1 * 24 * 60 * 60 * 1000,
      secure: true, 
    },
    httpOnly: true,
    resave: false,
    saveUninitialized: false,
  })
);
server.get("/", async(req, res) => {
  const users = await bul();
  res.status(200).json(users);
});

server.use((err, req, res, next) => { // eslint-disable-line
  res.status(err.status || 500).json({
    message: err.message,
    stack: err.stack,
  });
});

module.exports = server;
