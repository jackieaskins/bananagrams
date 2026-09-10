import { useTable } from "spacetimedb/react";

import { tables } from "./module_bindings";

export default function App(): React.JSX.Element {
  const [games] = useTable(tables.games);

  return (
    <main>
      <h1>Bananagrams</h1>

      <h2>Games</h2>
      {games.length === 0 ? (
        <div>No games</div>
      ) : (
        <ul>
          {games.map(({ id, name }) => (
            <li key={id.toString()}>{name}</li>
          ))}
        </ul>
      )}
    </main>
  );
}
