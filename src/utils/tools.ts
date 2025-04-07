/**
 * 从给定的数组中随机选择指定数量的元素。
 *
 * @param keywords - 要从中选择元素的数组。
 * @param count - 要选择的元素数量。
 * @returns 包含随机选择的元素的数组。
 *
 * @example
 * const fruits = ['apple', 'banana', 'cherry', 'date'];
 * const randomFruits = randomKeyword(fruits, 2);
 * console.log(randomFruits); // 输出可能是 ['banana', 'cherry']
 */
export const randomKeyword = <T = unknown>(keywords: T[], count: number) => {
  const _keywords = [...keywords]
  if (count > _keywords.length) return _keywords
  const temp = []
  for (let i = 0; i < count; i++) {
    const randomIndex = Math.floor(Math.random() * _keywords.length)
    if (_keywords[randomIndex]) temp.push(_keywords[randomIndex])
    _keywords.splice(randomIndex, 1)
  }
  return temp
}
