/**
 * Helper function to get the remaining corners of two coordinates.
 * 
 * @param {array} ne north eastern coordinates. Not a strict requirement, but preferred
 * @param {array} sw south western coordinates. Not a strict requirement, but preferred
 * 
 * @returns {array} all corners in an array starting from NW, NE, SE, and SW
 */
export const cornerCoordinates = (ne, sw) => {
    return [
        [parseFloat(sw[0]), parseFloat(ne[1])],
        [parseFloat(ne[0]), parseFloat(ne[1])],
        [parseFloat(ne[0]), parseFloat(sw[1])],
        [parseFloat(sw[0]), parseFloat(sw[1])]
    ];
}

// export { cornerCoordinates } // Might be a better way to export than the one above!