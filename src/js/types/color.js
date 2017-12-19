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
        if(isNaN(this.rgb.red)) throw new BadColorException('RGB invalid red component!');
        if(isNaN(this.rgb.green)) throw new BadColorException('RGB invalid green component!');
        if(isNaN(this.rgb.blue)) throw new BadColorException('RGB invalid blue component!');
        
        this.rgb.red = Math.max(Math.min(this.rgb.red, 255), 0);
        this.rgb.green = Math.max(Math.min(this.rgb.green, 255), 0);
        this.rgb.blue = Math.max(Math.min(this.rgb.blue, 255), 0);
    }
}