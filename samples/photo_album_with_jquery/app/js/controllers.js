'use strict';

/* Controllers */

var photoAlbumControllers = angular.module('photoAlbumControllers', []);

photoAlbumControllers.controller('photoUploadCtrlJQuery', ['$scope', '$rootScope', '$routeParams', '$location', 'cloudinary',
  /* Uploading with jQuery File Upload */
  function($scope, $rootScope, $routeParams, $location, cloudinary) {
    $scope.files = {};
    $scope.updateTitle = function(){
      var uploadParams = $scope.widget.fileupload('option', 'formData');
      uploadParams["context"] = "photo=" + $scope.title;
      $scope.widget.fileupload('option', 'formData', uploadParams);
    };

    $scope.widget = $(".cloudinary_fileupload")
      .unsigned_cloudinary_upload(cloudinary.config().upload_preset, {tags: 'myphotoalbum', context:'photo='}, {
        // Uncomment the following lines to enable client side image resizing and validation.
        // Make sure cloudinary/processing is included the js file
        //disableImageResize: false,
        //imageMaxWidth: 800,
        //imageMaxHeight: 600,
        //acceptFileTypes: /(\.|\/)(gif|jpe?g|png|bmp|ico)$/i,
        //maxFileSize: 20000000, // 20MB
        dropZone: "#direct_upload_jquery",
        start: function (e) {
          $scope.status = "Starting upload...";
          $scope.files = {};
          $scope.$apply();
        },
        fail: function (e, data) {
          $scope.status = "Upload failed";
          $scope.$apply();
        }
      })
      .on("cloudinaryprogress", function (e, data) {
        var name = data.files[0].name;
        var file = $scope.files[name] || {};
        file.progress = Math.round((data.loaded * 100.0) / data.total);
        file.status = "Uploading... " + file.progress + "%";
        $scope.files[name] = file;
        $scope.$apply();
        })
      .on("cloudinaryprogressall", function (e, data) {
        $scope.progress = Math.round((data.loaded * 100.0) / data.total);
        $scope.status = "Uploading... " + $scope.progress + "%";
        $scope.$apply();
      })
      .on("cloudinarydone", function (e, data) {
        $rootScope.photos = $rootScope.photos || [];
        data.result.context = {custom: {photo: $scope.title}};
        $scope.result = data.result;
        var name = data.files[0].name;
        var file = $scope.files[name] ||{};
        file.name = name;
        file.result = data.result;
        $scope.files[name] = file;
        $rootScope.photos.push(data.result);
        $scope.$apply();
      }).on("cloudinaryfail", function(e, data){
          var file = $scope.files[name] ||{};
          file.name = name;
          file.result = data.result;
          $scope.files[name] = file;

        });
  }]);