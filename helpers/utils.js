var config = require('../config');


function generateGuid() {
  function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
    s4() + '-' + s4() + s4() + s4();
}

function generateUniqueName (fileName) {
	var startOfFileExtension = fileName.lastIndexOf('.');
	var imageNameWithoutExtension = fileName.substring(0, startOfFileExtension);
	var fileExtension = fileName.substring(startOfFileExtension, fileName.length);

	return imageNameWithoutExtension + generateGuid() + fileExtension;
}

function getSortAndFilter (req, pageNum) {
  var sortType = req.query.sort ? req.query.sort  : 'newest';
  var filterTags = req.query.tags ? req.query.tags.split(',') : undefined;

  var sortOptions = {  'limit': config.itemsPerPage };
  var queryOptions = {};

  if (pageNum) {
    sortOptions['skip'] = (config.itemsPerPage * (pageNum-1));
  }

  if (sortType == 'popular') {
    sortOptions['sort'] = [[ 'likesCount', 'desc' ]];
  } else {
    sortOptions['sort'] = [[ 'datetime', 'desc' ]];
  }

  if (filterTags && filterTags.length > 0) {
    queryOptions['tags'] = { '$in' : filterTags };
  }

  return {
    sort: sortOptions,
    query: queryOptions,
    sortType: sortType
  };
}

module.exports = {
	generateUniqueName: generateUniqueName,
  getSortAndFilterConfig: getSortAndFilter
}