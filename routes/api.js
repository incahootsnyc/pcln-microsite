var express = require('express');
var multer  = require('multer');
var router = express.Router();
var upload = multer();

/* GET home page. */
router.post('/api/upload', upload.single('image'), function (req, res) {
	var imageFile = req.file;
	var body = req.body;
	res.json({

	});
});

module.exports = router;
