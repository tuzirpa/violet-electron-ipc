/**
 * 取到min到max(不含)之间的随机数
 * @param min 最小值
 * @param max 最大值(不包含)
 * @returns {number}
 */
export function getRandom(min: number, max: number): number {
    // 因为用Math.floor()向下取整,所以((max - min) + 1)
    let initNum = Math.random() * (max - min + 1);
    return Math.floor(initNum + min);
}
