import * as aws from 'aws-sdk';

const endpoint = new aws.Endpoint(process.env.BLACK_BLAZE_ENDPOINT);

const s3 = new aws.S3({
  endpoint,
  credentials: {
    accessKeyId: process.env.BLACK_BLAZE_KEY_ID,
    secretAccessKey: process.env.BLACK_BLAZE_APP_KEY,
  },
});

export default s3;
