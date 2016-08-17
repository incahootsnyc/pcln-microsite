var im = require("imagemagick");
var fs = require('fs');

var imageFormatter = {
	resize: function (imConfig, writePath, imagePath, pathType, callback) {
        im.resize(imConfig, function (error, stdout, stderr) {
            if (error) {
                callback(error);
            } else {

                fs.writeFile(writePath, stdout, 'binary', function (error) {
                    if (error) {
                        callback(error, null);
                    } else {
                        imagePostObj[pathType] = detailPath;
                        callback();
                    }
                }); 
            }

        });  
    }
};


module.exports = imageFormatter;