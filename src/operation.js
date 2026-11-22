const prefix_operations = {
    '+': 'add',
    '-': 'subtract',
    '~': 'intersect',
    '^': 'stack'
}

const op_prefix = exports.op_prefix = str => {
    const operation = prefix_operations[str[0]]
    if (operation) return {name: str.slice(1), operation}
    return {name: str, operation: 'add'}
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