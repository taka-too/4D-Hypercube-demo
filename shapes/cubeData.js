// Define vertices for a 3D cube at (x, y, z, 0) where x, y, z are 1 or -1
export const cubeVertices = [
    [-1, -1, -1, 0], [1, -1, -1, 0], [-1, 1, -1, 0], [1, 1, -1, 0],
    [-1, -1, 1, 0], [1, -1, 1, 0], [-1, 1, 1, 0], [1, 1, 1, 0]
];

// Define edges for the 3D cube connecting vertices
export const cubeEdges = [
    [0, 1], [0, 2], [0, 4], [1, 3], [1, 5], [2, 3], [2, 6], [3, 7],
    [4, 5], [4, 6], [5, 7], [6, 7]
];

