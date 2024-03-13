module.exports = {
  getToken: (req) => {
    return req.headers.authorization.replace("Bearer", "");
  },
  getMemberId: (req) => {
    const jwt = require("jsonwebtoken");
    const token = req.headers.authorization.replace("Bearer", "");
    const payload = jwt.decode(token);
    return payload.id;
  },
  // isLogin: (req, res, next) => {
  //   require("dotenv").config();
  //   const jwt = require("jsonwebtoken");

  //   if (req.headers.authorization != null) {
  //     const token = req.headers.authorization.replace("Bearer", "");
  //     const secret = process.env.secret;
  //     const verify = jwt.verify(token, secret);

  //     if (verify != null) {
  //       return next(); // ส่งควบคุมไปยัง middleware ถัดไป
  //     }
  //   }
  //   res.statasCode = 401;
  //   return res.send("authorize fail");
  // },
};
