import React from "react";
import "./helpModal.css";

interface HelpModalProps {
  toggleModal: () => void;
}

const HelpModal: React.FC<HelpModalProps> = ({ toggleModal }) => {
  return (
    <div
      onClick={toggleModal}
      className={`
        fixed
        inset-0
        bg-color-black
        bg-opacity-25
        backdrop-blur-sm
        flex
        justify-center
        items-center
        `}
    >
      <div
        className="max-w-[960px] 4k:max-w-[1080px] flex flex-col mt-12"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={toggleModal}
          className="text-teal-600 text-xl 4k:text-2xl place-self-end"
        >
          X
        </button>
        <div className={`
          bg-white
          p-2
          rounded
          border
        border-teal-600
          max-h-[440px]
          overflow-y-scroll
          llt:max-h-[750px]
          4k:p-4
          4k:max-h-[1520px]
          4k:text-lg
        `}>
          <div className="bg-gradient-to-r from-teal-400 via-teal-500 to-teal-600 p-4 text-center">
            <h1 className="text-xl 4k:text-2xl font-bold">Guide</h1>
          </div>
          <div className="text-slate-700 mt-6">
            <h2 className="text-xl font-bold">
              The application supports the following algorithms:
            </h2>
            <ul className="list-disc mb-6 pl-4 pr-4">
              <li className="pt-4 pb-4">
                <strong>Dijkstra&lsquo;s Algorithm (weighted):</strong>{" "}
                <p>
                  The <i>father</i> of pathfinding algorithms; guarantees the
                  shortest path.
                </p>
              </li>
              <li className="pb-4">
                <strong>A* Search (weighted):</strong>{" "}
                <p>
                  Arguably the best pathfinding algorithm; uses heuristics to
                  guarantee the shortest path much faster than Dijkstra&lsquo;s
                  Algorithm.
                </p>
              </li>
              <li className="pb-4">
                <strong>Bellman-Ford Algorithm (weighted):</strong>{" "}
                <p>
                  A robust pathfinder. Slower than Dijkstra&lsquo;s Algorithm,
                  yet valuable for understanding edge-based optimization;
                  guarantees shortest path.
                </p>
              </li>
              <li className="mb-2">
                <strong>Greedy Best-First Search (unweighted):</strong>{" "}
                <p>
                  A faster, more heuristic-heavy version of A*; does not
                  guarantee the shortest path.
                </p>
              </li>
              <li className="mb-2">
                <strong>Bidirectional Swarm Algorithm (weighted):</strong>{" "}
                <p>
                  A bidirectional algorithm that&lsquo;s a mix of
                  Dijkstra&lsquo;s, A* and bidirectional BFS; guarantees
                  shortest path.
                </p>
              </li>
              <li className="mb-2">
                <strong>Breadth-First Search (unweighted):</strong>{" "}
                <p>A great algorithm; guarantees the shortest path.</p>
              </li>
              <li className="mb-2">
                <strong>Depth-First Search (unweighted):</strong>{" "}
                <p>
                  {" "}
                  A poor choice for pathfinding; does not guarantee the shortest
                  path.
                </p>
              </li>
            </ul>
            <h2 className="text-xl font-bold">Instructions:</h2>
            <ul className="list-disc mb-6 pl-4 pr-4 list-outside [&_ul]:list-[revert] pt-4">
              <li className="mb-2">
                Clicking the &ldquo;Visualize!&ldquo; button will initiate a
                visualization of the selected algorithm (Dijkstra&lsquo;s
                Algorithm by default).
              </li>
              <li className="mb-2">
                You can select which algorithm to visualize, by clicking the
                algorithms drop-down menu.
              </li>
              <li className="mb-2">
                You can generate mazes by choosing a maze from the mazes
                drop-down menu.
              </li>
              <ul className="ml-4">
                <li className="mb-2">
                  In addition, you can left-click, or hold left-click, and draw
                  walls on the Grid manually. Clicking on an existing wall node,
                  or trying draw over it will remove the wall.
                </li>
                <li className="mb-2">
                  The weighted maze is a great way to illustrate weighted
                  algorithms. It can represent scenarios like traffic
                  conditions, or other real-life factors that affect the speed
                  of traveling from point A to point B. The weighted nodes have
                  a weight from 2-10, or 2-15, which is dynamically set
                  depending on your viewport.
                </li>
              </ul>
              <li className="mb-2">
                You can place a bomb on a random location on the Grid by
                clicking the &ldquo;Place Bomb&ldquo; button in the menu.
              </li>
              <ul className="ml-4">
                <li className="mb-2">
                  When a bomb is placed on the Grid, it&lsquo;ll change the
                  course of the algorithm, as it must first &ldquo;defuse&ldquo;
                  the bomb before proceeding to the finish node.
                </li>
                <li className="mb-2">
                  You can subsequently remove the bomb again by clicking the
                  &ldquo;Remove Bomb&ldquo; button in the menu.
                </li>
                <li className="mb-2">
                  The bomb feature is not available for the Bidirectional Swarm
                  Algorithm.
                </li>
              </ul>
              <li className="mb-2">
                You can reset the Grid to its initial state by clicking the
                &ldquo;Reset Grid&ldquo; button in the menu.
              </li>
              <li className="mb-2">
                You can remove all walls (manually drawn, or generated by a
                maze), by clicking the &ldquo;Clear Walls&ldquo; button in the
                menu.
              </li>
              <li className="mb-2">
                You can clear a path drawn by the algrithm by clicking the
                &ldquo;Clear Path&ldquo; button in the menu.
              </li>
              <li className="mb-2">
                The Start, Target and Bomb node are classified as special nodes.
                You can drag and drop special nodes on the Grid, but you
                can&lsquo;t drop a special node on top of another special node,
                wall node, or on top of a weight node.
              </li>
              <li className="mb-2">
                You can select the animation speed of which the visited nodes,
                shortest path nodes and recursive division mazes will be
                animated: Fast, Average or Slow.
              </li>
              <li className="mb-2">
                All functionality mentioned above will be disabled during the
                active animation time of an algorithm.
              </li>
            </ul>
          </div>
          <div className="flex justify-end">
            <button
              onClick={toggleModal}
              className="text-teal-600 text-xl place-self-end"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
