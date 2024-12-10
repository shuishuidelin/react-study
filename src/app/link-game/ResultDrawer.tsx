import { Button } from "@mui/material"
interface Props {
  onSubmit: () => void
}
export default function ResultDrawer({ onSubmit }: Props) {
  return (
    <div className="min-h-52 flex flex-col p-3">
      <div className="flex-1">太棒了，你完成了本章节</div>
      <Button variant={"contained"} color="success" onClick={onSubmit}>
        去结算
      </Button>
    </div>
  )
}
