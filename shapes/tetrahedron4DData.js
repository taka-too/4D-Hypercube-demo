// 4次元単体（5-cell）の頂点データ
export const tetrahedron4DVertices = [
    [Math.sqrt(5 / 8), Math.sqrt(5 / 8), Math.sqrt(5 / 8), -1 / 2],
    [Math.sqrt(5 / 8), -Math.sqrt(5 / 8), -Math.sqrt(5 / 8), -1 / 2],
    [-Math.sqrt(5 / 8), Math.sqrt(5 / 8), -Math.sqrt(5 / 8), -1 / 2],
    [-Math.sqrt(5 / 8), -Math.sqrt(5 / 8), Math.sqrt(5 / 8), -1 / 2],
    [0, 0, 0, 1]
];

// 4次元単体（5-cell）のエッジデータ
export const tetrahedron4DEdges = [
    [0, 1], [0, 2], [0, 3], [0, 4], // 頂点1と他の4つの頂点を結ぶエッジ
    [1, 2], [1, 3], [1, 4],         // 頂点2と他の頂点を結ぶエッジ
    [2, 3], [2, 4],                 // 頂点3と他の頂点を結ぶエッジ
    [3, 4]                          // 頂点4と頂点5を結ぶエッジ
];

