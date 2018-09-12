const jwt = require('jwt-simple');
const return_types = require('../return_types');
const config = require('../config');

function getRequestToken(req) {
  return (req.body && req.body.access_token) || (req.query && req.query.access_token) || req.headers['x-access-token'];
}

function checkToken(req, res, next, check_condition) {
  let token = getRequestToken(req);

  if (token) {
    try {
      let decoded = jwt.decode(token, config.secret);

      if (decoded.exp <= Date.now()) {
        return_types.token_expire(res);
        return;
      }

      if (check_condition(decoded.user, req.params.id)) next();
      else {
        return_types.not_authorized(res);
        return;
      }
    } catch (e) {
      return_types.internal_error(res, e);
      return;
    }
  }
  else {
    return_types.invalid_token(res);
    return;
  }
}

module.exports.isAdmin = function(req, res, next) {

  if(req.method == 'OPTIONS') next();

  checkToken(req, res, next, function(user) {
    return user.admin;
  });

};


module.exports.isOwner = function(req, res, next){
  checkToken(req, res, next, function(user, id) {
    return user.id == req.params.id;
  });
};

module.exports.isOwnerOrAdmin = function(req, res, next){
  checkToken(req, res, next, function(user, id) {
    return (user.admin || user.id == req.params.id);
  });
};
