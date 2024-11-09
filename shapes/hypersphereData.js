// Define a Layer class to manage vertices and edges within each layer
class Layer {
    constructor(layerIndex, vertices) {
        this.layerIndex = layerIndex;
        this.vertices = vertices;  // List of vertex indices in this layer
        this.edges = [];  // List to store edges within this layer
    }

    addEdge(v1, v2) {
        this.edges.push([v1, v2]);
    }

    connectTo(otherLayer, pointPairs) {
        // Connect points in this layer to corresponding points in another layer
        for (let [p1, p2] of pointPairs) {
            this.addEdge(this.vertices[p1], otherLayer.vertices[p2]);
            otherLayer.addEdge(otherLayer.vertices[p2], this.vertices[p1]);
        }
    }
}

// Main function to generate vertices and edges for the hypersphere
function generateHypersphereData() {
    const vertices = [[0, 0, 0, 1]];  // North pole
    const layers = [];
    const psiCount = 6;
    const thetaCount = 6;
    const pointsPerRing = 8;
    const radius = 1;
    let vertexIndex = 1;

    // Generate vertices for each 3D sphere layer at each psi angle
    for (let i = 0; i < psiCount; i++) {
        const layerVertices = [];
        const psi = (Math.PI * (i + 1)) / (psiCount + 1);
        const u = radius * Math.cos(psi);
        const r3d = radius * Math.sin(psi);

        for (let j = 0; j <= thetaCount; j++) {
            const theta = (Math.PI * j) / thetaCount;
            const y = r3d * Math.cos(theta);
            const r2d = r3d * Math.sin(theta);

            for (let k = 0; k < pointsPerRing; k++) {
                const phi = (2 * Math.PI * k) / pointsPerRing;
                const x = r2d * Math.cos(phi);
                const z = r2d * Math.sin(phi);
                vertices.push([x, y, z, u]);
                layerVertices.push(vertexIndex);
                vertexIndex++;
            }
        }

        layers.push(new Layer(i, layerVertices));
    }

    const southPoleIndex = vertices.length;
    vertices.push([0, 0, 0, -1]);  // South pole

    // Connect north pole to the first layer
    for (let j = 0; j < pointsPerRing; j++) {
        layers[0].addEdge(0, layers[0].vertices[j]);
    }

    // Intra-layer connections (within each layer)
    for (let layer of layers) {
        for (let j = 0; j < thetaCount; j++) {
            const ringStart = j * pointsPerRing;
            for (let k = 0; k < pointsPerRing; k++) {
                const currentPoint = layer.vertices[ringStart + k];
                const nextPointInRing = layer.vertices[ringStart + (k + 1) % pointsPerRing];
                layer.addEdge(currentPoint, nextPointInRing);

                // Vertical connection to the next ring in the same layer
                if (j < thetaCount - 1) {
                    const nextRingPoint = layer.vertices[ringStart + pointsPerRing + k];
                    layer.addEdge(currentPoint, nextRingPoint);
                }
            }
        }
    }

    // Inter-layer connections between adjacent layers
    for (let i = 0; i < psiCount - 1; i++) {
        const layer1 = layers[i];
        const layer2 = layers[i + 1];
        for (let j = 0; j < thetaCount; j++) {
            const ringStart1 = j * pointsPerRing;
            const ringStart2 = j * pointsPerRing;
            for (let k = 0; k < pointsPerRing; k++) {
                layer1.addEdge(layer1.vertices[ringStart1 + k], layer2.vertices[ringStart2 + k]);
            }
        }
    }

    // Connect last layer to the first layer to complete the cycle
    const lastLayer = layers[psiCount - 1];
    const firstLayer = layers[0];
    for (let j = 0; j < thetaCount; j++) {
        const ringStartLast = j * pointsPerRing;
        const ringStartFirst = j * pointsPerRing;
        for (let k = 0; k < pointsPerRing; k++) {
            lastLayer.addEdge(lastLayer.vertices[ringStartLast + k], firstLayer.vertices[ringStartFirst + k]);
        }
    }

    // Connect south pole to the last layer
    for (let j = 0; j < pointsPerRing; j++) {
        lastLayer.addEdge(southPoleIndex, lastLayer.vertices[(thetaCount - 1) * pointsPerRing + j]);
    }

    // Collect all edges from layers
    const edges = layers.flatMap(layer => layer.edges);

    return { vertices, edges };
}

// Generate data
const hypersphereData = generateHypersphereData();
export const hypersphereVertices = hypersphereData.vertices;
export const hypersphereEdges = hypersphereData.edges;
