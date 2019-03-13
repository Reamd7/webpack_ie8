export type point = 'tl' | 'tr' | 'tc' | 'bl' | 'br' | 'bc' | 'cl' | 'cr' | 'cc'
export type Region = {
  width: number
  height: number
  left: number
  top: number
}
export type Pos = {
  left: number
  top: number
}
export type Rect = {
  right: number
  bottom: number
  left: number
  top: number
}
export type Offest = [number,number]

export type Dir = "top" | "bottom" | "right" | "left";

export type StyleName = Exclude<keyof CSSStyleDeclaration, number | "parentRule" | "length">;