import React from "react";

import Card from "../../layouts/Card";
import ListItem from "../../common/ListItem";

const MetaData = ({ video }) => {
  return (
    <Card title="Metadata">
      <ul className="text-xs p-2">
        <ListItem title="Youtube id">{video.id}</ListItem>
        <ListItem title="Titre">{video.media?.song || video.title}</ListItem>
        <ListItem title={video.media?.artist ? "Artiste" : "Auteur"}>
          {video.media?.artist || video.author?.name}
        </ListItem>
        {video.media?.album && <ListItem title="Album">{video.media?.album}</ListItem>}
        <li className="flex justify-between">
          <span>
            <span className="font-semibold text-gray-800">Durée : </span>
            <span className={video.lengthSeconds > 480 ? "text-red-600" : ""}>{video.lengthSeconds}s</span>
          </span>
          <span className="text-xs opacity-30">max: 480s</span>
        </li>
      </ul>
    </Card>
  );
};

export default MetaData;
