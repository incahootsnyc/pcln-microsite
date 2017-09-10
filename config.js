var config = {
	rootDirectory: __dirname,
	itemsPerPage: 20,
	resetPassword: process.env.RESET_PASSWORD || 'reset_password',
	cookiePassword: process.env.COOKIE_PASSWORD || 'cookie_password',
	isProduction: process.env.NODE_ENVIRONMENT == 'PRODUCTION',
	mongoUrl: 'mongodb://localhost:27017/pcln-microsite',
	adminList: [
		'v.geyvandov@gmail.com',
		'tanya.brassie@utexas.edu'
	],
	categories: {
		'all'	   : 'All',
		'getaway'  : 'Hotel Getaway',
		'flight'   : 'In Flight',
		'roadtrip' : 'Road Trip',
		'city'     : 'Out in the City',
		'moments'  : 'Moments',
		'holidays' : 'Holidays & Get Togethers',
		'vacays'   : 'Summer Vacays',
		'offpath'  : 'Off the Beaten Path'
	}
};

module.exports = config;