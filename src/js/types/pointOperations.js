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
