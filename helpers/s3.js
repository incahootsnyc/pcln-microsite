var AWS = require('aws-sdk');
var state = {
	s3Bucket: null
};

var s3 = {
	create: function () {
		AWS.config.update({
			region: 'us-east-1',
		    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
		    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
		});

		state.s3Bucket = new AWS.S3({
			params: {
				Bucket: 'pcln-images-bucket'
			}
		});
	},

	getBucket: function (argument) {
		return state.s3Bucket;
	}
}


module.exports = s3;