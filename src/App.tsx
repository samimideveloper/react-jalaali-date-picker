import moment, { Moment } from "moment-jalaali";
import { useState } from "react";
import { Picker } from "./components";

function App() {
  const [date, setDate] = useState<Moment>();

  return (
    <div style={{ flexDirection: "row", display: "flex", gap: 16 }}>
      <Picker
        locale={{ language: "fa" }}
        value={date}
        onChange={(value) => value && setDate(value)}
        onDayChange={(day) => console.log({ dayFa: day })}
        onMonthChange={(month) => console.log({ monthFa: month })}
        onYearChange={(year) => console.log({ yearFa: year })}
      />

      <button onClick={() => setDate(moment().add(6, "months"))}>
        add 6 months
      </button>
    </div>
  );
}

export default App;
