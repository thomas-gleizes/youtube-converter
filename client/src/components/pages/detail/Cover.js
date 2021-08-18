import React from "react";

import Card from "../../layouts/Card";

const Cover = ({ video }) => {
  return (
    <Card title="Couverture">
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
              <button className="border w-full bg-gray-100 rounded text-sm shadow-sm transform transform hover:scale-105 hover:shadow-md duration-75">
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
