"use client"

import {
  Alert,
  Button,
  Slider,
  Snackbar,
  SnackbarCloseReason,
} from "@mui/material"
import * as React from "react"

export default function Goal() {
  function valuetext(value: number) {
    return `${value}道`
  }
  const minDistance = 5
  const [goalValue, setGoalValue] = React.useState<number[]>([20, 37])

  const handleGoalValue = (
    event: Event,
    newValue: number | number[],
    activeThumb: number,
  ) => {
    if (!Array.isArray(newValue)) {
      return
    }

    if (newValue[1] - newValue[0] < minDistance) {
      if (activeThumb === 0) {
        const clamped = Math.min(newValue[0], 100 - minDistance)
        setGoalValue([clamped, clamped + minDistance])
      } else {
        const clamped = Math.max(newValue[1], minDistance)
        setGoalValue([clamped - minDistance, clamped])
      }
    } else {
      setGoalValue(newValue as number[])
    }
  }
  const [open, setOpen] = React.useState(false)

  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === "clickaway") {
      return
    }

    setOpen(false)
  }

  const submit = () => {
    setOpen(true)
  }
  return (
    <div className="p-3 flex flex-col">
      <h2>你的目标</h2>
      <div>最少完成 {goalValue[0]} 道题</div>
      <div>争取完成 {goalValue[1]} 道题</div>
      <Slider
        getAriaLabel={() => "Minimum distance shift"}
        value={goalValue}
        step={5}
        onChange={handleGoalValue}
        valueLabelDisplay="auto"
        getAriaValueText={valuetext}
        disableSwap
      />
      <Button variant={"contained"} className="w-full" onClick={submit}>
        确立目标
      </Button>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
        <Alert
          onClose={handleClose}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          你的目标已更新!
        </Alert>
      </Snackbar>
    </div>
  )
}
