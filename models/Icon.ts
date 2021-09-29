import Category from "./Category";

interface Icon {
  id_icon: number;
  url: string;
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
