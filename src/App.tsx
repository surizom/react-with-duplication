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
  addChild: (...path: number[]) => void;
  removeChild: (...path: number[]) => (child: number) => void;
  duplicateNode: (...path: number[]) => (nodeToDuplicate: number) => void;
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
            removeChild={(...path: number[]) =>
              (child: number) =>
                removeChild(value, ...path)(child)}
            duplicateNode={(...path: number[]) =>
              (child: number) =>
                duplicateNode(value, ...path)(child)}
            value={parseInt(child)}
            addChild={(...path: number[]) => addChild(value, ...path)}
          />
        ))}
      </div>
    </div>
  );
};

function App() {
  const [tree, setTree] = useState({ 1: {} });

  const getNodeChildren = (...path: number[]) => get(tree, path.join("."));

  const setNodeChildren =
    (...path: number[]) =>
    (newChildren: {}) => {
      const treeWithChildRemoved = set(
        structuredClone(tree),
        path.join("."),
        newChildren
      );

      setTree(treeWithChildRemoved);
    };

  const removeChild =
    (...path: number[]) =>
    (childToRemove: number) => {
      const preexistingChildren = getNodeChildren(...path);

      setNodeChildren(...path)(omit(preexistingChildren, childToRemove));
    };

  const addChild = (...path: number[]) => {
    const preexistingChildren = getNodeChildren(...path);

    const childToAdd =
      Object.keys(preexistingChildren).length === 0
        ? 1
        : Math.max(
            ...Object.keys(preexistingChildren).map((child) => parseInt(child))
          ) + 1;

    setNodeChildren(...path)({ ...preexistingChildren, [childToAdd]: {} });
  };

  const duplicateNode =
    (...path: number[]) =>
    (nodeToDuplicate: number) => {
      const nodeToDuplicateSiblings = getNodeChildren(...path);

      const nodeToDuplicateChildren = get(
        tree,
        [...path, nodeToDuplicate].join(".")
      );

      const newDuplicatedNodeValue =
        Object.keys(nodeToDuplicateSiblings).length === 0
          ? 1
          : Math.max(
              ...Object.keys(nodeToDuplicateSiblings).map((truc) =>
                parseInt(truc)
              )
            ) + 1;

      setNodeChildren(...path, newDuplicatedNodeValue)(nodeToDuplicateChildren);
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
