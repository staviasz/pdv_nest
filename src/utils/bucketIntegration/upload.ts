import s3 from 'src/config/aws';

const upload = async (file: Express.Multer.File) => {
  const fileResponse = await s3
    .upload({
      Bucket: process.env.BLACK_BLAZE_BUCKET,
      Key: file.originalname,
      Body: file.buffer,
      ContentType: file.mimetype,
    })
    .promise();

  return fileResponse.Location;
};

export default upload;
