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
        {children &&
          Object.keys(children).map((child) => (
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

  console.log({ tree });

  const removeChild =
    (...coordinates: number[]) =>
    (childToRemove: number) => {
      const preexistingChildren = get(tree, coordinates.join("."));

      const temporaryMutatedObject = set(
        structuredClone(tree),
        coordinates.join("."),
        omit(preexistingChildren, childToRemove)
      );

      setTree(temporaryMutatedObject);
    };

  const addChild = (...coordinates: number[]) => {
    const preexistingChildren = get(tree, coordinates.join("."));

    const childToAdd =
      Object.keys(preexistingChildren).length === 0
        ? 1
        : Math.max(
            ...Object.keys(preexistingChildren).map((truc) => parseInt(truc))
          ) + 1;

    const temporaryMutatedObject = set(
      structuredClone(tree),
      coordinates.join("."),
      {
        ...preexistingChildren,
        [childToAdd]: {},
      }
    );

    setTree(temporaryMutatedObject);
  };

  const duplicateNode =
    (...coordinates: number[]) =>
    (nodeToDuplicate: number) => {
      const nodeToDuplicateParent = get(tree, coordinates.join("."));

      const preexistingNodeToDuplicateChildren = get(
        tree,
        [...coordinates, nodeToDuplicate].join(".")
      );

      const numberOfDuplicatedNode =
        Object.keys(nodeToDuplicateParent).length === 0
          ? 1
          : Math.max(
              ...Object.keys(nodeToDuplicateParent).map((truc) =>
                parseInt(truc)
              )
            ) + 1;

      const temporaryMutatedObject = set(
        structuredClone(tree),
        [...coordinates, numberOfDuplicatedNode].join("."),
        preexistingNodeToDuplicateChildren
      );

      setTree(temporaryMutatedObject);
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
