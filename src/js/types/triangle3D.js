/* Class designed to represent a 3D Triangle
    - Encapsulates vectors operations
*/
class Triangle3D {
    
        constructor(point1, point2, point3) {
            this.points = [point1, point2, point3];
            this.calculateNormalVector();
        }
    
        /*Current Triangle area
            - Calculated using Vectorial product method
        */
        getArea() {
            return (this.normalVector.getNorm()/2);
        }
    
        /*Calculate the normal Vector of the triangle
            - Calculated using Vectorial product method
            - Add the computed Vector to triangle properties
        */
        calculateNormalVector() {
            let v1 = PointOperations.subtract(this.points[2], this.points[0]);
            let v2 = PointOperations.subtract(this.points[1], this.points[0]);
            this.normalVector = VectorOperations.vectorialProduct(v1,v2).getNormalizedVector();
        }
    
    }