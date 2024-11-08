// 三角錐の頂点データ
export const tetrahedronVertices = [
    [Math.sqrt(2 / 3), 0, -1 / 3,0],
    [-Math.sqrt(2 / 9), Math.sqrt(2 / 3), -1 / 3,0],
    [-Math.sqrt(2 / 9), -Math.sqrt(2 / 3), -1 / 3,0],
    [0, 0, 1,0]
];

// 三角錐のエッジデータ
export const tetrahedronEdges = [
    [0, 1], [0, 2], [0, 3], // 頂点1から他の頂点へのエッジ
    [1, 2], [2, 3], [3, 1]  // 他の3つの辺
];

