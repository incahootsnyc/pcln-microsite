(function () {

  // check support for drag and drop images
  // https://css-tricks.com/drag-and-drop-file-uploading/
  pclnPicMe.supportsDragAndDrop = (function() {
    var div = document.createElement('div');
    return (('draggable' in div) || ('ondragstart' in div && 'ondrop' in div)) && 'FormData' in window && 'FileReader' in window;
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

  pclnPicMe.redirectHome = function () {
    window.location.href = '/home' + window.location.search;
  };

  pclnPicMe.getParameterByName = function (name) {
      var match = RegExp('[?&]' + name + '=([^&]*)').exec(window.location.search);
      return match && decodeURIComponent(match[1].replace(/\+/g, ' '));
  };

  pclnPicMe.isValidForm = function ($form, validationDictionary, droppedFile, isSubmitting) {
    var errorsToDisplay = [];
    var isValid = false;

    for (var key in validationDictionary) {
      if (key != 'map') {
        var value;

        if (key == 'category[]') {
          value = $form.find('input[name="' + key + '"]:checked').val();
        } else {
          value = $form.find('input[name="' + key + '"]').val();
        }
        
        var error = validationDictionary[key](value);
        if (error) {
          errorsToDisplay.push(error);
        }
      }
    }

    isValid = errorsToDisplay.length == 0;

    if (isSubmitting) {
      validationDictionary.map.forEach(function (errorId) {
        if (errorsToDisplay.indexOf(errorId) > -1) {
          $(errorId).removeClass('ishidden');
        } else {
          $(errorId).addClass('ishidden');
        }
      });
    } else {
      validationDictionary.map.forEach(function (errorId) {
        if (errorsToDisplay.indexOf(errorId) < 0) {
          $(errorId).addClass('ishidden');
        }
      });
    }

    $form.find('button[type="submit"]').toggleClass('disabled', !isValid);

    return isValid;

  };

  pclnPicMe.unbindClickEvents = function ($items) {
    $items.forEach(function ($item) {
      $item.unbind('click');
    });
  };

  pclnPicMe.updateLocalLikes = function (uniqueName, likeResponse, isDetails) {
    var match = this.resultset.find(function (imagePost) { return imagePost.uniqueName == uniqueName; });
    var likeParent = $('img[data-id="' + uniqueName + '"]').parent();

    match.likesCount = likeResponse.likes.length;
    match.likes = likeResponse.likes;

    if (isDetails) {
      likeParent.find('.like-value').text(likeResponse.likes.length);
      pclnPicMe.setLike($('.modal--details__icon-container'), null, likeResponse.hasLiked);
    }

    pclnPicMe.setLike(likeParent.find('.submissions__icon-container'), null, likeResponse.hasLiked);

  };

  pclnPicMe.setLike = function ($likeButton, imageObject, hasLiked) {
    var hasLikedImage = imageObject ? imageObject.likes.indexOf(pclnPicMe.uid) > -1 : hasLiked;

    if (hasLikedImage) {
      $likeButton.addClass('isliked');
    } else {
      $likeButton.removeClass('isliked');
    }
    
  };

  pclnPicMe.lazyLoad = function (start) {
    var imgContainers = $('.submissions__img');
    var likeButtons = $('.submissions__icon-container');

    for (var i = start || 0; i < pclnPicMe.resultset.length; i++) {
      loadImagesAsync(pclnPicMe.resultset[i], i);
      pclnPicMe.setLike($(likeButtons[i]), pclnPicMe.resultset[i]);
    }

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
  };

  if (pclnPicMe.resultset) {
    setTimeout(function () {
      pclnPicMe.lazyLoad();
    }, 1000);
  }
  
  


})();
