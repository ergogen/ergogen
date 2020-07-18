module.exports = {
    nets: ['net'],
    params: {
        width: 1,
        height: 1,
        front: true,
        back: true
    },
    body: p => {

        let front = ''
        if (p.param_front) {
            front = `(pad 1 smd rect (at 0 0 ${p.rot}) (size ${p.param_width} ${p.param_height}) (layers F.Cu F.Paste F.Mask) ${p.net_net})`
        }

        let back = ''
        if (p.param_back) {
            back = `(pad 1 smd rect (at 0 0 ${p.rot}) (size ${p.param_width} ${p.param_height}) (layers B.Cu B.Paste B.Mask) ${p.net_net})`
        }

        return `
    
        (module SMDPad (layer F.Cu) (tedit 5B24D78E)

            ${p.at /* parametric position */}
            
            ${''/* SMD pads */}
            ${front}
            ${back}
            
        )
    
        `
    }
}