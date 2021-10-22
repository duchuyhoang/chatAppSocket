import { Request, Response, Express, NextFunction } from "express";
import {
  iconFolder,
  imageFolder,
  serverAddress,
  HOST_NAME,
  UNAUTHORIZED,
} from "../common/constants";
import { randomId, getExtension } from "../common/functions";
import { UserInConversationDao } from "../Dao/UserInConversationDao";
import { DecodedUser } from "../models/User";
import { IconCreateRequest, IconInfo } from "../TS/File";

const checkUserExist = async (
  req: IconCreateRequest,
  res: Response,
  next: NextFunction
) => {
  const { id_conversation = null } = req.params;
  const userInfo: DecodedUser = res.locals.decodeToken;
  try {
    const userInConversationDao = new UserInConversationDao();
    const isUserExist =
      await userInConversationDao.checkUserExistInConversation(
        userInfo.id_user.toString(),
        id_conversation || ""
      );
      console.log(isUserExist);
      
    if (isUserExist) next();
    else res.status(UNAUTHORIZED).json({ message: "Unauthorized" });
  } catch (err) {
    res.status(UNAUTHORIZED).json({ message: "Unauthorized" });
  }
};

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
    originalFile: file,
    imgId,
    imgLink,
    newName,
    mimetype: file.mimetype,
    buffer: file.buffer,
  };
}

const handleChangeIconName = (
  req: IconCreateRequest,
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
  } else if (requestFile?.multipleRoomImage) {
    const fileList = requestFile.multipleRoomImage;
    fileList.forEach((file: Express.Multer.File, index: number) => {
      let info = handleRenameIconFile(req, file);
      iconInfo.push(info);
    });
  }

  // Pass img info forr the next middleware
  req.iconInfo = iconInfo.length === 0 ? null : iconInfo;

  next();
  // res.status(200).json({ status: 200, message: "Ok" });
};

export { handleRenameIconFile, handleChangeIconName,checkUserExist };
