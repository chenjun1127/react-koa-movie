export function isEmptyObject(obj) {
    var name;
    for (name in obj) {
        return false;
    }
    return true;
}
/**
 * @Author   Jone
 * @DateTime 2018-12-19 根据对象属性对数组进行按字母排序
 * @param    {[type]}   ticked [description]
 * @param    {[type]}   name   [description]
 * @return   {[type]}          [description]
 */
export function compare(ticked, name) {
    return function(a, b) {
        var t1 = a[ticked];
        var s1 = a[name];
        var t2 = b[ticked];
        var s2 = b[name];
        if (t1) {
            if (t2) {
                return s1.localeCompare(s2);
            } else {
                return -1;
            }
        } else {
            if (!t2) {
                return s1.localeCompare(s2);
            } else {
                return 1;
            }
        }
    }
}
/**
 * @Author   Jone
 * @DateTime 2018-12-20 针对不同浏览器的解决方案(点击空白地方关闭弹窗)
 * @param    {[type]}   element  [description]
 * @param    {[type]}   selector [description]
 * @return   {[type]}            [description]
 */
export function matchesSelector(element, selector) {
    if (element.matches) {
        return element.matches(selector);
    } else if (element.matchesSelector) {
        return element.matchesSelector(selector);
    } else if (element.webkitMatchesSelector) {
        return element.webkitMatchesSelector(selector);
    } else if (element.msMatchesSelector) {
        return element.msMatchesSelector(selector);
    } else if (element.mozMatchesSelector) {
        return element.mozMatchesSelector(selector);
    } else if (element.oMatchesSelector) {
        return element.oMatchesSelector(selector);
    }
}