/* Base class of a point or a vector
    - isPoint differs Vector from Point
    - isPoint = 1 -> Triple represents a Point
    - isPoint = 0 -> Triple represents a Vector
*/
class Triple {
    
        constructor(x,y,z, isPoint) {
            this.coordinates = [x,y,z];
            this.isPoint = isPoint;
        }
    
        /*Scalar multiplication
            - This operation doesn't differs on a Vector or a Point
            - Multiply all coordinate by k.
        */
        multiply(k) { 
            this.coordinates.forEach( (coordinate, idx) => {
                this.coordinates[idx] = (coordinate*k);
            });
        }
    
        /*Triple to array
            - Returns an array with triple's coordinates + isPoint
        */
        toArray(addPointControl) {
            let temp = this.coordinates.map( (coordinate) => {
                return coordinate;
            });
            if(addPointControl)
                temp.push(this.isPoint);
            return temp;
        }
    
        /*Base system change
            - Receives transformation Matrix (4x4)
            - Returns Point or Vector after transformation
        */
        baseChange(changeMatrix) {
            let tripleMatrix = new Matrix({
                rows: 4,
                columns: 1,
                matrix: [
                            [this.coordinates[0]],
                            [this.coordinates[1]],
                            [this.coordinates[2]],
                            [this.isPoint],   
                        ],
                addDimension: false
            });
            let changedTriple = MatrixOperations.multiply(changeMatrix, tripleMatrix);
            if(this.isPoint) {
                return new Point(changedTriple.matrix[0][0], changedTriple.matrix[1][0],
                                    changedTriple.matrix[2][0]);
            }
            return new Vector(changedTriple.matrix[0][0], changedTriple.matrix[1][0],
                            changedTriple.matrix[2][0]);
        }
    
    }
    