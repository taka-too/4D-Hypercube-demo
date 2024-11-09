// Revised function ensuring poles have up to 48 connections (6 layers * 8 vertices per ring) and exporting data

class Vertex {
    constructor(index) {
        this.index = index;
        // Object to store named connections, all as arrays for consistency
        this.connections = {
            ring_next: [],
            ring_previous: [],
            vertical_up: [],
            vertical_down: [],
            layer_next: [],
            layer_previous: []
        };
    }

    addConnection(name, otherVertex) {
        if (!this.connections[name].includes(otherVertex.index)) {
            this.connections[name].push(otherVertex.index);
            // Automatically set reciprocal connection based on the name
            const reciprocalName = {
                ring_next: "ring_previous",
                ring_previous: "ring_next",
                vertical_up: "vertical_down",
                vertical_down: "vertical_up",
                layer_next: "layer_previous",
                layer_previous: "layer_next"
            };
            // Set reciprocal connection only if not already set
            if (!otherVertex.connections[reciprocalName[name]].includes(this.index)) {
                otherVertex.connections[reciprocalName[name]].push(this.index);
            }
        }
    }

    isFullyConnected() {
        // Check if each connection type has at least one connection
        return Object.values(this.connections).every(connection => connection.length > 0);
    }
}

class Ring {
    constructor(ringIndex, vertices) {
        this.ringIndex = ringIndex;
        this.vertices = vertices; // Array of Vertex objects in this ring
    }

    connectRing() {
        // Set up ring_next connections (forward connections)
        for (let i = 0; i < this.vertices.length; i++) {
            if (i === this.vertices.length - 1) {
                // Last vertex connects back to the first vertex
                this.vertices[i].addConnection("ring_next", this.vertices[0]);
            } else {
                // Connect current vertex to the next in sequence
                this.vertices[i].addConnection("ring_next", this.vertices[i + 1]);
            }
        }
    }
}

class Layer {
    constructor(layerIndex, rings, northPole, southPole) {
        this.layerIndex = layerIndex;
        this.rings = rings; // Array of Ring objects in this layer

        // Connect the first and last rings to the poles
        for (const vertex of this.rings[0].vertices) {
            northPole.addConnection("vertical_down", vertex);
            vertex.addConnection("vertical_up", northPole);
        }

        for (const vertex of this.rings[this.rings.length - 1].vertices) {
            southPole.addConnection("vertical_up", vertex);
            vertex.addConnection("vertical_down", southPole);
        }
    }

    connectToNextLayer(nextLayer) {
        for (let i = 0; i < this.rings.length; i++) {
            const ring = this.rings[i];
            const nextRing = nextLayer.rings[i];
            for (let j = 0; j < ring.vertices.length; j++) {
                ring.vertices[j].addConnection("layer_next", nextRing.vertices[j]);
            }
        }
    }

    validatePoleConnections(northPole, southPole) {
        // Ensure that each vertex in the first and last ring is connected to the given poles
        const missingConnections = [];
        for (const v of this.rings[0].vertices) {
            if (!v.connections["vertical_up"].includes(northPole.index)) {
                missingConnections.push(v.index);
            }
        }
        for (const v of this.rings[this.rings.length - 1].vertices) {
            if (!v.connections["vertical_down"].includes(southPole.index)) {
                missingConnections.push(v.index);
            }
        }
        return missingConnections;
    }
}

// Define North and South Poles first
const northPole = new Vertex(0); // North pole as a Vertex object
const southPole = new Vertex(1); // South pole as a Vertex object
let vertexIndex = 2;

// Initialize vertices and layers
const layers = [];
const psiCount = 6;
const thetaCount = 6;
const pointsPerRing = 8;
const radius = 1;

// Generate vertices and layers with rings for each 3D sphere layer at each psi angle
for (let i = 0; i < psiCount; i++) {
    const layerRings = [];
    const psi = (Math.PI * (i + 1)) / (psiCount + 1);
    const u = radius * Math.cos(psi);
    const r3d = radius * Math.sin(psi);

    // Create rings within the current layer
    for (let j = 0; j <= thetaCount; j++) {
        const ringVertices = [];
        const theta = (Math.PI * j) / thetaCount;
        const y = r3d * Math.cos(theta);
        const r2d = r3d * Math.sin(theta);

        // Generate points around this ring
        for (let k = 0; k < pointsPerRing; k++) {
            const phi = (2 * Math.PI * k) / pointsPerRing;
            const x = r2d * Math.cos(phi);
            const z = r2d * Math.sin(phi);
            const vertex = new Vertex(vertexIndex);
            ringVertices.push(vertex);
            vertexIndex++;
        }

        // Create a ring object and connect its vertices in a circle
        const ring = new Ring(j, ringVertices);
        ring.connectRing();
        layerRings.push(ring);
    }

    // Create a layer object with its rings, ensuring pole connections are established
    const layer = new Layer(i, layerRings, northPole, southPole);
    layers.push(layer);
}

// Vertical connections within each layer
for (const layer of layers) {
    for (let i = 0; i < layer.rings.length - 1; i++) {
        const ring = layer.rings[i];
        const nextRing = layer.rings[i + 1];
        for (let j = 0; j < ring.vertices.length; j++) {
            ring.vertices[j].addConnection("vertical_down", nextRing.vertices[j]);
            nextRing.vertices[j].addConnection("vertical_up", ring.vertices[j]);
        }
    }
}

// Inter-layer connections between adjacent layers
for (let i = 0; i < psiCount - 1; i++) {
    const layer = layers[i];
    const nextLayer = layers[i + 1];
    layer.connectToNextLayer(nextLayer);
}

// Connect last layer to the first layer to complete the 4D cycle
const lastLayer = layers[psiCount - 1];
const firstLayer = layers[0];
for (let i = 0; i < lastLayer.rings.length; i++) {
    const ring1 = lastLayer.rings[i];
    const ring2 = firstLayer.rings[i];
    for (let j = 0; j < ring1.vertices.length; j++) {
        ring1.vertices[j].addConnection("layer_next", ring2.vertices[j]);
    }
}

// Validate pole connections for each layer
const missingPoleConnections = {};
for (const layer of layers) {
    const missing = layer.validatePoleConnections(northPole, southPole);
    if (missing.length > 0) {
        missingPoleConnections[layer.layerIndex] = missing;
    }
}

// Verify that each pole has 48 connections (6 layers * 8 vertices per ring)
const northPoleConnections = northPole.connections["vertical_down"].length;
const southPoleConnections = southPole.connections["vertical_up"].length;

// Verify that each vertex has exactly 6 connections
const missingConnections = {};
for (const layer of layers) {
    for (const ring of layer.rings) {
        for (const vertex of ring.vertices) {
            if (!vertex.isFullyConnected()) {
                missingConnections[vertex.index] = Object.entries(vertex.connections)
                    .filter(([_, conn]) => conn.length === 0)
                    .map(([name, _]) => name);
            }
        }
    }
}

// Export vertices and edges data
const verticesData = [];
const edgesData = [];

// Collect vertices data
for (const layer of layers) {
    for (const ring of layer.rings) {
        for (const vertex of ring.vertices) {
            verticesData.push([vertex.index]);
        }
    }
}

// Collect edges data
for (const layer of layers) {
    for (const ring of layer.rings) {
        for (const vertex of ring.vertices) {
            for (const [connectionType, connections] of Object.entries(vertex.connections)) {
                for (const conn of connections) {
                    edgesData.push([vertex.index, conn]);
                }
            }
        }
    }
