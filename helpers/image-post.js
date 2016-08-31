var s3 = require('./s3');
var config = require('../config');

var imagePost = {
	generateForDB: function (name, postBody, user) {
		return {
			uid: user._id,
			username: user.firstname + ' ' + user.lastname,
			name: name,
    		location: postBody.location,
    		tags: postBody.category || [],
    		datetime: postBody.datetime,
    		likes: [],
    		likesCount: 0
		};
	},
	mapForClient: function (imageObj, imageObjIndex, userName) {
		var s3bucket = s3.getBucket();
		var params = { Key: imageObj.name };
		var userIsAdmin = config.adminList.indexOf(userName.toLowerCase()) > -1;

		return {
			uid: imageObj.uid.toString(),
			id: imageObj._id.toString(),
			username: imageObj.username,
			thumbUrl: imageObj.thumbNailPath || s3bucket.getSignedUrl('getObject', params),
			detailsUrl: imageObj.detailPath || s3bucket.getSignedUrl('getObject', params),
			downloadUrl: userIsAdmin ? s3bucket.getSignedUrl('getObject', params) : null,
			location: imageObj.location,
			uniqueName: imageObj.name,
			datetime: imageObj.datetime,
			tags: imageObj.tags,
			likes: imageObj.likes,
			likesCount: imageObj.likesCount,
			index: imageObjIndex
		};
	} 
};

module.exports = imagePost