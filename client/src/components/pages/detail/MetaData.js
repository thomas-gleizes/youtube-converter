import React from "react";

import Card from "../../layouts/Card";

const MetaData = ({ video }) => {
  return (
    <Card title="Metadata">
      <ul className="text-xs p-2">
        <li>
          <span className="font-semibold text-gray-800">YouTube id : </span>
          {video.id}
        </li>
        <li className="truncate">
          <span className="font-semibold text-gray-800"> Titre : </span>
          {video.title}
        </li>
        <li>
          <span className="font-semibold text-gray-800">Auteur : </span>{" "}
          {video.author?.name}
        </li>
        <li className="flex justify-between">
          <span>
            <span className="font-semibold text-gray-800">Durée : </span>
            <span className={video.lengthSeconds > 480 ? "text-red-600" : ""}>
              {video.lengthSeconds}s
            </span>
          </span>
          <span className="text-xs opacity-30">max: 480s</span>
        </li>
      </ul>
    </Card>
  );
};

export default MetaData;
