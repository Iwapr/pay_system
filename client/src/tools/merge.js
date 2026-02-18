/**
 * client/src/tools/merge.js - 对象展开合并工具
 *
 * 将多个对象浅层合并，后面的对象覆盖前面的同名属性。
 *
 * @param {Object}    obj1    - 基础对象
 * @param {...Object} objList - 覆盖对象
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