/* 
    Author     : Tomaz Dragar
    Mail       : <tomaz@dragar.net>
    Homepage   : http://www.dragar.net
*/

(function ($) {

  $.fn.simpleCropper = function () {

    var image_dimension_x = 569;
    var image_dimension_y = 1136;
    var scaled_width = 0;
    var scaled_height = 0;
    var x1 = 0;
    var y1 = 0;
    var x2 = 0;
    var y2 = 0;
    var current_image = null;
    var aspX = 294;
    var aspY = 310;
    var file_display_area = $('.display-image');
    var ias = null;
    var jcrop_api;
    var bottom_html = "<input type='file' id='fileInput' name='files[]'/><canvas id='myCanvas' style='display:none;'></canvas><div id='modal'></div><div id='preview'><div class='buttons'><div class='cancel'></div><div class='ok'></div></div></div>";
    $('body').append(bottom_html);

    //add click to element
    this.click(function () {
      //aspX = $(this).width();

      $('#fileInput').click();
    });

    this.on('drop', function (event) {

      // Prevent default behavior (Prevent file from being opened)
      event.preventDefault();
      event.stopPropagation();

      var ev = event.originalEvent;
      if (ev.dataTransfer.items) {
        // Use DataTransferItemList interface to access the file(s)
        for (var i = 0; i < ev.dataTransfer.items.length; i++) {
          // If dropped items aren't files, reject them
          if (ev.dataTransfer.items[i].kind === 'file') {
            var file = ev.dataTransfer.items[i].getAsFile();
            var type = file.type;
            if (type.indexOf('image') >= 0) {
              /*  var reader = new FileReader();
                reader.onload = function (e) {
                    $('#blah').attr('src', e.target.result);
                    $('#imgInCard').attr('src', e.target.result);
                }
                reader.readAsDataURL(file);
*/

              imageUpload($('#preview').get(0), true, file);
            } else {
              alert('الرجاء التأكد من صيغة الصورة')
            }


            console.log('... file[' + i + '].name = ' + file.name);
          }
        }
      } else {
        // Use DataTransfer interface to access the file(s)
        for (var i = 0; i < ev.dataTransfer.files.length; i++) {
          console.log('... file[' + i + '].name = ' + ev.dataTransfer.files[i].name);
        }
      }
    })


    $(document).ready(function () {
      //capture selected filename
      $('#fileInput').change(function (click) {
        console.log($('#preview').get(0))
        imageUpload($('#preview').get(0));
        // Reset input value
        $(this).val("");
      });




      //ok listener
      $('.ok').click(function () {
        preview();
        $('#preview').delay(100).hide();
        $('#modal').hide();

        jcrop_api.destroy();
        reset();
      });

      //cancel listener
      $('.cancel').click(function (event) {
        $('#preview').delay(100).hide();
        $('#modal').hide();
        jcrop_api.destroy();
        reset();
      });
    });

    function reset() {
      scaled_width = 0;
      scaled_height = 0;
      x1 = 0;
      y1 = 0;
      x2 = 0;
      y2 = 0;
      current_image = null;
      //aspX = 1;
      //aspY = 1;
      //file_display_area = null;
    }



    function showCoords(c) {
      x1 = c.x;
      y1 = c.y;
      x2 = c.x2;
      y2 = c.y2;
    }

    function preview() {
      // Set canvas
      var canvas = document.getElementById('myCanvas');
      var context = canvas.getContext('2d');

      // Delete previous image on canvas
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Set selection width and height
      var sw = x2 - x1;
      var sh = y2 - y1;


      // Set image original width and height
      var imgWidth = current_image.naturalWidth;
      var imgHeight = current_image.naturalHeight;

      // Set selection koeficient
      var kw = imgWidth / $("#preview").width();
      var kh = imgHeight / $("#preview").height();

      // Set canvas width and height and draw selection on it
      canvas.width = aspX;
      canvas.height = aspY;
      context.drawImage(current_image, (x1 * kw), (y1 * kh), (sw * kw), (sh * kh), 0, 0, aspX, aspY);

      // Convert canvas image to normal img
      var dataUrl = canvas.toDataURL("image/jpeg");
      var imageFoo = document.createElement('img');
      imageFoo.src = dataUrl;

      //adding to card
      $('#imgInCard').attr('src', dataUrl)

      // Append it to the body element
      $('#preview').delay(100).hide();
      $('#modal').hide();
      file_display_area.html('');
      file_display_area.append(imageFoo);

    }

    function imageUpload(dropbox, drop, file) {
      if (drop) {
        var file = file;
      } else {
        var file = $("#fileInput").get(0).files[0];
      }
      //var file = document.getElementById('fileInput').files[0];
      var imageType = /image.*/;

      if (file.type.match(imageType)) {
        var reader = new FileReader();

        reader.onload = function (e) {
          // Clear the current image.
          $('#photo').remove();

          // Create a new image with image crop functionality
          current_image = new Image();
          current_image.src = reader.result;
          current_image.id = "photo";
          current_image.style['maxWidth'] = image_dimension_x + 'px';
          current_image.style['maxHeight'] = image_dimension_y + 'px';
          current_image.onload = function () {
            // Calculate scaled image dimensions
            if (current_image.width > image_dimension_x || current_image.height > image_dimension_y) {
              if (current_image.width > current_image.height) {
                scaled_width = image_dimension_x;
                scaled_height = image_dimension_x * current_image.height / current_image.width;
              }
              if (current_image.width < current_image.height) {
                scaled_height = image_dimension_y;
                scaled_width = image_dimension_y * current_image.width / current_image.height;
              }
              if (current_image.width == current_image.height) {
                scaled_width = image_dimension_x;
                scaled_height = image_dimension_y;
              }
            }
            else {
              scaled_width = current_image.width;
              scaled_height = current_image.height;
            }


            // Position the modal div to the center of the screen
            $('#modal').css('display', 'block');
            var window_width = $(window).width() / 2 - scaled_width / 2 + "px";
            var window_height = $(window).height() / 2 - scaled_height / 2 + "px";

            // Show image in modal view
            $("#preview").css("top", window_height);
            $("#preview").css("left", window_width);
            $('#preview').show(500);


            // Calculate selection rect
            var selection_width = 0;
            var selection_height = 0;

            var max_x = Math.floor(scaled_height * aspX / aspY);
            var max_y = Math.floor(scaled_width * aspY / aspX);


            if (max_x > scaled_width) {
              selection_width = scaled_width;
              selection_height = max_y;
            }
            else {
              selection_width = max_x;
              selection_height = scaled_height;
            }

            ias = $(this).Jcrop({
              onSelect: showCoords,
              onChange: showCoords,
              bgColor: '#747474',
              bgOpacity: .4,
              aspectRatio: aspX / aspY,
              setSelect: [0, 0, selection_width, selection_height]
            }, function () {
              jcrop_api = this;
            });
          }

          // Add image to dropbox element
          dropbox.appendChild(current_image);
        }
        reader.readAsDataURL(file);

      } else {
        dropbox.innerHTML = "File not supported!";
      }
    }
    $(window).resize(function () {
      // Position the modal div to the center of the screen
      var window_width = $(window).width() / 2 - scaled_width / 2 + "px";
      var window_height = $(window).height() / 2 - scaled_height / 2 + "px";

      // Show image in modal view
      $("#preview").css("top", window_height);
      $("#preview").css("left", window_width);
    });
  }
}(jQuery));

