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

}

/* Class designed to represent 3D Points
    
*/
class Point extends Triple {

    constructor(x, y, z) {
        super(x, y, z, 1); //1 for points
    }

}

/* Class designed to represent 3D Vectors
    
*/
class Vector extends Triple {

    constructor(x, y, z) {
        super(x, y, z, 0); //0 for Vectors
    }

    /*Gets length of current Vector

    */
    getNorm() {
        let x2 = this.coordinates[0]*this.coordinates[0];
        let y2 = this.coordinates[1]*this.coordinates[1];
        let z2 = this.coordinates[2]*this.coordinates[2];
        return Math.sqrt(x2+y2+z2);
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

/* Class designed to represent a Triangle
    - Encapsulates vectors operations
*/
class Triangle {

    constructor(point1, point2, point3) {
        this.points = [point1, point2, point3];
    }

    /*Current Triangle area
        - Calculated using Vectorial product method
    */
    getArea() {
        let point1 = this.points[0];
        let point2 = this.points[1];
        let point3 = this.points[2];
        let v1 = new Vector(point3.coordinates[0] - point1.coordinates[0],
                            point3.coordinates[1] - point1.coordinates[1],
                            point3.coordinates[2] - point1.coordinates[2]);
        let v2 = new Vector(point2.coordinates[0] - point1.coordinates[0],
                            point2.coordinates[1] - point1.coordinates[1],
                            point2.coordinates[2] - point1.coordinates[2]);
        let vOperations = new VectorOperations();
        let ortogonalVector = vOperations.vectorialProduct(v1,v2);
        return (ortogonalVector.getNorm()/2);
    }

}

/* Class designed to Operate with Vectors
    - Encapsulates vectors operations
*/
class VectorOperations {

    constructor() { }

    /*Multiplication for a scalar number
        - Receives a Vector and a number as input
        - Returns new Vector (the input Vector multiplied by k)
        - Returned Vector is a multiple of input Vector
        - Doesn't change input Vector!
    */
    scalarMultiplication(vector, k) { 
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
    addPoint(vector, point) {
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
    vectorProjection(vector1, vector2) {
        let scalarNominator = this.scalarProduct(vector1, vector2);
        let scalarDenominator = this.scalarProduct(vector2, vector2);
        return this.scalarMultiplication(vector2, (scalarNominator/scalarDenominator));
    }

    /*Scalar product between Vectors
        - Receives two Vectors as input
        - Returns a scalar value
        - YOLO!
    */
    scalarProduct(vector1, vector2) {
        return vector1.coordinates.reduce( (prevValue, curValue, idx) => {
            return (prevValue + curValue*vector2.coordinates[idx]);
        }, 0);
    }

    /*Vectorial product
        - Receives two Vectors as input
        - Returns a third Vector as output
        - Returned Vector is ortogonal to both input Vectors
    */
    vectorialProduct(vector1, vector2) {
        let coordsV1 = vector1.coordinates;
        let coordsV2 = vector2.coordinates;
        return new Vector(coordsV1[1]*coordsV2[2] - coordsV1[2]*coordsV2[1],
                            coordsV1[2]*coordsV2[0] - coordsV1[0]*coordsV2[2],
                            coordsV1[0]*coordsV2[1] - coordsV1[1]*coordsV2[0]);
    }


}

/* Class designed to represent Object that will be drawn
    - 3DObject would not fit good
    - Represented by several triangles
    - Each triangle has 3 Points
*/
class Object3D {

    constructor(objectName) {
        this.objectName = objectName;
        this.triangles = [];
    }

}

/* Class designed to represent Camera of the scenario
    - Focus is the mundial coordinates of the focus of the camera
    - DirectionVector is the direction the camera is 'looking' at
    - NormalVector points to the 'head' of the camera
    - Dist is the distance between the camera and the screen
    - Hx is the horizontal length of the screen (width)
    - Hy is the vertical length of the screen (height)
*/
class Camera {

    constructor(focus, directionVector, normalVector, dist, hx, hy) { 
        this.focus = focus;
        this.directionVector = directionVector;
        this.normalVector = normalVector;
        this.dist = dist;
        this.hx = hx;
        this.hy = hy;
    }

}