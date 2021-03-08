export interface ToyElement {
  style: ToyStyleFinal;
  computedStyle: { [key: string]: { value: string; specificity: number[] } };
  children: ToyElement[];
  tagName: string;
  attributes: { name: string; value: string }[];

  type: 'element' | 'text';
  content: string;
}
/**
 * 最终的样式
 */
export interface ToyStyleFinal {
  flexDirection?: 'row' | 'row-reverse' | 'column' | 'column-reverse';
  display?: 'flex';
  /**控制交叉轴（纵轴）上所有 flex 项目的对齐 */
  alignItems?: 'stretch' | 'flex-start' | 'flex-end' | 'center';
  /** 控制主轴（横轴）上所有 flex 项目的对齐 */
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around';
  flexWrap?: 'nowrap' | 'wrap-reverse';
  /**控制“多条主轴”的 flex 项目在交叉轴的对齐 */
  alignContent?: 'stretch' | 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around';
  width?: null | number;
  height?: null | number;
  order?: number;
  flex?: number;
  /**控制交叉轴（纵轴）上的单个 flex 项目的对齐 */
  alignSelf: 'stretch';
}
export type ToyStyleWrapper = {
  [key in keyof ToyStyleFinal]: ToyStyleFinal[key] | 'auto' | null;
};
export interface MainAndCross {
  /**主轴尺寸 */
  mainSize: 'width' | 'height';
  mainStart: 'left' | 'right' | 'top' | 'bottom';
  mainEnd: 'left' | 'right' | 'top' | 'bottom';
  /** */
  mainSign: number;
  mainBase: number;

  crossSize: 'width' | 'height';
  crossStart: 'left' | 'right' | 'top' | 'bottom';
  crossEnd: 'left' | 'right' | 'top' | 'bottom';
  crossSign: number;
  crossBase: number;
}
