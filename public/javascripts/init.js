(function () {

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
  };

  pclnPicMe.getParameterByName = function (name) {
      var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
      return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
  };

  pclnPicMe.updateLocalLikes = function (uniqueName, likesCount, isDetails) {
    var match = this.resultset.find(function (imagePost) { return imagePost.uniqueName == uniqueName; });
    match.likesCount = likesCount;

    if (isDetails) {
      $('img[data-id="' + uniqueName + '"').parent().find('.like-value').text(likesCount);
    }
  };

  pclnPicMe.lazyLoad = function (start) {
    var imgContainers = $('.submissions__img');

    for (var i = start || 0; i < pclnPicMe.resultset.length; i++) {
      loadImagesAsync(pclnPicMe.resultset[i], i);
    };

    function loadImagesAsync (image, i) {
      var imgElem = imgContainers[i];
      var downloadingImage = new Image();
      downloadingImage.onload = function(){
          var _this = this;
          imgElem.className += ' fade-in-on-load';
          imgElem.src = _this.src;
      };

      downloadingImage.src = image.thumbUrl;
    }
  }

  setTimeout(function () {
    pclnPicMe.lazyLoad();
  }, 1000);
  


})();
