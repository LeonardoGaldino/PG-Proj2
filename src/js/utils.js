//Capitalizes first letter of a string
function capitalize(inputString) {
    return inputString[0].toUpperCase() + inputString.slice(1);
}

//Extracts the FileName without the extension part
//And returns FileName capitalized
function getObjectName(fileName) {
    fileName = fileName.split('.')[0]; // Separates the filename from extension
    return capitalize(fileName); // Returns capitalized first letter
}

//Get Distance between 2 points
//Points can be from plane or space.
function getDistance(point1, point2) {
    let diff = point1.coordinates.map( (coord, idx) => {
        return (coord - point2.coordinates[idx]);
    });
    let squareSum = diff.reduce( (prev, cur) => {
        return (prev + cur*cur);
    }, 0);
    return Math.sqrt(squareSum);
}