/* Class designed to represent 3D Vectors
    
*/
class Vector extends Triple {
    
        constructor(x, y, z) {
            super(x, y, z, 0); //0 for Vectors
        }
    
        /*Gets length of current Vector
            - YOLO
        */
        getNorm() {
            return Math.sqrt(this.coordinates.reduce((prev, coordinate) => {
                return (prev + (coordinate*coordinate));
            }, 0));
        }
    
        /*Normalization of current Vector
            - Returns new Vector with norm 1.
            - Returned Vector has same direction of current Vector
        */
        getNormalizedVector() {
            let norm = this.getNorm();
            let newCoords = this.coordinates.map( (coordinate) => {
                return (coordinate/norm);
            });
            return new Vector(newCoords[0], newCoords[1], newCoords[2]);
        }
    
    }