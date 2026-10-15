import React from "react";
import Icon from "./Icon";

function drag(e, type) {
  e.dataTransfer.setData("text/plain", type);
  e.dataTransfer.effectAllowed = "copy";
}

export default function Sidebar() {
  return (
    <div className="w-60 flex-none h-full overflow-y-auto flex flex-col items-start p-2 border-r border-gray-200">
      <div className="font-bold"> {"Events"} </div>
      <div className="flex flex-row flex-wrap bg-yellow-500 text-white px-2 py-1 my-2 text-sm cursor-pointer">
        {"When "}
        <Icon name="flag" size={15} className="text-green-600 mx-2" />
        {"clicked"}
      </div>
      <div className="flex flex-row flex-wrap bg-yellow-500 text-white px-2 py-1 my-2 text-sm cursor-pointer">
        {"When this sprite clicked"}
      </div>
      <div className="font-bold"> {"Motion"} </div>
      <div
        draggable
        onDragStart={(e) => drag(e, "move")}
        className="flex flex-row flex-wrap bg-blue-500 text-white px-2 py-1 my-2 text-sm cursor-pointer"
      >
        {"Move 10 steps"}
      </div>
      <div
        draggable
        onDragStart={(e) => drag(e, "turnLeft")}
        className="flex flex-row flex-wrap bg-blue-500 text-white px-2 py-1 my-2 text-sm cursor-pointer"
      >
        {"Turn "}
        <Icon name="undo" size={15} className="text-white mx-2" />
        {"15 degrees"}
      </div>
      <div
        draggable
        onDragStart={(e) => drag(e, "turnRight")}
        className="flex flex-row flex-wrap bg-blue-500 text-white px-2 py-1 my-2 text-sm cursor-pointer"
      >
        {"Turn "}
        <Icon name="redo" size={15} className="text-white mx-2" />
        {"15 degrees"}
      </div>
      <div
        draggable
        onDragStart={(e) => drag(e, "goto")}
        className="flex flex-row flex-wrap bg-blue-500 text-white px-2 py-1 my-2 text-sm cursor-pointer"
      >
        {"go to x: 0 y: 0"}
      </div>
      <div className="font-bold"> {"Looks"} </div>
      <div
        draggable
        onDragStart={(e) => drag(e, "say")}
        className="flex flex-row flex-wrap bg-purple-500 text-white px-2 py-1 my-2 text-sm cursor-pointer"
      >
        {"say Hello! for 2 seconds"}
      </div>
      <div
        draggable
        onDragStart={(e) => drag(e, "think")}
        className="flex flex-row flex-wrap bg-purple-500 text-white px-2 py-1 my-2 text-sm cursor-pointer"
      >
        {"think Hmm... for 2 seconds"}
      </div>
      <div className="font-bold"> {"Control"} </div>
      <div
        draggable
        onDragStart={(e) => drag(e, "repeat")}
        className="flex flex-row flex-wrap bg-yellow-600 text-white px-2 py-1 my-2 text-sm cursor-pointer"
      >
        {"repeat 10"}
      </div>
    </div>
  );
}
