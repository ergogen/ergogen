function square_extrude_5_outline_fn(){
    return new CSG.Path2D([[-2.5,-2.5],[2.5,-2.5]]).appendPoint([2.5,2.5]).appendPoint([-2.5,2.5]).appendPoint([-2.5,-2.5]).close().innerToCAG()
.extrude({ offset: [0, 0, 5] });
}




                function cube_case_fn() {
                    

                // creating part 0 of case cube
                let cube__part_0 = square_extrude_5_outline_fn();

                // make sure that rotations are relative
                let cube__part_0_bounds = cube__part_0.getBounds();
                let cube__part_0_x = cube__part_0_bounds[0].x + (cube__part_0_bounds[1].x - cube__part_0_bounds[0].x) / 2
                let cube__part_0_y = cube__part_0_bounds[0].y + (cube__part_0_bounds[1].y - cube__part_0_bounds[0].y) / 2
                cube__part_0 = translate([-cube__part_0_x, -cube__part_0_y, 0], cube__part_0);
                cube__part_0 = rotate([0,0,0], cube__part_0);
                cube__part_0 = translate([cube__part_0_x, cube__part_0_y, 0], cube__part_0);

                cube__part_0 = translate([0,0,0], cube__part_0);
                let result = cube__part_0;
                
            
                    return result;
                }
            
            
        
            function main() {
                return cube_case_fn();
            }

        