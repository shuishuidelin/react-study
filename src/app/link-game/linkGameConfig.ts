import { LinkGameConfig } from "@/app/link-game/typing"

export function linkGameConfig() {
  return new Promise<LinkGameConfig>((resolve) => {
    resolve({
      pageSize: 5,
    })
  })
}
