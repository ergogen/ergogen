module.exports = {
    convert_outline: () => {},
    body: params => {
        return `Custom template override. The secret is ${params.custom.secret}.`
    }
}