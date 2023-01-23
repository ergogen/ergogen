function export_extrude_1_outline_fn(){
    return new CSG.Path2D([[-9,-9],[9,-9]]).appendPoint([9,9]).appendPoint([-9,9]).appendPoint([-9,-9]).close().innerToCAG()
.extrude({ offset: [0, 0, 1] });
}




                function export_case_fn() {
                    

                // creating part 0 of case export
                let export__part_0 = export_extrude_1_outline_fn();

                // make sure that rotations are relative
                let export__part_0_bounds = export__part_0.getBounds();
                let export__part_0_x = export__part_0_bounds[0].x + (export__part_0_bounds[1].x - export__part_0_bounds[0].x) / 2
                let export__part_0_y = export__part_0_bounds[0].y + (export__part_0_bounds[1].y - export__part_0_bounds[0].y) / 2
                export__part_0 = translate([-export__part_0_x, -export__part_0_y, 0], export__part_0);
                export__part_0 = rotate([0,0,0], export__part_0);
                export__part_0 = translate([export__part_0_x, export__part_0_y, 0], export__part_0);

                export__part_0 = translate([0,0,0], export__part_0);
                let result = export__part_0;
                
            
                    return result;
                }
            
            
        
            function main() {
                return export_case_fn();
            }

        