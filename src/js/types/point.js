/**
 * @requires ./triple.js
 */

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

    static scalarMultiplication(point, scalar) {
        let newCoords = point.coordinates.map( (coord, idx) => {
            return (coord*scalar[idx]);
        });

        if(point.coordinates.length == 2)
            return new Point2D(newCoords[0], newCoords[1]);

        return new Point(newCoords[0], newCoords[1], newCoords[2]);
    }

    static barycentricSum(points, coefs, is3D) {

        let coefsSum = coefs.reduce( (prev, cur) => {
            return (prev+cur);
        }, 0);

        //if(Math.abs(1-coefsSum) > 1e-15) {
        //    let message = 'Barycentric coordinates didn\'t sum up to 1';
        //    throw new BadBarycentricSum(message);
        //}

        let newCoords = points[0].coordinates.map( (temp, idx) => {
            return (
                points[0].coordinates[idx]*coefs[0] +
                points[1].coordinates[idx]*coefs[1] +
                points[2].coordinates[idx]*coefs[2]
            );
        });

        if(is3D)
            return new Point(newCoords[0], newCoords[1], newCoords[2]);
        
        return new Point2D(newCoords[0], newCoords[1]);
    }

    static areSamePoint(p1, p2) {
        let equal = true;
        p1.coordinates.forEach( (coord, idx) => {
            if(coord != p2.coordinates[idx])
                equal = false;
        });
        return equal;
    }

}