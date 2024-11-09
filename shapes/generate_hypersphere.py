# Revised function ensuring poles have up to 48 connections (6 layers * 8 vertices per ring)

def generate_hypersphere_data_with_correct_pole_connections():
    class Vertex:
        def __init__(self, index):
            self.index = index
            # Dictionary to store named connections, all as lists for consistency
            self.connections = {
                "ring_next": [],
                "ring_previous": [],
                "vertical_up": [],
                "vertical_down": [],
                "layer_next": [],
                "layer_previous": []
            }

        def add_connection(self, name, other_vertex):
            if other_vertex.index not in self.connections[name]:
                self.connections[name].append(other_vertex.index)
                # Automatically set reciprocal connection based on the name
                reciprocal_name = {
                    "ring_next": "ring_previous",
                    "ring_previous": "ring_next",
                    "vertical_up": "vertical_down",
                    "vertical_down": "vertical_up",
                    "layer_next": "layer_previous",
                    "layer_previous": "layer_next"
                }
                # Set reciprocal connection only if not already set
                if self.index not in other_vertex.connections[reciprocal_name[name]]:
                    other_vertex.connections[reciprocal_name[name]].append(self.index)

        def is_fully_connected(self):
            # Check if each connection type has at least one connection
            return all(len(connection) > 0 for connection in self.connections.values())

    class Ring:
        def __init__(self, ring_index, vertices):
            self.ring_index = ring_index
            self.vertices = vertices  # List of Vertex objects in this ring

        def connect_ring(self):
            # Set up ring_next connections (forward connections)
            for i in range(len(self.vertices)):
                if i == len(self.vertices) - 1:
                    # Last vertex connects back to the first vertex
                    self.vertices[i].add_connection("ring_next", self.vertices[0])
                else:
                    # Connect current vertex to the next in sequence
                    self.vertices[i].add_connection("ring_next", self.vertices[i + 1])

    class Layer:
        def __init__(self, layer_index, rings, north_pole, south_pole):
            self.layer_index = layer_index
            self.rings = rings  # List of Ring objects in this layer

            # Connect the first and last rings to the poles
            for vertex in self.rings[0].vertices:
                north_pole.add_connection("vertical_down", vertex)
                vertex.add_connection("vertical_up", north_pole)

            for vertex in self.rings[-1].vertices:
                south_pole.add_connection("vertical_up", vertex)
                vertex.add_connection("vertical_down", south_pole)

        def connect_to_next_layer(self, next_layer):
            for ring, next_ring in zip(self.rings, next_layer.rings):
                for v1, v2 in zip(ring.vertices, next_ring.vertices):
                    v1.add_connection("layer_next", v2)

        def validate_pole_connections(self, north_pole, south_pole):
            # Ensure that each vertex in the first and last ring is connected to the given poles
            missing_connections = []
            for v in self.rings[0].vertices:
                if north_pole.index not in v.connections["vertical_up"]:
                    missing_connections.append(v.index)
            for v in self.rings[-1].vertices:
                if south_pole.index not in v.connections["vertical_down"]:
                    missing_connections.append(v.index)
            return missing_connections

    # Define North and South Poles first
    north_pole = Vertex(0)  # North pole as a Vertex object
    south_pole = Vertex(1)  # South pole as a Vertex object
    vertex_index = 2

    # Initialize vertices and layers
    layers = []
    psi_count = 6
    theta_count = 6
    points_per_ring = 8
    radius = 1

    # Generate vertices and layers with rings for each 3D sphere layer at each psi angle
    for i in range(psi_count):
        layer_rings = []
        psi = (math.pi * (i + 1)) / (psi_count + 1)
        u = radius * math.cos(psi)
        r3d = radius * math.sin(psi)

        # Create rings within the current layer
        for j in range(theta_count + 1):
            ring_vertices = []
            theta = (math.pi * j) / theta_count
            y = r3d * math.cos(theta)
            r2d = r3d * math.sin(theta)

            # Generate points around this ring
            for k in range(points_per_ring):
                phi = (2 * math.pi * k) / points_per_ring
                x = r2d * math.cos(phi)
                z = r2d * math.sin(phi)
                vertex = Vertex(vertex_index)
                ring_vertices.append(vertex)
                vertex_index += 1

            # Create a ring object and connect its vertices in a circle
            ring = Ring(j, ring_vertices)
            ring.connect_ring()
            layer_rings.append(ring)

        # Create a layer object with its rings, ensuring pole connections are established
        layer = Layer(i, layer_rings, north_pole, south_pole)
        layers.append(layer)

    # Vertical connections within each layer
    for layer in layers:
        for ring, next_ring in zip(layer.rings, layer.rings[1:]):
            for v1, v2 in zip(ring.vertices, next_ring.vertices):
                v1.add_connection("vertical_down", v2)
                v2.add_connection("vertical_up", v1)

    # Inter-layer connections between adjacent layers
    for i in range(psi_count - 1):
        layer = layers[i]
        next_layer = layers[i + 1]
        layer.connect_to_next_layer(next_layer)

    # Connect last layer to the first layer to complete the 4D cycle
    last_layer = layers[psi_count - 1]
    first_layer = layers[0]
    for ring1, ring2 in zip(last_layer.rings, first_layer.rings):
        for v1, v2 in zip(ring1.vertices, ring2.vertices):
            v1.add_connection("layer_next", v2)

    # Validate pole connections for each layer
    missing_pole_connections = {}
    for layer in layers:
        missing = layer.validate_pole_connections(north_pole, south_pole)
        if missing:
            missing_pole_connections[layer.layer_index] = missing

    # Verify that each pole has 48 connections (6 layers * 8 vertices per ring)
    north_pole_connections = len(north_pole.connections["vertical_down"])
    south_pole_connections = len(south_pole.connections["vertical_up"])

    # Verify that each vertex has exactly 6 connections
    missing_connections = {}
    for vertex in layers[0].rings[0].vertices + layers[-1].rings[-1].vertices:  # Verify all vertices, especially in poles
        if not vertex.is_fully_connected():
            missing_connections[vertex.index] = [name for name, conn in vertex.connections.items() if len(conn) == 0]

    return missing_connections, missing_pole_connections, north_pole_connections, south_pole_connections

# Run the function and identify vertices with missing connections
missing_connections, missing_pole_connections, north_pole_connections, south_pole_connections = generate_hypersphere_data_with_correct_pole_connections()
print(missing_connections, missing_pole_connections, north_pole_connections, south_pole_connections)
