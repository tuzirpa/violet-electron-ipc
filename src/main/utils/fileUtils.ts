import fs from 'fs/promises';
import path from 'path';

/**
 * 遍历目录，按文件修改时间排序
 * @param dirpath 目录路径
 * @param order 排序顺序，1表示升序，-1表示降序
 */
export async function readdirChronoSorted(dirpath: string, order = 1) {
    const files = await fs.readdir(dirpath);
    const stats = await Promise.all(
        files.map((filename) =>
            fs.stat(path.join(dirpath, filename)).then((stat) => ({ filename, mtime: stat.mtime }))
        )
    );
    return stats
        .sort((a, b) => order * (b.mtime.getTime() - a.mtime.getTime()))
        .map((stat) => stat.filename);
}

/**
 * 获取文件流编号
 */
export function getFlowNum(fileName: string) {
    const num = fileName.match(/\d+/i);
    const index = !num ? 0 : Number(num[0]);
    return index;
}
