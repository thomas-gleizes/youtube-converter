import React, { useContext, useEffect, useMemo, useState } from "react";

import { DetailsContext } from "../DetailsConversion";
import Card from "../../layouts/Card";
import Range from "../../common/Range";

const MAX = 480;

const TimeLine = ({ video }) => {
  const length = parseInt(video.lengthSeconds) || 10;
  const [values, setValues] = useState({ min: 0, max: length });
  const [toLong, setToLong] = useState(length > MAX);
  const [state, setState] = useContext(DetailsContext);

  useEffect(() => setValues({ min: 0, max: length }), [length]);

  useEffect(() => setToLong(values.max - values.min > MAX), [values, length]);

  useEffect(() => {
    const input = document.querySelector(".input-range__track--active");

    if (values.max - values.min > MAX) input.style.backgroundColor = "#DC2626";
    else input.style.backgroundColor = "#10B981";
  }, [toLong]);

  useEffect(
    () => setState({ ...state, begin: values.min, end: values.max }),
    [values]
  );

  const delta = useMemo(() => values.max - values.min - MAX, [values]);

  return (
    <Card title="Timeline" defaultOpen={true}>
      <ul className="text-xs p-2">
        <li>
          <span className="font-semibold text-gray-800">Durée : </span>
          <span className={toLong ? "text-red-600" : ""}>
            {values.max - values.min} secondes
          </span>
        </li>
        <li>
          <span className="font-semibold text-gray-800">Max : </span>
          {MAX} secondes
        </li>
        <li>
          <span className="font-semibold text-gray-800">Delta : </span>
          <span className={toLong ? "text-red-600" : "text-green-600"}>
            {delta > 0 ? `+${delta}` : delta} secondes
          </span>
        </li>
      </ul>
      <div className="p-6">
        <Range
          minValue={0}
          maxValue={length}
          formatLabel={(value) =>
            `${parseInt(value / 60)}:${
              value % 60 >= 10 ? value % 60 : `0${value % 60}`
            }`
          }
          value={values}
          onChange={(value) => setValues(value)}
        />
      </div>
    </Card>
  );
};

export default TimeLine;
