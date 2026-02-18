/**
 * client/src/tools/copyObj.js - 深拷贝工具
 *
 * 递归对普通对象和数组进行深拷贝。
 * 注意：仅支持普通对象和数组，Date/RegExp/Map/Set 等类型直接返回原引用。
 *
 * @param {*} obj - 要拷贝的数据结构
 * @returns {*}   深拷贝后的新对象，原始类型（null/number/string）直接返回
 */
export default function copyObj(obj) {
    // null 和 undefined 直接返回
    if (obj === null || obj === undefined) {
        return obj;
    }
    if (Array.isArray(obj)) {
        // 数组：递归拷贝每个元素
        return obj.map(i => copyObj(i));
    } else if (obj.constructor === Object) {
        // 普通对象：递归拷贝每个属性值
        let new_obj = {};
        const keys = Object.keys(obj);
        for (let key of keys) {
            const value = obj[key];
            new_obj[key] = copyObj(value);
        }
        return new_obj;
    } else {
        // 其他类型（如 Date、number、string）直接返回原引用
        return obj;
    }
}

