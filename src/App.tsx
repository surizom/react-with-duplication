import React, { useState } from "react";

const Node = ({
  value,
  removeSelf,
  duplicateSelf,
}: {
  value: number;
  removeSelf: () => void;
  duplicateSelf: () => void;
}) => {
  const [children, setChildren] = useState<number[]>([]);

  const addChild = () => {
    const childToAdd = children.length === 0 ? 1 : Math.max(...children) + 1;

    setChildren([...children, childToAdd]);
  };

  const removeChild = (childToRemove: number) => {
    setChildren(children.filter((child) => childToRemove !== child));
  };

  return (
    <div>
      <div style={{ margin: 2 }}>
        - {value}
        <button onClick={addChild}>+</button>
        <button onClick={removeSelf}>-</button>
        <button onClick={duplicateSelf}>Dup</button>
      </div>

      <div style={{ marginLeft: 10 }}>
        {children.map((child) => (
          <Node
            value={child}
            removeSelf={() => removeChild(child)}
            duplicateSelf={addChild}
          />
        ))}
      </div>
    </div>
  );
};

function App() {
  return <Node removeSelf={() => {}} value={1} duplicateSelf={() => {}} />;
}

export default App;
