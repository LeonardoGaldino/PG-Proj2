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