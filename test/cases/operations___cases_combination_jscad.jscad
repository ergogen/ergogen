function _square_extrude_8_outline_fn(){
    return new CSG.Path2D([[-4,-4],[4,-4]]).appendPoint([4,4]).appendPoint([-4,4]).appendPoint([-4,-4]).close().innerToCAG()
.extrude({ offset: [0, 0, 8] });
}


function _circle_extrude_8_outline_fn(){
    return CAG.circle({"center":[0,0],"radius":3})
.extrude({ offset: [0, 0, 8] });
}


function _square_extrude_1_outline_fn(){
    return new CSG.Path2D([[-4,-4],[4,-4]]).appendPoint([4,4]).appendPoint([-4,4]).appendPoint([-4,-4]).close().innerToCAG()
.extrude({ offset: [0, 0, 1] });
}




                function _subtract_case_fn() {
                    

                // creating part target of case _subtract
                let _subtract__part_target = _cube_case_fn();

                // make sure that rotations are relative
                let _subtract__part_target_bounds = _subtract__part_target.getBounds();
                let _subtract__part_target_x = _subtract__part_target_bounds[0].x + (_subtract__part_target_bounds[1].x - _subtract__part_target_bounds[0].x) / 2
                let _subtract__part_target_y = _subtract__part_target_bounds[0].y + (_subtract__part_target_bounds[1].y - _subtract__part_target_bounds[0].y) / 2
                _subtract__part_target = translate([-_subtract__part_target_x, -_subtract__part_target_y, 0], _subtract__part_target);
                _subtract__part_target = rotate([0,0,0], _subtract__part_target);
                _subtract__part_target = translate([_subtract__part_target_x, _subtract__part_target_y, 0], _subtract__part_target);

                _subtract__part_target = translate([0,0,0], _subtract__part_target);
                let result = _subtract__part_target;
                
            

                // creating part tool of case _subtract
                let _subtract__part_tool = _cylinder_one_case_fn();

                // make sure that rotations are relative
                let _subtract__part_tool_bounds = _subtract__part_tool.getBounds();
                let _subtract__part_tool_x = _subtract__part_tool_bounds[0].x + (_subtract__part_tool_bounds[1].x - _subtract__part_tool_bounds[0].x) / 2
                let _subtract__part_tool_y = _subtract__part_tool_bounds[0].y + (_subtract__part_tool_bounds[1].y - _subtract__part_tool_bounds[0].y) / 2
                _subtract__part_tool = translate([-_subtract__part_tool_x, -_subtract__part_tool_y, 0], _subtract__part_tool);
                _subtract__part_tool = rotate([0,0,0], _subtract__part_tool);
                _subtract__part_tool = translate([_subtract__part_tool_x, _subtract__part_tool_y, 0], _subtract__part_tool);

                _subtract__part_tool = translate([0,0,0], _subtract__part_tool);
                result = result.subtract(_subtract__part_tool);
                
            
                    return result;
                }
            
            

                function _cube_case_fn() {
                    

                // creating part 0 of case _cube
                let _cube__part_0 = _square_extrude_8_outline_fn();

                // make sure that rotations are relative
                let _cube__part_0_bounds = _cube__part_0.getBounds();
                let _cube__part_0_x = _cube__part_0_bounds[0].x + (_cube__part_0_bounds[1].x - _cube__part_0_bounds[0].x) / 2
                let _cube__part_0_y = _cube__part_0_bounds[0].y + (_cube__part_0_bounds[1].y - _cube__part_0_bounds[0].y) / 2
                _cube__part_0 = translate([-_cube__part_0_x, -_cube__part_0_y, 0], _cube__part_0);
                _cube__part_0 = rotate([0,0,0], _cube__part_0);
                _cube__part_0 = translate([_cube__part_0_x, _cube__part_0_y, 0], _cube__part_0);

                _cube__part_0 = translate([0,0,0], _cube__part_0);
                let result = _cube__part_0;
                
            
                    return result;
                }
            
            

                function _cylinder_one_case_fn() {
                    

                // creating part 0 of case _cylinder_one
                let _cylinder_one__part_0 = _circle_extrude_8_outline_fn();

                // make sure that rotations are relative
                let _cylinder_one__part_0_bounds = _cylinder_one__part_0.getBounds();
                let _cylinder_one__part_0_x = _cylinder_one__part_0_bounds[0].x + (_cylinder_one__part_0_bounds[1].x - _cylinder_one__part_0_bounds[0].x) / 2
                let _cylinder_one__part_0_y = _cylinder_one__part_0_bounds[0].y + (_cylinder_one__part_0_bounds[1].y - _cylinder_one__part_0_bounds[0].y) / 2
                _cylinder_one__part_0 = translate([-_cylinder_one__part_0_x, -_cylinder_one__part_0_y, 0], _cylinder_one__part_0);
                _cylinder_one__part_0 = rotate([0,0,0], _cylinder_one__part_0);
                _cylinder_one__part_0 = translate([_cylinder_one__part_0_x, _cylinder_one__part_0_y, 0], _cylinder_one__part_0);

                _cylinder_one__part_0 = translate([0,0,0], _cylinder_one__part_0);
                let result = _cylinder_one__part_0;
                
            
                    return result;
                }
            
            

                function _cylinder_two_case_fn() {
                    

                // creating part 0 of case _cylinder_two
                let _cylinder_two__part_0 = _circle_extrude_8_outline_fn();

                // make sure that rotations are relative
                let _cylinder_two__part_0_bounds = _cylinder_two__part_0.getBounds();
                let _cylinder_two__part_0_x = _cylinder_two__part_0_bounds[0].x + (_cylinder_two__part_0_bounds[1].x - _cylinder_two__part_0_bounds[0].x) / 2
                let _cylinder_two__part_0_y = _cylinder_two__part_0_bounds[0].y + (_cylinder_two__part_0_bounds[1].y - _cylinder_two__part_0_bounds[0].y) / 2
                _cylinder_two__part_0 = translate([-_cylinder_two__part_0_x, -_cylinder_two__part_0_y, 0], _cylinder_two__part_0);
                _cylinder_two__part_0 = rotate([90,0,0], _cylinder_two__part_0);
                _cylinder_two__part_0 = translate([_cylinder_two__part_0_x, _cylinder_two__part_0_y, 0], _cylinder_two__part_0);

                _cylinder_two__part_0 = translate([0,4,4], _cylinder_two__part_0);
                let result = _cylinder_two__part_0;
                
            
                    return result;
                }
            
            

                function _flat_square_case_fn() {
                    

                // creating part 0 of case _flat_square
                let _flat_square__part_0 = _square_extrude_1_outline_fn();

                // make sure that rotations are relative
                let _flat_square__part_0_bounds = _flat_square__part_0.getBounds();
                let _flat_square__part_0_x = _flat_square__part_0_bounds[0].x + (_flat_square__part_0_bounds[1].x - _flat_square__part_0_bounds[0].x) / 2
                let _flat_square__part_0_y = _flat_square__part_0_bounds[0].y + (_flat_square__part_0_bounds[1].y - _flat_square__part_0_bounds[0].y) / 2
                _flat_square__part_0 = translate([-_flat_square__part_0_x, -_flat_square__part_0_y, 0], _flat_square__part_0);
                _flat_square__part_0 = rotate([0,0,0], _flat_square__part_0);
                _flat_square__part_0 = translate([_flat_square__part_0_x, _flat_square__part_0_y, 0], _flat_square__part_0);

                _flat_square__part_0 = translate([0,0,0], _flat_square__part_0);
                let result = _flat_square__part_0;
                
            
                    return result;
                }
            
            

                function combination_case_fn() {
                    

                // creating part 0 of case combination
                let combination__part_0 = _subtract_case_fn();

                // make sure that rotations are relative
                let combination__part_0_bounds = combination__part_0.getBounds();
                let combination__part_0_x = combination__part_0_bounds[0].x + (combination__part_0_bounds[1].x - combination__part_0_bounds[0].x) / 2
                let combination__part_0_y = combination__part_0_bounds[0].y + (combination__part_0_bounds[1].y - combination__part_0_bounds[0].y) / 2
                combination__part_0 = translate([-combination__part_0_x, -combination__part_0_y, 0], combination__part_0);
                combination__part_0 = rotate([0,0,0], combination__part_0);
                combination__part_0 = translate([combination__part_0_x, combination__part_0_y, 0], combination__part_0);

                combination__part_0 = translate([0,0,0], combination__part_0);
                let result = combination__part_0;
                
            

                // creating part 1 of case combination
                let combination__part_1 = _cylinder_two_case_fn();

                // make sure that rotations are relative
                let combination__part_1_bounds = combination__part_1.getBounds();
                let combination__part_1_x = combination__part_1_bounds[0].x + (combination__part_1_bounds[1].x - combination__part_1_bounds[0].x) / 2
                let combination__part_1_y = combination__part_1_bounds[0].y + (combination__part_1_bounds[1].y - combination__part_1_bounds[0].y) / 2
                combination__part_1 = translate([-combination__part_1_x, -combination__part_1_y, 0], combination__part_1);
                combination__part_1 = rotate([0,0,0], combination__part_1);
                combination__part_1 = translate([combination__part_1_x, combination__part_1_y, 0], combination__part_1);

                combination__part_1 = translate([0,0,0], combination__part_1);
                result = result.intersect(combination__part_1);
                
            

                // creating part 2 of case combination
                let combination__part_2 = _flat_square_case_fn();

                // make sure that rotations are relative
                let combination__part_2_bounds = combination__part_2.getBounds();
                let combination__part_2_x = combination__part_2_bounds[0].x + (combination__part_2_bounds[1].x - combination__part_2_bounds[0].x) / 2
                let combination__part_2_y = combination__part_2_bounds[0].y + (combination__part_2_bounds[1].y - combination__part_2_bounds[0].y) / 2
                combination__part_2 = translate([-combination__part_2_x, -combination__part_2_y, 0], combination__part_2);
                combination__part_2 = rotate([0,0,0], combination__part_2);
                combination__part_2 = translate([combination__part_2_x, combination__part_2_y, 0], combination__part_2);

                combination__part_2 = translate([0,0,0], combination__part_2);
                result = result.union(combination__part_2);
                
            
                    return result;
                }
            
            
        
            function main() {
                return combination_case_fn();
            }

        