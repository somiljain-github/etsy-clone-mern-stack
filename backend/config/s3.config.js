const fs = require("fs");
const S3 = require("aws-sdk/clients/s3");

const bucketName = process.env.S3BUCKET;
const region = process.env.S3REGION;
const accessKeyId = process.env.S3ACCESSKEY;
const secretAccessKey = process.env.S3SECRET;

const s3 = new S3({
  region,
  accessKeyId,
  secretAccessKey,
});

if (s3) console.log("Connected to : ", s3.endpoint.host);

// uploads a file to s3
function uploadFile(file) {
  const fileStream = fs.createReadStream(file.path);

  const uploadParams = {
    Bucket: bucketName,
    Body: fileStream,
    Key: file.filename,
  };
  //console.log(bucketName)
  return s3.upload(uploadParams).promise();
}
exports.uploadFile = uploadFile;

// downloads a file from s3
function getFileStream(fileKey) {
  const downloadParams = {
    Key: fileKey,
    Bucket: bucketName,
  };

  return s3.getObject(downloadParams).createReadStream();
}
exports.getFileStream = getFileStream;
