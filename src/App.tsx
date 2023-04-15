import React, { useState } from "react";
import { set, get, omit } from "lodash";

const Node = ({
  value,
  addChild,
  children,
  removeChild,
  duplicateNode,
}: {
  children: any;
  value: number;
  addChild: (...coordinates: number[]) => void;
  removeChild: (...coordinates: number[]) => (child: number) => void;
  duplicateNode: (
    ...coordinates: number[]
  ) => (nodeToDuplicate: number) => void;
}) => {
  return (
    <div>
      <div style={{ margin: 3 }}>
        - {value}
        <button onClick={() => addChild(value)}>+</button>
        <button onClick={() => removeChild()(value)}>-</button>
        <button onClick={() => duplicateNode()(value)}>Duplicate</button>
      </div>

      <div style={{ marginLeft: 20 }}>
        {Object.keys(children).map((child) => (
          <Node
            key={child}
            children={children[child]}
            removeChild={(...coordinates: number[]) =>
              (child: number) =>
                removeChild(value, ...coordinates)(child)}
            duplicateNode={(...coordinates: number[]) =>
              (child: number) =>
                duplicateNode(value, ...coordinates)(child)}
            value={parseInt(child)}
            addChild={(...coordinates: number[]) =>
              addChild(value, ...coordinates)
            }
          />
        ))}
      </div>
    </div>
  );
};

function App() {
  const [tree, setTree] = useState({ 1: {} });

  const removeChild =
    (...coordinates: number[]) =>
    (childToRemove: number) => {
      const preexistingChildren = get(tree, coordinates.join("."));

      const treeWithChildRemoved = set(
        structuredClone(tree),
        coordinates.join("."),
        omit(preexistingChildren, childToRemove)
      );

      setTree(treeWithChildRemoved);
    };

  const addChild = (...coordinates: number[]) => {
    const preexistingChildren = get(tree, coordinates.join("."));

    const childToAdd =
      Object.keys(preexistingChildren).length === 0
        ? 1
        : Math.max(
            ...Object.keys(preexistingChildren).map((truc) => parseInt(truc))
          ) + 1;

    const treeWithChildAdded = set(
      structuredClone(tree),
      coordinates.join("."),
      {
        ...preexistingChildren,
        [childToAdd]: {},
      }
    );

    setTree(treeWithChildAdded);
  };

  const duplicateNode =
    (...coordinates: number[]) =>
    (nodeToDuplicate: number) => {
      const nodeToDuplicateSiblings = get(tree, coordinates.join("."));

      const nodeToDuplicateChildren = get(
        tree,
        [...coordinates, nodeToDuplicate].join(".")
      );

      const newDuplicatedNodeValue =
        Object.keys(nodeToDuplicateSiblings).length === 0
          ? 1
          : Math.max(
              ...Object.keys(nodeToDuplicateSiblings).map((truc) =>
                parseInt(truc)
              )
            ) + 1;

      const treeWithNodeDuplicated = set(
        structuredClone(tree),
        [...coordinates, newDuplicatedNodeValue].join("."),
        nodeToDuplicateChildren
      );

      setTree(treeWithNodeDuplicated);
    };

  return (
    <Node
      addChild={addChild}
      removeChild={removeChild}
      value={1}
      children={tree[1]}
      duplicateNode={duplicateNode}
    />
  );
}

export default App;
