/* Class designed to represent a 2D Triangle
    - Encapsulates vectors operations
*/
class Triangle2D {
    
        constructor(point1, point2, point3) {
            this.points = [point1, point2, point3];
        }
    
        //Returns Area of the triangle using Heron's formula.
        getArea() {
            let edge1 = getDistance(this.points[0], this.points[1]);
            let edge2 = getDistance(this.points[0], this.points[2]);
            let edge3 = getDistance(this.points[1], this.points[2]);
            let semiPerimeter = (edge1+edge2+edge3)/2;
            return Math.sqrt(semiPerimeter*(semiPerimeter-edge1)*
                            (semiPerimeter-edge2)*(semiPerimeter-edge3));
        }
    
        sortPointsByYX() {
            //Comparison function to sort Points
            let cmpFunction = (p1, p2) => {
                if(p1.coordinates[1] < p2.coordinates[1])
                    return -1;
                else if(p1.coordinates[1] > p2.coordinates[1])
                    return 1;
                else if(p1.coordinates[0] < p2.coordinates[0])
                    return -1;
                return 1;
            };
            //Array sort method using custom comparison function
            this.points.sort(cmpFunction);
        }
    
    }