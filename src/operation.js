const op_prefix = exports.op_prefix = str => {
    const suffix = str.slice(1)
    if (str.startsWith('+')) return {name: suffix, operation: 'add'}
    if (str.startsWith('-')) return {name: suffix, operation: 'subtract'}
    if (str.startsWith('~')) return {name: suffix, operation: 'intersect'}
    if (str.startsWith('^')) return {name: suffix, operation: 'stack'}
    return {name: str, operation: 'add'}
}

exports.operation = (str, choices={}, order=Object.keys(choices)) => {
    let res = op_prefix(str)
    for (const key of order) {
        if (choices[key].includes(res.name)) {
            res.type = key
            break
        }
    }
    return res
}