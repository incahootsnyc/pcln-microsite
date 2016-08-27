var s3 = require('./s3');

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
	mapForClient: function (imageObj, imageObjIndex) {
		var s3bucket = s3.getBucket();
		var params = { Key: imageObj.name };

		return {
			uid: imageObj.uid.toString(),
			username: imageObj.username,
			thumbUrl: imageObj.thumbNailPath || s3bucket.getSignedUrl('getObject', params),
			detailsUrl: imageObj.detailPath || s3bucket.getSignedUrl('getObject', params),
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