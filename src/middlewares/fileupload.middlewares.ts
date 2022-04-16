import multer from 'multer';
import { autoInjectable } from 'tsyringe';
import { v4 } from "uuid";
import path from 'path';

@autoInjectable()
export class FileUpload {
    
    public UploadFile()
    {

        //const uploadPath = `${__dirname}/uploads`;
        const uploadPath = path.join(__dirname,'../..','uploads')
        const storage = multer.diskStorage({
            destination: (req,file,cb) => {
                cb(null, uploadPath);
            },
            filename: (req,file,cb) => {
                const fileName = `${v4()}${path.extname(file.originalname)}`;
                cb(null,fileName);
            }
        });
        const upload:multer.Multer = multer({
            storage,
            fileFilter: (req, file, cb) => {
                if (file.size > 52428800) {
                    cb(null, false);
                    return cb(new Error('File must not greater than 50mb'));
                } else {
                    cb(null, true);
                }
            }
        });
        return upload;
    }
}