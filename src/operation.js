const op_prefix = exports.op_prefix = str => {

    const prefix = str[0]
    const suffix = str.slice(1)
    const result = {name: suffix, operation: 'add'}

    if (prefix == '+') ; // noop
    else if (prefix == '-') result.operation = 'subtract'
    else if (prefix == '~') result.operation = 'intersect'
    else if (prefix == '^') result.operation = 'stack'
    else result.name = str // no prefix, so the name was the whole string

    return result
}

exports.operation = (str, choices={}, order=Object.keys(choices)) => {
    let res = op_prefix(str)
    for (const key of order) {
        if (choices[key].includes(res.name)) {
            res.what = key
            break
        }
    }
    return res
}