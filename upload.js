var bucketType;

// Select which AWS bucket to upload to
function selectBucket() {
  bucketType = $('input[name=bucket-type]:checked').val();
  $('.bucket-options').hide();
  if (bucketType === 'public') {
    $('.options-public').show();
  } else {
    $('.options-private').show();
  }
}

// Event handler for uploading file
function uploadFile() {
  if (bucketType === 'public') {
    if (validatePublicOptions()) {
      uploadFileToPublicBucket(
        $('#bucket-name-public').val(),
        $('#bucket-region-public').val());
    }
  } else {
    if (validatePrivateOptions()) {
      uploadFileWithPresignedURL(
        $('#bucket-name-private').val(),
        $('#bucket-region-private').val(),
        $('#bucket-access-key-id').val(),
        $('#bucket-secret-access-key').val());
    }
  }
}

// Ensure all public options are filled in
function validatePublicOptions() {
  if (!$('#bucket-name-public').val() ||
    !$('#bucket-region-public').val()) {
    resetForm();
    showValidationError();
    return false;
  }
  return true;
}

// Ensure all private options are filled in
function validatePrivateOptions() {
  if (!$('#bucket-name-private').val() ||
    !$('#bucket-region-private').val() ||
    !$('#bucket-access-key-id').val() ||
    !$('#bucket-secret-access-key').val()) {
    resetForm();
    showValidationError();
    return false;
  }
  return true;
}

// Upload file to a public S3 bucket
function uploadFileToPublicBucket(bucketName, bucketRegion) {
  // Retrieve file
  const file = document.getElementById('file-upload').files[0];
  if (file) {
    $('.box-content').hide();
    $('.box-uploading').show();
    // Create key for file, using a random string to avoid collisions and
    // saving the file extension
    const objectKey = generateRandomString(16) + getFileExtension(file.name);
    // Upload to AWS
    $.ajax({
      type: 'PUT',
      url: 'http://' + bucketName + '.s3.' + bucketRegion + '.amazonaws.com/' + objectKey,
      contentType: 'binary/octet-stream',
      processData: false,
      data: file
    }).done(function() {
      resetForm();
      showSuccess();
    }).fail(function() {
      resetForm();
      showError();
    });
  }
}

// Upload file to a private S3 bucket, using a presigned URL
function uploadFileWithPresignedURL(
  bucketName, bucketRegion, accessKeyId, secretAccessKey) {
  // Retrieve file
  const file = document.getElementById('file-upload').files[0];
  if (file) {
    $('.box-content').hide();
    $('.box-uploading').show();
    // Create key for file, using a random string to avoid collisions and
    // saving the file extension
    const objectKey = generateRandomString(16) + getFileExtension(file.name);
    // Get presigned S3 URL
    const s3 = new AWS.S3({
      credentials: new AWS.Credentials({
        accessKeyId: accessKeyId, secretAccessKey: secretAccessKey
      }),
      region: bucketRegion
    });
    const params = {
      Bucket: bucketName,
      ContentType: file.type,
      Expires: 60 * 10,
      Key: objectKey
    };
    s3.getSignedUrl('putObject', params, function (err, presignedURL) {
      if (err) {
        console.error('Presigning encountered an error', err);
        showError();
      } else {
        // Upload to AWS
        $.ajax({
          type: 'PUT',
          url: presignedURL,
          contentType: file.type,
          processData: false,
          data: file
        }).done(function() {
          resetForm();
          showSuccess();
        }).fail(function() {
          resetForm();
          showError();
        });
      }
    });
  }
}

// Generates a random string of a specified length
function generateRandomString(length) {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  var random = '';
  for (var i = 0; i < length; i++) {
    random += alphabet.charAt(Math.floor(Math.random() * alphabet.length));
  }
  return random;
}

// Extracts the file extension from a given filename (everything after and
// including ".")
function getFileExtension(filename) {
  return '.' + filename.split('.').pop();
}

// Clear file for the next upload
function resetForm() {
  document.getElementById('file-upload').value = '';
  $('.box-content').hide();
  $('.box-instructions').show();
}

// Shows success message briefly
function showSuccess() {
  $('.success-message').show();
  $('.message-padding').hide();
  setTimeout(function(){
    $('.success-message').fadeOut('slow', function() {
      $('.message-padding').show();
    });
  }, 2000);
}

// Shows error message briefly
function showError() {
  $('.error-message').show();
  $('.message-padding').hide();
  setTimeout(function(){
    $('.error-message').fadeOut('slow', function() {
      $('.message-padding').show();
    });
  }, 2000);
}

// Shows validation error message briefly
function showValidationError() {
  $('.validation-error-message').show();
  $('.message-padding').hide();
  setTimeout(function(){
    $('.validation-error-message').fadeOut('slow', function() {
      $('.message-padding').show();
    });
  }, 2000);
}

$(document).ready(function() {
  // Instantiate bucket type
  selectBucket();

  // Drag-and-drop and click handlers
  $('.box').on('drag dragstart dragend dragover dragenter dragleave drop',
    function(e) {
    e.preventDefault();
    e.stopPropagation();
  }).on('dragover dragenter', function() {
    $('.box').addClass('dragover');
  }).on('dragleave dragend drop', function() {
    $('.box').removeClass('dragover');
  }).on('drop', function(e) {
    $('#file-upload').prop('files', e.originalEvent.dataTransfer.files);
  });

  $('.box').on('click', function(e) {
    $('#file-upload').click();
  });
});