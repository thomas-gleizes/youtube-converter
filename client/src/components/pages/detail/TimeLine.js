import React, { useContext, useEffect, useMemo, useState } from "react";

import { useCallbackRef } from "../../../hooks";
import { DetailsContext } from "../DetailsConversion";
import Card from "../../layouts/Card";
import ListItem from "../../common/ListItem";
import Range from "../../common/Range";

const MAX = 480;

const TimeLine = ({ video }) => {
  const length = parseInt(video.lengthSeconds);

  const [values, setValues] = useState({ min: 0, max: length });
  const [state, setState] = useContext(DetailsContext);

  const [node, ref] = useCallbackRef();

  const toLong = useMemo(() => values.max - values.min > MAX, [values, length]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => setValues({ min: 0, max: length }), [length]);

  useEffect(() => {
    const input = document.querySelector(".input-range__track--active");

    if (input)
      if (values.max - values.min > MAX) input.style.backgroundColor = "#DC2626";
      else input.style.backgroundColor = "#10B981";
  }, [toLong, values, node]);

  useEffect(() => setState({ ...state, begin: values.min, end: values.max }), [values, node]); // eslint-disable-line react-hooks/exhaustive-deps

  const delta = useMemo(() => values.max - values.min - MAX, [values, node]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <Card innerRef={ref} title="Timeline" defaultOpen={false}>
      <ul className="text-xs p-2">
        <ListItem title="Durée">
          <span className={toLong ? "text-red-600" : ""}>{values.max - values.min} secondes</span>
        </ListItem>
        <ListItem title="Max"> {MAX} secondes</ListItem>
        <ListItem title="Delta">
          <span className={toLong ? "text-red-600" : "text-green-600"}>
            {delta > 0 ? `+${delta}` : delta} secondes
          </span>
        </ListItem>
      </ul>
      <div className="p-6">
        <Range
          minValue={0}
          maxValue={length}
          formatLabel={(value) =>
            `${parseInt(value / 60)}:${value % 60 >= 10 ? value % 60 : `0${value % 60}`}`
          }
          value={values}
          onChange={(value) => setValues(value)}
        />
      </div>
    </Card>
  );
};

export default TimeLine;
