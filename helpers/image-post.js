
var imagePost = {
	generate: function (options) {
		return {
			name: options.name,
    		title: options.title,
    		tags: options.tags || [],
    		comments: [],
    		likes: []
		};
	}
};

module.exports = imagePost