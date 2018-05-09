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