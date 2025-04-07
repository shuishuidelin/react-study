import { isClient } from "@/utils/systemUtil"
interface CaCheWrapper {
  value: unknown
  expires: number
  /** 是否开启有效期  */
  hasExpiration: boolean
}
/** 字符串类型标识位 */
const STRING_FLAG = "__STRING_FLAG__"
const _setCacheItem = (key: string, value: unknown) => {
  if (!isClient()) return
  let realValue = value
  if (typeof value === "object" && value !== null) {
    try {
      realValue = JSON.stringify(value) as string
    } catch {
      realValue = value.toString()
    }
  } else {
    realValue =
      typeof realValue === "string" ? STRING_FLAG + realValue : realValue
  }
  localStorage.setItem(key, realValue as string)
}
/**
 * 缓存localStorage,支持设置缓存有效时间
 * @param key key
 * @param value value
 * @param options
 * @param options.days 有效时间（天）
 * @return value
 * */
export const setCacheItem = (
  key: string,
  value: unknown,
  options?: { days?: number },
) => {
  const { days } = options || {}
  if (days && days > 0) {
    value = {
      value: value,
      expires: Date.now() + days * 24 * 3600 * 1000,
      hasExpiration: true,
    }
  }
  _setCacheItem(key, value)
}
/**
 * 类型守卫：检查是否为 CaCheWrapper 类型
 */
const isCaCheWrapper = (obj: unknown): obj is CaCheWrapper => {
  return (
    typeof obj === "object" &&
    obj !== null &&
    "value" in obj &&
    "expires" in obj &&
    "hasExpiration" in obj
  )
}

/**
 * 获取缓存值，如果缓存失效则返回undefined
 */
export const getCacheItem = <T>(key: string): T | undefined => {
  if (!isClient()) return undefined

  const itemValue = localStorage.getItem(key)
  if (!itemValue) return undefined
  let realV: unknown
  try {
    realV = JSON.parse(itemValue)
  } catch {
    realV = itemValue
  }

  if (isCaCheWrapper(realV)) {
    if (realV.hasExpiration && Date.now() > realV.expires) {
      removeCacheItem(key)
      return undefined
    }
    return realV.value as T | undefined
  }
  if (typeof realV === "string" && realV.startsWith(STRING_FLAG)) {
    realV = realV.slice(STRING_FLAG.length)
  }
  return realV as T | undefined
}
export const removeCacheItem = (key: string) => {
  if (!isClient()) return
  localStorage.removeItem(key)
}
