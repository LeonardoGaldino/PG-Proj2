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
    