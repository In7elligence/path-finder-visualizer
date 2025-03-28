# Pathfinding Visualizer

This application visualizes various pathfinding algorithms. I initially built it because I hadn't had many opportunities to experiment with pathfinding algorithms in the past. Instead of grinding through a dozen LeetCode-style problems focused on graphs, I thought, _"Why not build an actual application instead?"_ So I did exactly that. I hope you enjoy seeing the algorithms in action!

You can access it here: [martin-pathfinding-visualizer.vercel.app](https://martin-pathfinding-visualizer.vercel.app/)

## About The Algorithms

### The application supports the following algorithms:

**Dijkstra's Algorithm (weighted)** – The _father_ of pathfinding algorithms; guarantees the shortest path.

**A\* Search (weighted)** - Arguably the best pathfinding algorithm; uses heuristics to guarantee the shortest path much faster than Dijkstra's Algorithm.

**Bellman-Ford Algorithm (weighted)** – A robust pathfinder. Slower than Dijkstra's Algorithm, yet valuable for understanding edge-based optimization; guarantees shortest path.

**Greedy Best-First Search (unweighted)** – A faster, more heuristic-heavy version of A\*; does not guarantee the shortest path.

**Bidirectional Swarm Algorithm (weighted)** – A bidirectional algorithm that's a mix of Dijkstra's, A\* and bidirectional BFS; guarantees shortest path.

**Breadth-First Search (unweighted)** - A great algorithm; guarantees the shortest path.

**Depth-First Search (unweighted)** - A poor choice for pathfinding; does not guarantee the shortest path.

On top of the pathfinding algorithms listed above, I also implemented a:

- **Recursive Division Maze Generation** algorithm that ensures solvability and handles special node edge cases (e.g., corners).

- **Simple Maze Generation** algorithm.

- **Weighted Maze Generation** algorithm.

- **Random Bomb Placement** algorithm that accounts for existing nodes on the grid, ensures solvability, and considers distances from the start and finish nodes.

## Guide

- Clicking the "Visualize!" button will initiate a visualization of the selected algorithm (Dijkstra's Algorithm by default).
- You can select which algorithm to visualize, by clicking the algorithms drop-down menu.
- You can generate mazes by choosing a maze from the mazes drop-down menu.
  - In addition, you can left-click, or hold left-click, and draw walls on the Grid manually. Clicking on an existing wall node, or trying draw over it will remove the wall.
  - The weighted maze is a great way to illustrate weighted algorithms. It can represent scenarios like traffic conditions, or other real-life factors that affect the speed of traveling from point A to point B. The weighted nodes have a weight of either 10 or 15, which is dynamically set depending on your viewport.
  - In addition, you can hold down left-click and the W key on your keyboad and draw weights in a desired location.
- You can place a bomb on a random location on the Grid by clicking the "Place Bomb" button in the menu.
  - When a bomb is placed on the Grid, it'll change the course of the algorithm, as it must first "defuse" the bomb before proceeding to the finish node.
  - You can subsequently remove the bomb again by clicking the "Remove Bomb" button in the menu.
  - The bomb feature is not available for the Bidirectional Swarm Algorithm.
- You can reset the Grid to its initial state by clicking the "Reset Grid" button in the menu.
- You can remove all walls (manually drawn, or generated by a maze), by clicking the "Clear Walls" button in the menu.
- You can clear a path drawn by the algrithm by clicking the "Clear Path" button in the menu.
- The Start, Target and Bomb node are classified as _special_ nodes.
  You can drag and drop special nodes on the Grid, but you can't drop a special node on top of another special node, wall node, or on top of a weight node.
- You can select the animation speed of which the visited nodes, shortest path nodes and recursive division mazes will be animated: Fast, Average or Slow.
- You can click the question mark in the menu to open a Guide modal.
- All functionality mentioned above will be disabled during the active animation time of an algorithm.

## Bidirectional Swarm Algorithm

The Bidirectional Swarm Algorithm is an idea of combining some of the best elements from the already very well-known pathfinding algorithms. It's a bidirectional hybrid of:

- A\* Search and uses its Heuristic-driven prioritization.
- Dijkstra's Algorithm for weight accumulation.
- Bidirectional BFS for simultaneous forward/backward search.

I got the idea after having played around with a lot of algorithms for the project and stumbled upon bidirectional algorithms in graph theory, which intrigued me. There are other bidirectional algorithms out there (including ones that are "swarm based"), but I still thought I'd give it a shot at creating my own, combining the elements of my favorite weighted algorithms and a popular, yet simple, bidirectional algorithm.

## Why Next.js with React and TypeScript?

The project would be more performant if it was written in pure JavaScript and simple HTML and CSS. The reason why I chose Next.js with React and TypeScript was simply due to the popular demand of React and TypeScript in the current industry. I thought it would be a good showcasing of how to handle simple project structures, components and state management. As for Next.js, I was really just looking to utilize the Vercel platform and the benefits that come with it.

## About Me!

You can find out more about me and who I am here: [martin-beck-andersen.com](https://www.martin-beck-andersen.com/)
