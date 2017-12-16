/* Class designed to represent a light source

*/
class Illumination {
    
        constructor(focus, ambRefl, ambColor, difConstant, difVector, spec, sourceColor, rugosity) {
            this.focus = focus;
            this.ambRefl = ambRefl;
            this.ambColor = ambColor;
            this.difConstant = difConstant;
            this.difVector = difVector;
            this.spec = spec;
            this.sourceColor = sourceColor;
            this.rugosity = rugosity;
        }
    
    }