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

module.exports = {
	generateUniqueName: generateUniqueName
}