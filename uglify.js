var UglifyJS = require('uglify-js');
var fs = require('fs');
var files = [
	'./public/javascripts/exif.js',
	'./public/javascripts/header.js',
	'./public/javascripts/init.js',
	'./public/javascripts/likes-event-handler.js',
	'./public/javascripts/upload-event-handler.js',
	'./public/javascripts/update-event-handler.js',
	'./public/javascripts/details-event-handler.js',
	'./public/javascripts/modals.js',
	'./public/javascripts/sort-and-filter.js',
	'./public/javascripts/infinite-scroll.js'
];

var appResult = UglifyJS.minify(files, {
	mangle: true
});

var accounResult = UglifyJS.minify('./public/javascripts/account.js', {
	mangle: true
});
 
fs.writeFile('public/javascripts/release/app.min.js', appResult.code, function(err) {
    if(err) {
        console.log(err);
    } else {
        console.log("File was successfully saved.");
    }
});

fs.writeFile('public/javascripts/release/account.min.js', accounResult.code, function(err) {
    if(err) {
        console.log(err);
    } else {
        console.log("File was successfully saved.");
    }
});