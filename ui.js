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