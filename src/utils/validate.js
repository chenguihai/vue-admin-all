export function isvalidUsername(str) {
    //const valid_map = ['admin123', 'test123','admin_fu']
    //return valid_map.indexOf(str.trim()) >= 0
    const valid_map = /^[a-zA-Z0-9_-]{6,16}$/;
    return valid_map.test(str.trim())
}

/* 合法uri*/
export function validateURL(textval) {
    const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/
    return urlregex.test(textval)
}

/* 小写字母*/
export function validateLowerCase(str) {
    const reg = /^[a-z]+$/
    return reg.test(str)
}

/* 大写字母*/
export function validateUpperCase(str) {
    const reg = /^[A-Z]+$/
    return reg.test(str)
}

/* 大小写字母*/
export function validatAlphabets(str) {
    const reg = /^[A-Za-z]+$/
    return reg.test(str)
}

//数字或浮点数
export function validatNum(str) {
    const reg = /^\d+(\.\d+)?$/
    return reg.test(str)
}

export function phoneRegExp(str) {
    const reg = /^1\d{10}$/
    return reg.test(str)
}

export function firstLetterRegExp(str) {
    const reg = /^[A-Za-z]$/
    return reg.test(str)
}
export function pwdRegExp(str) {
    // const reg = /^[A-Za-z0-9~!@#$%^&*_-]{6,16}$/
    // const reg = /^(?![\d]+$)(?![a-zA-Z]+$)(?![!#$%^&*]+$)[\da-zA-Z~!@#$%^&*_-]{6,16}$/
    const reg = /(?!^(\d+|[a-zA-Z]+|[~!@#$%^&*?]+)$)^[\w~!@#$%^&*?]{8,32}$/
    return reg.test(str)
}