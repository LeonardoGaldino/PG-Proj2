/* Class designed to represent a Color as RGB
    - Red/Blue/Green should be at range [0,255]
*/
class Color {
    constructor (red, blue, green) {
        this.rgb = {
            red: red,
            blue: blue,
            green: green
        };
        validateColor();
    }

    validateColor() {
        if(this.rgb.red < 0 || this.rgb.red > 255 || this.rgb.green < 0
                || this.rgb.green > 255 || this.rgb.blue < 0
                || this.rgb.blue > 255)
                {
                    let message = `Color componentes out of range! RGB = (
                        ${this.rgb.red},${this.rgb.green},${this.rgb.blue})`
                    throw new BadColorException(message); 
                }
        if(isNaN(this.rgb.red))
            throw new BadColorException('RGB invalid red component!');
        if(isNaN(this.rgb.green))
            throw new BadColorException('RGB invalid green component!');
        if(isNaN(this.rgb.blue))
            throw new BadColorException('RGB invalid blue component!');
    }
}