import React, { useContext, useEffect, useState } from "react";

import Card from "../../layouts/Card";
import { DetailsContext } from "../DetailsConversion";

const Cover = ({ video }) => {
  const [state, setState] = useContext(DetailsContext);
  const [selected, setSelected] = useState(null);

  useEffect(
    () =>
      video.thumbnails &&
      setSelected(video.thumbnails[video.thumbnails.length - 1]),
    [video.thumbnails]
  );

  useEffect(
    () =>
      setState({
        ...state,
        cover: video.thumbnails?.findIndex((cover) => cover === selected),
      }),
    [selected]
  );

  return (
    <Card title="Couverture" defaultOpen={false}>
      <>
        <div className="py-1">
          {video.thumbnails && (
            <img
              width={130}
              className="mx-auto shadow"
              src={video.thumbnails[video.thumbnails.length - 1]?.url}
              alt="cover"
            />
          )}
        </div>
        <div className="grid grid-cols-2 px-0.5 py-1">
          {video.thumbnails?.map((cover, index) => (
            <div key={index} className="my-0.5 w-11/12 mx-auto">
              <button
                onClick={() => setSelected(cover)}
                className={`border w-full rounded text-sm shadow-sm transform transform hover:scale-105 hover:shadow-md duration-75 ${
                  selected === cover
                    ? "text-white bg-gradient-to-bl from-blue-600 to-blue-800"
                    : "bg-gray-100"
                }`}
              >
                {cover?.width}x{cover?.height}
              </button>
            </div>
          ))}
        </div>
      </>
    </Card>
  );
};

export default Cover;
