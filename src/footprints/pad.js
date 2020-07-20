module.exports = {
    nets: ['net'],
    params: {
        width: 1,
        height: 1,
        front: true,
        back: true,
        text: '',
        align: 'left',
        mirrored: '!mirrored'
    },
    body: p => {

        const layout = (toggle, side) => {
            if (!toggle) return ''
            let x = 0, y = 0
            const mirror = side == 'B' ? '(justify mirror)' : ''
            const plus = (p.param_text.length + 1) * 0.5
            let align = p.param_align
            if (p.param_mirrored === true) {
                if (align == 'left') align = 'right'
                else if (align == 'right') align = 'left'
            }
            if (align == 'left') x -= p.param_width / 2 + plus
            if (align == 'right') x += p.param_width / 2 + plus
            if (align == 'up') y += p.param_height / 2 + plus
            if (align == 'down') y -= p.param_height / 2 + plus
            const text = `(fp_text user ${p.param_text} (at ${x} ${y} ${p.rot}) (layer ${side}.SilkS) (effects (font (size 0.8 0.8) (thickness 0.15)) ${mirror}))`
            return `(pad 1 smd rect (at 0 0 ${p.rot}) (size ${p.param_width} ${p.param_height}) (layers ${side}.Cu ${side}.Paste ${side}.Mask) ${p.net_net})\n${text}`
        }

        return `
    
        (module SMDPad (layer F.Cu) (tedit 5B24D78E)

            ${p.at /* parametric position */}
            
            ${''/* SMD pads */}
            ${layout(p.param_front, 'F')}
            ${layout(p.param_back, 'B')}
            
        )
    
        `
    }
}