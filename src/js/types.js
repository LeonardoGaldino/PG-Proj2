//Base class of a point or a vector
//isPoint is 1 if point, 0 if vector
class Triple {

    constructor(x,y,z, isPoint) {
        this.coordinates = [x,y,z];
        this.isPoint = isPoint;
    }

    //scalar multiplication
    multiply(k) { 
        this.coordinates.forEach( (coordinate, idx) => {
            this.coordinates[idx] = (coordinate*k);
        });
    }

}

class Point extends Triple {

    constructor(x, y, z) {
        super(x, y, z, 1); //1 for points
    }

    addVector(vector) {
        let newCoords = this.coordinates.map( (coordinate, idx) => {
            return (coordinate + vector.coordinates[idx]);
        });
        return new Vector(newCoords[0], newCoords[1], newCoords[2]);
    }

}

class Vector extends Triple {

    constructor(x, y, z) {
        super(x, y, z, 0); //0 for vectors
    }

    addPoint(point) {
        let newCoords = this.coordinates.map( (coordinate, idx) => {
            return (coordinate + point.coordinates[idx]);
        });
        return new Point(newCoords[0], newCoords[1], newCoords[2]);
    }

}