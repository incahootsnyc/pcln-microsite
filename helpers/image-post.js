var s3 = require('./s3');

var imagePost = {
	generateForDB: function (options) {
		return {
			name: options.name,
    		location: options.location,
    		tags: options.tags || [],
    		datetime: options.datetime,
    		likes: []
		};
	},
	mapForClient: function (imageObj) {
		var s3bucket = s3.getBucket();
		var params = { Key: imageObj.name };

		return {
			thumbUrl: imageObj.thumbNailPath || s3bucket.getSignedUrl('getObject', params),
			detailsUrl: imageObj.detailPath || s3bucket.getSignedUrl('getObject', params),
			location: imageObj.location,
			uniqueName: imageObj.name,
			datetime: imageObj.datetime,
			tags: imageObj.tags,
			likes: imageObj.likes
		};
	} 
};

module.exports = imagePost