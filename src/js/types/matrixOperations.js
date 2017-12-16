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