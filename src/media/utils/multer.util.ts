import { diskStorage } from 'multer';
import { config } from 'dotenv';

config();
export const storage = diskStorage({
  destination: function (req, file, cb) {
    cb(null, `./${process.env.MEDIA_FOLDER}`);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(
      null,
      file.fieldname + '-' + uniqueSuffix + '.' + file.mimetype.split('/')[1],
    );
  },
});
