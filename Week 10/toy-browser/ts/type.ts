export interface ToyElement {
  style: ToyStyleFinal;
  computedStyle: { [key: string]: { value: string; specificity: number[] } };
  children: ToyElement[];
  tagName: string;
  attributes: { name: string; value: string }[];

  type: "element" | "text";
  content: string;
}
/**
 * 最终的样式
 */
export interface ToyStyleFinal {
  flexDirection?: "row" | "row-reverse" | "column" | "column-reverse";
  display?: "flex";
  alignItems?: "stretch";
  justifyContent?: "flex-start";
  flexWrap?: "nowrap" | "wrap-reverse";
  alignContent?: "stretch";
  width?: null | number;
  height?: null | number;
}
export type ToyStyleWrapper = {
  [key in keyof ToyStyleFinal]: ToyStyleFinal[key] | "auto" | null;
};
