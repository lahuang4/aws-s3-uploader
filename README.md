# aws-s3-uploader
Simple jQuery-only AWS S3 file uploader.

[See this uploader in action](https://lahuang4.github.io/aws-s3-uploader/).

The core upload functions can be found in [upload.js](https://github.com/lahuang4/aws-s3-uploader/blob/master/upload.js).

## Uploading to a public bucket

Before attempting to upload images to a public S3 bucket:

* Make your bucket public:
  * Click on the bucket, select Permissions > Access Control List.
  * Under Public access, click Everyone. Check the Write objects permission and click Save.
* Set up your bucket's CORS configuration:
  * Click on the bucket, select Permissions > CORS configuration.
  * Enter the following as your CORS configuration:

    ```
    <CORSConfiguration>
      <CORSRule>
        <AllowedOrigin>*</AllowedOrigin>
        <AllowedMethod>GET</AllowedMethod>
        <AllowedMethod>PUT</AllowedMethod>
        <MaxAgeSeconds>3000</MaxAgeSeconds>
        <AllowedHeader>*</AllowedHeader>
      </CORSRule>
    </CORSConfiguration>
    ```

## Uploading to a private bucket

Before attempting to upload images to a private S3 bucket:

* Set up an IAM user that has write permissions to your bucket. Record the user's access key ID and secret access key.
  * The uploader will generate a presigned URL for uploading images, using your credentials.
* Set up your bucket's CORS configuration:
  * Click on the bucket, select Permissions > CORS configuration.
  * Enter the following as your CORS configuration:

    ```
    <CORSConfiguration>
      <CORSRule>
        <AllowedOrigin>*</AllowedOrigin>
        <AllowedMethod>GET</AllowedMethod>
        <AllowedMethod>PUT</AllowedMethod>
        <MaxAgeSeconds>3000</MaxAgeSeconds>
        <AllowedHeader>*</AllowedHeader>
      </CORSRule>
    </CORSConfiguration>
    ```
