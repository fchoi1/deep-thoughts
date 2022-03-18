//JSON Web Token
const jwt = require('jsonwebtoken');

const secret = 'mysecret';
const expiration = '2h';

module.exports = {
  signToken: function ({ username, email, _id }) {
    const payload = { username, email, _id };
    return jwt.sign({ data: payload }, secret, { expiresIn: expiration });
  },
  authMiddleware: function ({ req }) {
    // search for token
    let token = req.body.token || req.query.token || req.headers.authorization;

    if (req.headers.authorization) {
      // separate "Bearer" from token valuee
      token = token.split(' ').pop().trim();
    }

    // if no token found
    if (!token) return req;

    try {
      //decode data and attach user data to request
      const { data } = jwt.verify(token, secret, { maxAge: expiration }); // matches sercret
      req.user = data;
    } catch (err) {
      console.log('Invalid Token: ', err);
    }
    return req;
  }
};
