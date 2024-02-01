import s3 from 'src/config/aws';

const deleteFile = async (url: string) => {
  await s3
    .deleteObject({
      Bucket: process.env.BLACK_BLAZE_BUCKET,
      Key: url.split('/').pop(),
    })
    .promise();
};

export default deleteFile;
