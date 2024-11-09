// Define vertices and edges for a 3D sphere in (x, y, z, 0) coordinates
export const sphereVertices = (() => {
    const vertices = [
        [0, 1, 0, 0],  // North pole
    ];

    // Parameters for sphere
    const radius = 1;
    const ringCount = 8; // Excluding poles
    const pointsPerRing = 10; // Points per latitude ring

    // Generate vertices for each latitude ring (excluding poles)
    for (let i = 1; i <= ringCount; i++) {
        const theta = (Math.PI * i) / (ringCount + 1);  // Latitude angle
        const ringRadius = radius * Math.sin(theta);
        const y = radius * Math.cos(theta);  // Height along y-axis

        // Generate points around this ring
        for (let j = 0; j < pointsPerRing; j++) {
            const phi = (2 * Math.PI * j) / pointsPerRing;  // Longitude angle
            const x = ringRadius * Math.cos(phi);
            const z = ringRadius * Math.sin(phi);
            vertices.push([x, y, z, 0]);
        }
    }

    // Add south pole
    vertices.push([0, -radius, 0, 0]);  // South pole

    return vertices;
})();

export const sphereEdges = (() => {
    const edges = [];
    const ringCount = 18;
    const pointsPerRing = 20;

    // Connect north pole to the first ring
    for (let j = 0; j < pointsPerRing; j++) {
        edges.push([0, j + 1]);  // 0 is the north pole
    }

    // Connect each ring's points to their neighbors in the same ring and the next ring
    for (let i = 0; i < ringCount; i++) {
        const ringStart = 1 + i * pointsPerRing;
        const nextRingStart = ringStart + pointsPerRing;

        for (let j = 0; j < pointsPerRing; j++) {
            const currentPoint = ringStart + j;
            const nextPointInRing = ringStart + (j + 1) % pointsPerRing;
            edges.push([currentPoint, nextPointInRing]);  // Connect to next point in the ring

            if (i < ringCount - 1) {
                const nextRingPoint = nextRingStart + j;
                edges.push([currentPoint, nextRingPoint]);  // Connect to corresponding point in the next ring
            }
        }
    }

    // Connect south pole to the last ring
    const southPoleIndex = (ringCount * pointsPerRing) + 1;
    const lastRingStart = 1 + (ringCount - 1) * pointsPerRing;
    for (let j = 0; j < pointsPerRing; j++) {
        edges.push([southPoleIndex, lastRingStart + j]);
    }

    return edges;
})();
