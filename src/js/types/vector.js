/* Class designed to represent 3D Vectors
    
*/
/**
 * @requires ./triple.js
 * @requires ./point.js
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

/* Class designed to Operate with Vectors
    - Encapsulates Vectors operations
*/
class VectorOperations {
    
    constructor() { }

    /* Adds one Vector from other
        - Returns a Vector
    */
    static add(vector1, vector2) {
        let newCoords = vector1.coordinates.map( (coordinate, idx) => {
            return (coordinate + vector2.coordinates[idx]);
        });
        return new Vector(newCoords[0], newCoords[1], newCoords[2]);
    }

    /* Subtracts one Vector from other
        - Returns a Vector
    */
    static subtract(vector1, vector2) {
        let newCoords = vector1.coordinates.map( (coordinate, idx) => {
            return (coordinate - vector2.coordinates[idx]);
        });
        return new Vector(newCoords[0], newCoords[1], newCoords[2]);
    }

    /*Multiplication for a scalar number
        - Receives a Vector and a number as input
        - Returns new Vector (the input Vector multiplied by k)
        - Returned Vector is a multiple of input Vector
        - Doesn't change input Vector!
    */
    static scalarMultiplication(vector, k) { 
        let newVector = new Vector(vector.coordinates[0],
                                    vector.coordinates[1],
                                    vector.coordinates[2]);
        newVector.coordinates.forEach( (coordinate, idx) => {
            newVector.coordinates[idx] = (coordinate*k);
        });
        return newVector;
    }

    /*Sum of a Vector and a Point
        - Receives Vector and a Point as input
        - Returns a Point
        - Returned Point is the input Point translated in direction of the vector
    */
    static addPoint(vector, point) {
        let newCoords = vector.coordinates.map( (coordinate, idx) => {
            return (coordinate + point.coordinates[idx]);
        })
        return new Point(newCoords[0], newCoords[1], newCoords[2]);
    }

    /*Vector Projection Operation
        - Receive two Vectors as input
        - Returns the projections of first input Vector on the second
        - Returned Vector is a multiple of the second Vector
    */
    static vectorProjection(vector1, vector2) {
        let scalarNominator = this.scalarProduct(vector1, vector2);
        let scalarDenominator = this.scalarProduct(vector2, vector2);
        return this.scalarMultiplication(vector2, (scalarNominator/scalarDenominator));
    }

    /*Scalar product between Vectors
        - Receives two Vectors as input
        - Returns a scalar value
        - YOLO!
    */
    static scalarProduct(vector1, vector2) {
        return vector1.coordinates.reduce( (prevValue, curValue, idx) => {
            return (prevValue + curValue*vector2.coordinates[idx]);
        }, 0);
    }

    /*Vectorial product
        - Receives two Vectors as input
        - Returns a third Vector as output
        - Returned Vector is ortogonal to both input Vectors
    */
    static vectorialProduct(vector1, vector2) {
        let coordsV1 = vector1.coordinates;
        let coordsV2 = vector2.coordinates;
        return new Vector(coordsV1[1]*coordsV2[2] - coordsV1[2]*coordsV2[1],
                            coordsV1[2]*coordsV2[0] - coordsV1[0]*coordsV2[2],
                            coordsV1[0]*coordsV2[1] - coordsV1[1]*coordsV2[0]);
    }

}