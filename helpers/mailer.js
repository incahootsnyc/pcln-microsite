var nodemailer = require('nodemailer');
var config = require('../config');
var transporter = nodemailer.createTransport('smtps://some_email%40gmail.com:password@smtp.gmail.com');

function sendEmail (req, user) {
	var uniqueURL = req.protocol + '://' + req.get('host') + '/account-confirmation/' + user.confirmationUrl;
	var mailOptions = { 
	   from: 'PICME Webmaster <some_email@gmail.com>',
	   to: user.username,
	   subject: 'Picme Account Confirmation', 
	   text: 'Oh Hey! Your account can be activated here:' + uniqueURL,
	   html: '<div style="width: 500px; color: #666666; line-height: 20px; font-size: 14px"><h1 style="font-size: 22px">Hello there, priceline employee!</h1><div style="padding-bottom: 20px">Thanks for registering for the PicMe photo contest. To activate your account and get started, click the magical button below.<a style="padding: 10px 0; display: block; background-color: #0a84c1; color: #fff; text-decoration: none; border-radius: 3px; width: 150px; text-align: center; margin: 20px 0;" href="' + uniqueURL + '">Activate Account</a></div><img src="cid:dustindunes420"/></div>',
	    attachments: [{
        filename: 'dummylogo.png',
        path: config.rootDirectory + '/public/images/dummylogo.png',
        cid: 'dustindunes420'
		}]
	};	

	transporter.sendMail(mailOptions, function (error, info) {
		if (error){
	        console.log(error);
	    } else {
	    	console.log('Message sent: ' + info.response);
	    }
	    
		// transporter.close(); 
	});
}

function sendPasswordEmail (req, user) {
	var uniqueURL = req.protocol + '://' + req.get('host') + '/password-reset/' + user.passwordResetUrl;
	var mailOptions = { 
	   from: 'PICME Webmaster <some_email@gmail.com>',
	   to: user.username,
	   subject: 'Picme Password Reset', 
	   text: 'Oh Hey! Your password can be reset here:' + uniqueURL,
	   html: '<div style="width: 500px; color: #666666; line-height: 20px; font-size: 14px"><h1 style="font-size: 22px">Hello there, priceline employee!</h1><div style="padding-bottom: 20px">To reset your account password, click the magical button below.<a style="padding: 10px 0; display: block; background-color: #0a84c1; color: #fff; text-decoration: none; border-radius: 3px; width: 150px; text-align: center; margin: 20px 0;" href="' + uniqueURL + '">Reset Password</a></div><img src="cid:dustindunes420"/></div>',
	    attachments: [{
        filename: 'dummylogo.png',
        path: config.rootDirectory + '/public/images/dummylogo.png',
        cid: 'dustindunes420'
		}]
	};	

	transporter.sendMail(mailOptions, function (error, info) {
		if (error){
	        console.log(error);
	    } else {
	    	console.log('Message sent: ' + info.response);
	    }
	    
		// transporter.close(); 
	});
}

module.exports = {
	sendConfirmationEmail: sendEmail,
	sendPasswordResetEmail: sendPasswordEmail
}