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