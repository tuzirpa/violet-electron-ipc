import { v4 as randomUUID } from 'uuid';

/**
 * 延时
 * @param time
 */
export function sleep(time: number) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

/**
 * 延时
 * @param time
 */
export function sleepRandom(minTime: number, maxTime: number) {
    return new Promise((resolve) =>
        setTimeout(resolve, Math.floor(Math.random() * (maxTime - minTime + 1) + minTime))
    );
}

export function uuid() {
    return randomUUID().replace(/-/g, '');
}

/**
 * 深拷贝对象 不拷贝原型链
 * @param obj 对象
 * @returns
 */
export function copyObject(obj: any) {
    return JSON.parse(JSON.stringify(obj));
}
