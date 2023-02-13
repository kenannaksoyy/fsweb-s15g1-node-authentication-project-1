/**
  tüm kullanıcıları içeren bir DİZİ ye çözümlenir, tüm kullanıcılar { user_id, username } içerir
 */
const db = require("../../data/db-config");
async function bul() {
  const dbUsers = await db("users");
  const resUsers = await dbUsers.map(u => {
    return ({
      user_id:u.user_id,
      username:u.username
    });
  });
  /*
  db("...").select("...","...")
  */
  return resUsers;
}

/**
  verilen filtreye sahip tüm kullanıcıları içeren bir DİZİ ye çözümlenir
 */
async function goreBul(filtre) {
  return await db('users')
  .where(filtre)
}

/**
  verilen user_id li kullanıcıya çözümlenir, kullanıcı { user_id, username } içerir
 */
async function idyeGoreBul(user_id) {
  return await db('users')
  .where({ user_id: Number(user_id) })
  .first();
}
async function usernameGoreBul(cUsername){
  return await db('users').
  where({username: cUsername}).
  first();
}
/**
  yeni eklenen kullanıcıya çözümlenir { user_id, username }
 */
function ekle(user) {
  return db('users')
    .insert(user)
    .then(c_id => (idyeGoreBul(c_id)))
    .then(u => ({user_id: u.user_id,username: u.username}));
}

// Diğer modüllerde kullanılabilmesi için fonksiyonları "exports" nesnesine eklemeyi unutmayın.
module.exports={bul,ekle,idyeGoreBul,goreBul,usernameGoreBul}