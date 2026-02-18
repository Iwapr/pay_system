/**
 * server/src/lib/merge.js - 对象展开合并工具
 *
 * 将多个对象浅层合并到第一个对象中，后面的对象会覆盖前面的同名属性。
 * 主要用于合并 commonEnv 和 环境特定配置。
 */

/**
 * 将多个对象浅层合并
 * @param {Object}    obj1     - 基础对象
 * @param {...Object} objList  - 覆盖对象，越后面的优先级越高
 * @returns {Object} 合并后的新对象（不修改原始对象）
 */
export function merge(obj1, ...objList) {
    let result = { ...obj1 };

    for (let obj of objList) {
        result = {
            ...result,
            ...obj
        };
    }

    return result;
}

export default merge;