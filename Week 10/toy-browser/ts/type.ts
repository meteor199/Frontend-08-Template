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
  alignItems?: 'stretch' | 'flex-start' | 'flex-end' | 'center';
  justifyContent?: 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around';
  flexWrap?: 'nowrap' | 'wrap-reverse';
  alignContent?: 'stretch' | 'flex-start' | 'flex-end' | 'center' | 'space-between' | 'space-around';
  width?: null | number;
  height?: null | number;
  order?: number;
  flex?: number;
  alignSelf: 'stretch';
}
export type ToyStyleWrapper = {
  [key in keyof ToyStyleFinal]: ToyStyleFinal[key] | 'auto' | null;
};
export interface MainAndCross {
  mainSize: 'width' | 'height';
  mainStart: 'left' | 'right' | 'top' | 'bottom';
  mainEnd: 'left' | 'right' | 'top' | 'bottom';
  mainSign: number;
  mainBase: number;
  crossSize: 'width' | 'height';
  crossStart: 'left' | 'right' | 'top' | 'bottom';
  crossEnd: 'left' | 'right' | 'top' | 'bottom';
  crossSign: number;
  crossBase: number;
}
