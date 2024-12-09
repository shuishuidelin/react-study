export enum BrickState {
  normal = "normal",
  choose = "choose",
  success = "success",
  error = "error",
  /*禁用*/ disabled = "disabled",
}

export interface WordInfo {
  id: string
  question: string
  answer: string
  state?: BrickState
  /* 判定是否结束，考虑到多个功能之间块处理逻辑可能不一样，故增加"over"字段用来判断结束逻辑 */
  over?: boolean
}
export interface TextBrickProps {
  text: string
  onChoose: () => void
  action?: {
    state?: BrickState
  }
}
export interface LinkGameConfig {
  pageSize: number
}
