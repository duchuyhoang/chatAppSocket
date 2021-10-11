import multer from "multer";
import path from "path";
import { Request, Response, NextFunction} from "express";
import { IconInfo } from "../TS/File";
import { getExtension, randomId } from "./functions";
import { HOST_NAME, iconFolder } from "./constants";

export interface UploadMulterMemoryFile{
    file: Express.Multer.File,
    newName:string
}

export const iconUpload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fieldSize: 20000, //TODO: Check if this size is enough
      // TODO: Change this line after compression
      fileSize: 1500000, // 150 KB for a 1080x1080 JPG 90
    },
    fileFilter: function (req, file, cb) {
        checkImageType(file, cb);
    },
  });
  
  export const imageUpload = multer({
    storage: multer.memoryStorage(),
    limits: {
      fieldSize: 20000, //TODO: Check if this size is enough
      // TODO: Change this line after compression
      fileSize: 1500000, // 150 KB for a 1080x1080 JPG 90
    },
    fileFilter: function (req, file, cb) {
        checkImageType(file, cb);
    },
  });



  function checkImageType(file: Express.Multer.File, cb: any) {  
    const filetypes = /jpeg|jpg|png/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
  
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Accept only jpeg jpg png"));
    }
  }

  function handleRenameIconFile(
    req: Request,
    file: Express.Multer.File
  ): IconInfo {
    const fileExtension = getExtension(file.originalname);
    const newName = randomId(50) + "." + fileExtension;
    const destination = `./../assets${iconFolder}`;
  
    const imgLink = req.protocol + "://" + HOST_NAME + iconFolder + newName;
  
    const imgId = randomId(50);
  
  //   fs.rename(
  //     path.join(__dirname, destination + file.originalname),
  //     path.join(__dirname, destination + newName),
  //     (err) => {}
  //   );
  
    return {
      originalFile:file,
      imgId,
      imgLink,
      newName,
      mimetype:file.mimetype,
      buffer:file.buffer
    };
  }


export const handleUploadFile= (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    let iconInfo: IconInfo[] = [];
    const requestFile: any = req?.files;
    // typeof req?.files==="object" &&
    // Form data and multer using field in files
    if (requestFile?.singleImage) {
      const singleFile = requestFile.singleImage[0];
  
      let info = handleRenameIconFile(req, singleFile);
      iconInfo.push(info);
      // const newName=random.randonString(36);
      // const fileExtension=getExtension(singleFile.originalname)
  
      // fs.rename(path.join(__dirname,"./../assets/roomImg/"+singleFile.originalname))
    } else if (requestFile?.multipleImage) {
      const fileList = requestFile.multipleImage;
      fileList.forEach((file: Express.Multer.File, index: number) => {
        iconInfo.push(handleRenameIconFile(req, file));
      });
    }
  
    // Pass img info forr the next middleware
    res.locals.imageInfo=iconInfo.length === 0 ? null : iconInfo;
    
    next();
  };