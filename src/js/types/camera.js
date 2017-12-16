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