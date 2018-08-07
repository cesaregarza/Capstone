//haversine. Given two pairs of geographical coordinates, determine the distance between them in miles. 
//INPUT TYPES => OUTPUT TYPES: ([Number, Number], [Number, Number]) => Number
exports.haversine = ([lat1, lon1],[lat2, lon2]) => {
    const deltaPhi = (lat2 - lat1);
    const deltaTheta = (lon2 - lon1);

    const [asin, pow, sin, cos] = ["asin", "pow", "sin", "cos"].map(x => Math.x); //maps asin, pow, sin, and cos to the math object to reference without having to type Math.asin, etc.

    const r = 3958.76; //radius of earth in miles

    let d = 2 * r * asin(
        sqrt(
            pow(
                sin(deltaTheta)/2, 2) + 
            cos(lon1) * cos(lon2) * 
            pow(
                sin(deltaPhi)/2, 2)
            )
        );

    return Math.round(d);
};