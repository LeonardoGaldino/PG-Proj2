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