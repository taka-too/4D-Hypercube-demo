# 4D Hypercube with Generalized Rotation and Translation - v3.1.9

## Overview
This project visualizes various 4D geometrical shapes using HTML5 Canvas and JavaScript. The core concept revolves around rendering a 4D hypercube, as well as other 4D and 3D shapes, by projecting them into 2D space with generalized rotation and translation features. The main features include multiple projection modes, rotation, and translation controls for better interaction and understanding of higher-dimensional structures.

## Features
- **Projection Modes**: Four different projection modes are available, each rendering the shape from a different 4D perspective.
- **Interactive Controls**: Users can interact with the shapes using buttons to switch shapes, zoom in/out, rotate, and translate them. Mouse and touch interactions allow dragging for dynamic rotation or translation.
- **Dynamic Vertex Size**: The size of vertices can be adjusted using a slider control.
- **Multiple Shapes**: The project includes multiple 4D and 3D shapes such as the hypercube, 3D cube, 4D tetrahedron, sphere, and hypersphere.
- **Rotation and Translation Modes**: Users can toggle between rotation and translation modes for each projection canvas.

## How to Use
1. **View Different Projections**: The display includes four different canvases, each representing a different projection of the shape. Each projection mode is described below the respective canvas.
2. **Interactive Controls**: The following controls are available:
   - **Switch Shape**: Cycle through different shapes available.
   - **Reset Position**: Reset the shape to its initial position.
   - **Zoom In/Out**: Zoom into or out of the shape.
   - **Stop Rotation**: Stops all rotations on the shape.
   - **Toggle Mode (Rotation/Translation)**: Switch between rotation and translation modes.
   - **Vertex Size Slider**: Adjust the size of the vertices rendered on the canvas.
3. **Mouse/Touch Interaction**: Drag with the mouse or swipe on a touch device to rotate or translate the shape based on the current mode.

## Included Shapes
- **Hypercube**: A 4D generalization of the cube.
- **Cube**: Standard 3D cube.
- **Tetrahedron**: A simple 3D pyramid-like shape.
- **4D Tetrahedron**: The 4D version of a tetrahedron.
- **Sphere**: Represented as a point cloud.
- **Hypersphere**: 4D version of a sphere represented as a point cloud.

## Technical Details
- **HTML & CSS**: Provides the structure and basic styling for the page.
- **JavaScript Modules**: Shape data is imported from separate JavaScript files (`hypercubeData.js`, `cubeData.js`, etc.). These files define the vertices and edges of the shapes.
- **Canvas Rendering**: Shapes are drawn onto HTML5 `<canvas>` elements using 4D to 2D projections. Different projection modes are employed to provide various perspectives of the shapes.
- **Rotation & Translation**: Implemented with generalized 4D rotations and translations, allowing users to explore the geometry in an intuitive way.
- **Interaction**: Supports both mouse and touch input for dynamic interaction with shapes.

## How It Works
- **Projection**: The 4D shapes are projected into 2D space by selecting specific 2D subspaces from the 4D coordinates. Each canvas employs a different projection order.
- **Color Representation**: The fourth dimension (`u`) is represented through color, with negative values shown in red and positive values shown in blue, giving a sense of depth and perspective.
- **Animation**: The shapes can rotate automatically, providing an ongoing visualization of their structure.

## Future Improvements
- **Additional Shapes**: More 4D and higher-dimensional shapes can be added by creating new data files and importing them.
- **Enhanced Controls**: Adding features like dynamic speed control for rotation and translations.
- **Better Rendering Techniques**: Implementing shading or lighting to enhance the perception of depth.

## Getting Started
To use this project:
1. Clone or download the repository.
2. Host the files on a local or remote server.
3. Open the `index.html` file in your browser to start exploring the 4D shapes.

## Demo
Check out the live demo of this project: [4D Hypercube Demo](https://taka-too.github.io/4D-Hypercube-demo/)

## Version Information
- **Current Version**: v3.1.9
  - Improved projection consistency across all canvases.
  - Continuous rotation updates applied to all axes.
  - Maintained object-oriented structure and mouse-based interaction features.

## License
This project is open-source and distributed under the MIT License. Feel free to use, modify, and distribute it as needed.

## Author
Developed by taka-too. Contributions and suggestions are welcome!
