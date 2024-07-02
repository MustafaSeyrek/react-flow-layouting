import { useCallback } from "react";
import ReactFlow, {
  Background,
  Controls,
  Edge,
  Node,
  OnConnect,
  addEdge,
  useEdgesState,
  useNodesState,
} from "reactflow";
import "reactflow/dist/style.css";

const initialNodes: Node[] = [
  { id: "1", data: { label: "Node 1" }, position: { x: 0, y: 0 } },
  { id: "2", data: { label: "Node 2" }, position: { x: 200, y: 50 } },
  { id: "3", data: { label: "Node 3" }, position: { x: 400, y: 100 } },
];

function App() {
  const [nodes, setNodes, onNodesChange] = useNodesState<Node[]>(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge[]>([]);

  const onConnect: OnConnect = useCallback(
    (connection) => setEdges((eds) => addEdge(connection, eds)),
    [setEdges]
  );

  const layouting = (type: string) => {
    let minX: number = Number.MAX_VALUE,
      minY: number = Number.MAX_VALUE;

    //get selected nodes
    const selectedNodes = nodes.filter((node: Node) => node.selected);
    if (selectedNodes.length > 1) {
      selectedNodes.map(
        (node: Node) => (
          (minX = Math.min(node.position.x, minX)),
          (minY = Math.min(node.position.y, minY))
        )
      );

      selectedNodes.map((node: Node) =>
        setNodes((nodes: Node[]) =>
          nodes.map((n: Node) => {
            if (n.id === node.id) {
              if (type === "vertical") {
                //vertical layouting
                n.position.x = minX;
              } else if (type === "horizontal") {
                //horizontal layouting
                n.position.y = minY;
              }
            }

            return n;
          })
        )
      );
    }
  };

  return (
    <div style={{ height: "90vh" }}>
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        fitView
      >
        <Background />
        <Controls style={{ display: "flex", flexDirection: "column" }}>
          <button onClick={() => layouting("vertical")}>V</button>
          <button onClick={() => layouting("horizontal")}>H</button>
        </Controls>
      </ReactFlow>
    </div>
  );
}

export default App;
