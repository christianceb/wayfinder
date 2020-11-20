export const cornerCoordinates = (ne, sw) => {
    return [
        [parseFloat(sw[0]), parseFloat(ne[1])],
        [parseFloat(ne[0]), parseFloat(ne[1])],
        [parseFloat(ne[0]), parseFloat(sw[1])],
        [parseFloat(sw[0]), parseFloat(sw[1])]
    ];
}