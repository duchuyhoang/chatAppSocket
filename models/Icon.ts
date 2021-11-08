import Category from "./IconCategory";

interface Icon {
  id_icon: number;
  iconUrl: string;
  delFlag: number;
  blocksOfWidth: number;
  blocksOfHeight: number;
  width: number;
  height: number;
  totalFrames: number;
  createAt: Date|null;
  category:Category;
}


export default Icon;
