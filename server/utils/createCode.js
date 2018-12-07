/**
 * Created by ChenJun on 2018/12/6
 */
const createCode = () => {
    //数字:48-57;unicode编码
    const number = rangeArray(48, 57);
    //大写字母:65-90;unicode编码
    const upperLetter = rangeArray(65, 90);
    //小写字母:97-122;unicode编码
    const lowerLetter = rangeArray(97, 122);
    // for (let i = 97; i < 122; codes.push(i), i++) ;
    const codes = [...number, ...upperLetter, ...lowerLetter];
    const arr = [];
    for (let i = 0; i < 4; i++) {
        let index = Math.floor(Math.random() * codes.length);
        let char = String.fromCharCode(codes[index]);
        arr.push(char);
    }
    return arr.join("");
};
const rangeArray = (start, end) => Array(end - start + 1).fill(0).map((v, i) => i + start);
module.exports = createCode;