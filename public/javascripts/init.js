var pclnPicMe = pclnPicMe || {};

// check support for drag and drop images
// https://css-tricks.com/drag-and-drop-file-uploading/
pclnPicMe.supportsDragAndDrop = (function() {
  var div = document.createElement('div');
  return (('draggable' in div) || 
  		('ondragstart' in div && 'ondrop' in div)) 
  		&& 'FormData' in window && 'FileReader' in window;
})();