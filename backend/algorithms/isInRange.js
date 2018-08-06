exports.isInRange = ([lat1, lon1],[lat2, lon2], d) => {
    const circ = 24901; //circumference of earth in miles

    const theta = (d / circ) * 360;
    const phi = (d / circ) * 180;

    let angles = [];
    //max lat
    angles[0] = (lat2 + phi > 90) ? 90 : (lat2 + phi);
    //min lat
    angles[1] = (lat2 - phi > -90) ? (lat2 - phi) : -90;
    //max lon
    angles[2] = (lon2 + theta <= 180) ? (lon2 + theta) : (lon2 + theta - 360);
    //min lon
    angles[3] = (lon2 - theta >= -180) ? (lon2 - theta) : (lon2 - theta + 360);
    
    let truth =  (lat1 <= angles[0] && lat1 >= angles[1] && lon1 <= angles[2] && lon1 >= angles[3]);

    return (truth);
};