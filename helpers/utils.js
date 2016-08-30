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
  var filterTag = req.query.tag && req.query.tag != 'all' ? req.query.tag : undefined;
  var user = req.query.user;

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

  if (filterTag) {
    queryOptions['tags'] = { '$in' : [ filterTag ] };
  }

  if (user) {
    queryOptions['username'] = user.replace('.', ' ');
  }

  return {
    sort: sortOptions,
    query: queryOptions,
    sortType: sortType
  };
}

function getGenericLayoutProperties (selectedUser) {

  return {
    isHome: false,
    isTerms: false,
    isMyPics: false,
    isContestInfo: false,
    isHomeSignin: false,
    title: 'PCLN Photo Contest',
    categories: config.categories,
    selectedUser: selectedUser ? selectedUser.replace('.', ' ') : null,
    isProduction: config.isProduction
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

function createTempUser (username, password) {
  var saltHashPassword = sha512(password, genRandomString(16));
  var atIndex = username.indexOf('@');
  var emailName = username.substring(0, atIndex);
  var nameTokens = emailName.split('.');
  var newUser = {
      username: username,
      firstname: nameTokens[0],
      lastname: nameTokens[1],
      confirmationUrl: genRandomString(16),
      datetime: Date.now(),
      hash: saltHashPassword.passwordHash,
      salt: saltHashPassword.salt
  };

  return newUser;
}

function isValidEmail (email) {
  var atIndex = email.indexOf('@');
  var isPCLN = email.indexOf('priceline.com') > -1;
  var emailName = email.substring(0, atIndex);
  var nameTokens = emailName.split('.');
  var validTokens = nameTokens.length > 1;

  for (var i = nameTokens.length - 1; i >= 0; i--) {
    if (nameTokens[i].trim().length < 1) {
      validTokens = false;
      break;
    }
  };

  return isPCLN && validTokens;
  // return validTokens;
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
  generateRandomString: genRandomString,
  createTempUser: createTempUser,
  isLoggedIn: loggedInMiddleWare,
  getGenericLayoutProperties: getGenericLayoutProperties,
  isValidPricelineEmail: isValidEmail
}