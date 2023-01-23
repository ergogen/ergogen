function export_extrude_1_outline_fn(){
    return new CSG.Path2D([[-9,-9],[9,-9]]).appendPoint([9,9]).appendPoint([-9,9]).appendPoint([-9,-9]).close().innerToCAG()
.extrude({ offset: [0, 0, 1] });
}




                function _export_case_fn() {
                    

                // creating part 0 of case _export
                let _export__part_0 = export_extrude_1_outline_fn();

                // make sure that rotations are relative
                let _export__part_0_bounds = _export__part_0.getBounds();
                let _export__part_0_x = _export__part_0_bounds[0].x + (_export__part_0_bounds[1].x - _export__part_0_bounds[0].x) / 2
                let _export__part_0_y = _export__part_0_bounds[0].y + (_export__part_0_bounds[1].y - _export__part_0_bounds[0].y) / 2
                _export__part_0 = translate([-_export__part_0_x, -_export__part_0_y, 0], _export__part_0);
                _export__part_0 = rotate([0,0,0], _export__part_0);
                _export__part_0 = translate([_export__part_0_x, _export__part_0_y, 0], _export__part_0);

                _export__part_0 = translate([0,0,0], _export__part_0);
                let result = _export__part_0;
                
            
                    return result;
                }
            
            
        
            function main() {
                return _export_case_fn();
            }

        