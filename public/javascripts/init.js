var pclnPicMe = pclnPicMe || {};

// grab initial data set from global value dropped into index.html template by EJS
pclnPicMe.initData = initialResultset;

// check support for drag and drop images
// https://css-tricks.com/drag-and-drop-file-uploading/
pclnPicMe.supportsDragAndDrop = (function() {
  var div = document.createElement('div');
  return (('draggable' in div) || 
  		('ondragstart' in div && 'ondrop' in div)) 
  		&& 'FormData' in window && 'FileReader' in window;
})();

pclnPicMe.updateQueryStringParameter = function (uri, key, value) {
  var re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
  var separator = uri.indexOf('?') !== -1 ? "&" : "?";
  if (uri.match(re)) {
    return uri.replace(re, '$1' + key + "=" + value + '$2');
  }
  else {
    return uri + separator + key + "=" + value;
  }
}