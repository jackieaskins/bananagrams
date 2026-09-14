import { useTable } from "spacetimedb/react";

import { tables } from "./module_bindings";

export default function App(): React.JSX.Element {
  const [rooms] = useTable(tables.rooms);

  return (
    <main>
      <h1>Bananagrams</h1>

      <h2>Rooms</h2>
      {rooms.length === 0 ? (
        <div>No rooms</div>
      ) : (
        <ul>
          {rooms.map(({ id, name }) => (
            <li key={id.toString()}>{name}</li>
          ))}
        </ul>
      )}
    </main>
  );
}
