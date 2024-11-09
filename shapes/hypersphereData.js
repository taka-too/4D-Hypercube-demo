// Define vertices and edges for a 4D hypersphere in (x, y, z, u) coordinates
export const hypersphereVertices = (() => {
    const vertices = [
        [0, 0, 0, 1],  // North pole
    ];

    // Parameters for hypersphere
    const radius = 1;
    const psiCount = 6;  // Number of 4D rings (excluding poles)
    const thetaCount = 6; // Number of latitude rings in each 3D sphere
    const pointsPerRing = 8; // Points per latitude ring

    // Generate vertices for each 3D sphere layer at each psi angle
    for (let i = 1; i <= psiCount; i++) {
        const psi = (Math.PI * i) / (psiCount + 1);  // 4D latitude angle
        const u = radius * Math.cos(psi);            // w-coordinate
        const r3d = radius * Math.sin(psi);          // Radius of 3D sphere at this w-coordinate

        // Generate 3D sphere points at this psi layer
        for (let j = 0; j <= thetaCount; j++) {
            const theta = (Math.PI * j) / thetaCount;  // Latitude angle in 3D sphere
            const y = r3d * Math.cos(theta);           // y-coordinate in 3D sphere
            const r2d = r3d * Math.sin(theta);         // Radius for xz-plane

            // Generate points around this ring (longitude in 3D sphere)
            for (let k = 0; k < pointsPerRing; k++) {
                const phi = (2 * Math.PI * k) / pointsPerRing;  // Longitude angle
                const x = r2d * Math.cos(phi);                  // x-coordinate
                const z = r2d * Math.sin(phi);                  // z-coordinate
                vertices.push([x, y, z, u]);
            }
        }
    }

    // Add south pole
    vertices.push([0, 0, 0, -1]);  // South pole

    return vertices;
})();

export const hypersphereEdges = (() => {
    const edges = [];
    const psiCount = 6;
    const thetaCount = 6;
    const pointsPerRing = 8;

    // Connect north pole to the first 3D sphere layer
    for (let j = 0; j < pointsPerRing; j++) {
        edges.push([0, j + 1]);  // 0 is the north pole
    }

    // Connect each 3D sphere's rings and corresponding points to the next 3D sphere
    for (let i = 0; i < psiCount; i++) {
        const layerStart = 1 + i * thetaCount * pointsPerRing;
        const nextLayerStart = layerStart + thetaCount * pointsPerRing;

        for (let j = 0; j < thetaCount; j++) {
            const ringStart = layerStart + j * pointsPerRing;
            const nextRingStart = ringStart + pointsPerRing;

            for (let k = 0; k < pointsPerRing; k++) {
                const currentPoint = ringStart + k;
                const nextPointInRing = ringStart + (k + 1) % pointsPerRing;
                edges.push([currentPoint, nextPointInRing]);  // Connect to next point in ring

                // Connect to corresponding point in the next ring within the same sphere
                if (j < thetaCount - 1) {
                    const nextRingPoint = nextRingStart + k;
                    edges.push([currentPoint, nextRingPoint]);  // Connect to corresponding point in next ring
                }

                // Connect to the same latitude and longitude point in the next 3D sphere layer (U direction)
                if (i < psiCount - 1) {
                    const correspondingPointInNextLayer = nextLayerStart + j * pointsPerRing + k;
                    edges.push([currentPoint, correspondingPointInNextLayer]);
                }
            }
        }
    }

    // Connect south pole to the last 3D sphere layer
    const southPoleIndex = hypersphereVertices.length - 1;
    const lastLayerStart = 1 + (psiCount - 1) * thetaCount * pointsPerRing;
    for (let j = 0; j < pointsPerRing; j++) {
        edges.push([southPoleIndex, lastLayerStart + j]);
    }

    return edges;
})();
