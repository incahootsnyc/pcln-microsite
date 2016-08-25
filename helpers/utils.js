var config = require('../config');
var crypto = require('crypto');

function generateGuid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

function generateUniqueName (fileName) {
	var startOfFileExtension = fileName.lastIndexOf('.');
	var imageNameWithoutExtension = fileName.substring(0, startOfFileExtension);
	var fileExtension = fileName.substring(startOfFileExtension, fileName.length);

	return imageNameWithoutExtension + generateGuid() + fileExtension;
}

function getSortAndFilter (req) {
  var sortType = req.query.sort ? req.query.sort  : 'newest';
  var filterTags = req.query.tags ? req.query.tags.split(',') : undefined;

  var sortOptions = {  'limit': config.itemsPerPage };
  var queryOptions = {};

  if (req.params.pageNum) {
    sortOptions['skip'] = (config.itemsPerPage * req.params.pageNum);
  }

  if (sortType == 'popular') {
    sortOptions['sort'] = [[ 'likesCount', 'desc' ]];
  } else {
    sortOptions['sort'] = [[ 'datetime', 'desc' ]];
  }

  if (filterTags && filterTags.length > 0) {
    queryOptions['tags'] = { '$all' : filterTags };
  }

  return {
    sort: sortOptions,
    query: queryOptions,
    sortType: sortType
  };
}

function getGenericLayoutProperties () {
  return {
    isHome: false,
    isTerms: false,
    isMyPics: false,
    isContestInfo: false,
    isHomeSignin: false,
    isHomeSignup: false,
  };
}

// http://code.ciphertrick.com/2016/01/18/salt-hash-passwords-using-nodejs-crypto/
function genRandomString (length){
    return crypto.randomBytes(Math.ceil(length/2))
            .toString('hex') /** convert to hexadecimal format */
            .slice(0,length);   /** return required number of characters */
};

function sha512 (password, salt){
    var hash = crypto.createHmac('sha512', salt); /** Hashing algorithm sha512 */
    hash.update(password);
    var value = hash.digest('hex');

    return {
        salt: salt,
        passwordHash: value
    };
};

function createUser (username, password) {
  var saltHashPassword = sha512(password, genRandomString(16));
  var newUser = {
      username: username,
      hash: saltHashPassword.passwordHash,
      salt: saltHashPassword.salt
  };

  return newUser;
}

function createTempUser (username, password) {
  var user = createUser(username, password);
  user.confirmationUrl = genRandomString(16);
  user.datetime = Date.now();

  return user;
}

function loggedInMiddleWare (req, res, next) {
    if (req.user) {
        next();
    } else {
        res.redirect('/');
    }
}

module.exports = {
	generateUniqueName: generateUniqueName,
  getSortAndFilterConfig: getSortAndFilter,
  saltHashPassword: sha512,
  createUser: createUser,
  createTempUser: createTempUser,
  isLoggedIn: loggedInMiddleWare,
  getGenericLayoutProperties: getGenericLayoutProperties
}