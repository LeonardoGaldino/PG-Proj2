//Precision
const EPS = 1e-10;

//Shortcut for returning last element of Arrays
Array.prototype.back = function(){
    return this[this.length - 1];
};

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

/* Class designed to represent 3D Points
    
*/
class Point extends Triple {

    constructor(x, y, z) {
        super(x, y, z, 1); //1 for points
    }

}

/* Class designed to represent 2D Points
    
*/
class Point2D {

    constructor(x,y) {
        this.coordinates = [x,y];
    }

}

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

    sortPointsByY() {
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

/* Class designed to Operate with Points
    - Encapsulates Points operations
*/
class PointOperations {
    
    constructor() { }

    /* Subtracts one Point from other
        - Returns a Vector
    */
    static subtract(point1, point2) {
        let newCoords = point1.coordinates.map( (coordinate, idx) => {
            return (coordinate - point2.coordinates[idx]);
        });
        return new Vector(newCoords[0], newCoords[1], newCoords[2]); 
    }

    /* Adds one Vector to a Point
        - Returns a Point
    */
    static addVector(point, vector) {
        if(point.isPoint && vector.isPoint) {
            let message = `Impossível adicionar dois pontos! Use soma baricêntrica.`;
            throw new PointSumException(message);
        }
        let newCoords = point.coordinates.map( (coordinate, idx) => {
            return (coordinate + vector.coordinates[idx]);
        });
        return new Point(newCoords[0], newCoords[1], newCoords[2]);
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

/* Class designed to represent Object that will be drawn
    - 3DObject would not fit good
    - Represented by several triangles
    - Each triangle has 3 Points
    - Each point is stored in points array
*/
class Object3D {

    constructor(objectName) {
        this.objectName = objectName;
        this.triangles3D = [];
        this.triangles2D = [];
        this.points3D = [];
        this.points2D = [];
    }

}

/* Class designed to represent Camera of the scenario
    - Focus is the mundial coordinates of the focus of the camera
    - DirectionVector is the direction the camera is 'looking' at (N)
    - UpVector points to the 'head' of the camera (V)
    - Dist is the distance between the camera and the screen
    - Hx is the horizontal length of the screen (width)
    - Hy is the vertical length of the screen (height)
*/
class Camera {

    constructor(focus, directionVector, upVector, dist, hx, hy) { 
        this.focus = focus;
        this.directionVector = directionVector;
        this.upVector = upVector;
        this.dist = dist;
        this.hx = hx;
        this.hy = hy;

        this.initializeCamera();
    }

    //Calls for Camera's initializers methods
    initializeCamera() {
        this.ortogonalize();
        this.directionVector = this.directionVector.getNormalizedVector();
        this.upVector = this.upVector.getNormalizedVector();        
        this.initializeThirdVector();
        this.initializeCameraMatrix();
    }

    //Ortogonalizes UpVector with DirectionVector
    ortogonalize() {
        let projectionVector = VectorOperations.vectorProjection
                            (this.upVector, this.directionVector);
        this.upVector = VectorOperations.subtract
                            (this.upVector, projectionVector);
    }

    //Calculates Third Vector using Vectorial Product between
                                    //Direction and Normal Vectors
    initializeThirdVector() {
        this.thirdVector = VectorOperations.vectorialProduct
            (this.directionVector, this.upVector);
    }

    //Initialize Camera Matrix with it's Vectors
    initializeCameraMatrix() {
        this.transformMatrix = new Matrix({
            rows: 3,
            columns: 3,
            matrix: [
                        this.thirdVector.toArray(false),    //U
                        this.upVector.toArray(false),       //V
                        this.directionVector.toArray(false) //N
                    ],
            extraDimension: true
        });
    }

}

/* Class designed to represent a Color as RGB
    - Red/Blue/Green should be at range [0,255]
*/
class Color {
    constructor (red, blue, green) {
        this.rgb = {
            red: red,
            blue: blue,
            green: green
        };
        validateColor();
    }

    validateColor() {
        if(this.rgb.red < 0 || this.rgb.red > 255 || this.rgb.green < 0
                || this.rgb.green > 255 || this.rgb.blue < 0
                || this.rgb.blue > 255)
                {
                    let message = `Color componentes out of range! RGB = (
                        ${this.rgb.red},${this.rgb.green},${this.rgb.blue})`
                    throw new BadColorException(message); 
                }
        if(isNaN(this.rgb.red))
            throw new BadColorException('RGB invalid red component!');
        if(isNaN(this.rgb.green))
            throw new BadColorException('RGB invalid green component!');
        if(isNaN(this.rgb.blue))
            throw new BadColorException('RGB invalid blue component!');
    }
}

/* Class designed to represent a light source

*/
class Illumination {

    constructor(focus, ambRefl, ambColor, difConstant, difVector, spec, sourceColor, rugosity) {
        this.focus = focus;
        this.ambRefl = ambRefl;
        this.ambColor = ambColor;
        this.difConstant = difConstant;
        this.difVector = difVector;
        this.spec = spec;
        this.sourceColor = sourceColor;
        this.rugosity = rugosity;
    }

}

/* Class designed to represent Matrix of any size
    - addExtraDimension adds other dimension to operate with isPoint coordinate on Vector/Points
*/
class Matrix {

    constructor(matrixConfiguration) {
        this.rows = matrixConfiguration.rows;
        this.columns = matrixConfiguration.columns;
        if(matrixConfiguration.matrix) {
            this.matrix = matrixConfiguration.matrix;
            this.validate();
        } else {
            this.initializeMatrix();
        }
        if(matrixConfiguration.extraDimension) {
            this.addExtraDimension();
        }
    }

    addExtraDimension() {
        for(let i = 0 ; i < this.rows ; ++i)
            this.matrix[i].push(0);
        let tempArray = new Array(this.columns);
        tempArray.fill(0);
        tempArray.push(1);
        this.matrix.push(tempArray);
        ++this.rows;
        ++this.columns;
    }

    initializeMatrix() {
        this.matrix = new Array(this.rows);
        for(let i = 0 ; i < this.rows ; ++i)
            this.matrix[i] = new Array(this.columns);
    }

    validate() {
        for(let idx = 0 ; idx < this.matrix.length-1 ; ++idx) {
            if(this.matrix[idx].length != this.matrix[idx+1].length)
                throw new MatrixSizeException('Matrizes com linhas com diferente número de colunas.');
        }
    }

}

/* Class designed to operate with Matrix

*/
class MatrixOperations {

    static multiply(matrix1, matrix2) {
        if(matrix1.columns != matrix2.rows) {
            let message = `Can't multiply matrix with ${matrix1.columns} columns
                            by matrix with ${matrix2.rows} rows!`;
            throw new MatrixMultiplicationException(message);
        }
        let newMat = MatrixOperations.getNewMatrix(matrix1.rows, matrix2.columns);

        for(let i = 0 ; i < newMat.rows ; ++i) {
            for(let j = 0 ; j < newMat.columns ; ++j) {
                for(let k = 0 ; k < matrix1.columns ; ++k) {
                    newMat.matrix[i][j] += matrix1.matrix[i][k]*matrix2.matrix[k][j];
                }
            }
        }

        return newMat;
    }

    //Returns new Matrix full of zeroes
    static getNewMatrix(rows, columns) {
        let tempMat = Array(rows);
        for(let i = 0 ; i < tempMat.length ; ++i) {
            tempMat[i] = new Array(columns);
            tempMat[i].fill(0);
        }

        let newMat = new Matrix({
            rows: rows,
            columns: columns,
            matrix: tempMat
        });

        return newMat;
    }

}