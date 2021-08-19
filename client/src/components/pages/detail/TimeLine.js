import React, { useEffect, useState } from "react";

import Card from "../../layouts/Card";
import Range from "../../common/Range";

const TimeLine = ({ video }) => {
  const length = parseInt(video.lengthSeconds) || 10;
  const [values, setValues] = useState({ min: 0, max: length });

  useEffect(() => setValues({ min: 0, max: length }), [length]);

  useEffect(() => {
    const input = document.querySelector(".input-range__track--active");

    if (values.max - values.min > 480) input.style.backgroundColor = "#DC2626";
    else input.style.backgroundColor = "#10B981";
  }, [values]);

  return (
    <Card title="Timeline" defaultOpen={true}>
      <ul className="text-xs p-2">
        <li>
          <span className="font-semibold">Dureé : </span>
          {values.max - values.min} secondes
        </li>
      </ul>
      <div className="p-6">
        <Range
          minValue={0}
          maxValue={length}
          formatLabel={(value) => `${value} s`}
          value={values}
          onChange={(value) => setValues(value)}
        />
      </div>
    </Card>
  );
};

export default TimeLine;
