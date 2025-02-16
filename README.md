# Pathfinding Visualizer

This application visualizes various pathfinding algorithms. I initially built it because I hadn't had many opportunities to experiment with pathfinding algorithms in the past. Instead of grinding through a dozen LeetCode-style problems focused on graphs, I thought, *"Why not build an actual application instead?"* So I did exactly that. I hope you enjoy seeing the algorithms in action!

You can access it here: [INSERT_LINK_TO_SITE]

## About The Algorithms

### The application supports the following algorithms:

**Dijkstra's Algorithm (weighted)** – The *father* of pathfinding algorithms; guarantees the shortest path.

**A\* Search** (weighted) - Arguably the best pathfinding algorithm; uses heuristics to guarantee the shortest path much faster than Dijkstra's Algorithm.

**Greedy Best-First Search** (weighted) – A faster, more heuristic-heavy version of A*; does not guarantee the shortest path.

**Breadth-First Search** (unweighted) - A great algorithm; guarantees the shortest path.

**Depth-First Search** (unweighted) - A poor choice for pathfinding; does not guarantee the shortest path.

On top of the pathfinding algorithms listed above, I also implemented a:

- **Recursive Division Maze Generation** algorithm that ensures solvability and handles special node edge cases (e.g., corners).

- **Simple Maze Generation** algorithm.

- **Random Bomb Placement** algorithm that accounts for existing nodes on the grid, ensures solvability, and considers distances from the start and finish nodes.

## Guide

- Clicking the "Visualize!" button will initiate a visualization of the selected algorithm (Dijkstra's Algorithm by default).
- You can select which algorithm to visualize, by clicking the algorithms drop-down menu.
- You can generate mazes by choosing a maze from the mazes drop-down menu.
  - In addition, you can left-click, or hold left-click, and draw walls on the grid manually.
- You can place a bomb on a random location on the Grid by clicking the "Place Bomb" button in the menu.
  - You can subsequently remove the bomb again by clicking the "Remove Bomb" button in the menu.
- You can reset the Grid to its initial state by clicking the "Reset Grid" button in the menu.
- You can remove all walls (manually drawn, or generated by a maze), by clicking the "Clear Walls" button in the menu.
- You can clear a path drawn by the algrithm by clicking the "Clear Path" button in the menu.
- All functionality mentioned above will be disabled during the active animation time of an algorithm.