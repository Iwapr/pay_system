/**
 * server/src/lib/pinyin.js - 汉字转拼音首字母工具
 *
 * 用于生成商品、分类等的拼音模糊搜索索引。
 * 对中文字符取拼音首字母，非中文则直接保留。
 */
import pinyin from "pinyin";

/**
 * 获取字符串的拼音大写首字母缩写
 *
 * 示例："可口可乐" → "KKKL"
 *         "Coca-Cola" → "COCA-COLA"
 *
 * @param {string} name - 要转换的字符串
 * @returns {string} 大写拼音首字母缩写
 */
export function getPinyin(name) {
    /**
     * 获取单个汉字的拼音首字母
     * @param {string} str - 单个汉字
     * @returns {string} 拼音首字母（小写）
     */
    function getPinyinFirstLetter(str) {
        return pinyin(str, {
            segment: false,
            style: pinyin["STYLE_NORMAL"]  // 普通拼音（不带声调）
        })[0][0][0];  // 取第一个读音的首字母
    }

    let PINYIN = "";
    for (let i of name) {
        if (/[\u4e00-\u9fa5]+/.test(i)) {
            // 中文字符取拼音首字母
            PINYIN += getPinyinFirstLetter(i);
        } else {
            // 非中文字符直接保留（如字母、数字、符号）
            PINYIN += i;
        }
    }

    return PINYIN.toUpperCase();
}