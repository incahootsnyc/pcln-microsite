var pclnPicMe = pclnPicMe || {};

// grab initial data set from global value dropped into index.html template by EJS
pclnPicMe.pageSize = initialResultset.pageSize;
pclnPicMe.resultset = initialResultset.images

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

bindGlobalEvents();

function bindGlobalEvents () {
  bindLikeEvent();
}

function bindLikeEvent () {

    $('#image-list').on('click', '.submissions__like-icon', function () {
      var $_this = $(this);
      var postId = $_this.closest('.submissions__img-container').find('.submissions__img').data('id');

      var requestConfig = {
        url: '/api/like/' + postId,
        type: 'GET',
        success: function (response) {
          if (response.message) {
            //whoops
          } else {
            $_this.siblings('.like-value').text(response.likes);
          }
        }
      };

      $.ajax(requestConfig);
    });
}