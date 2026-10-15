import React from "react";
import CatSprite from "./CatSprite";
import Icon from "./Icon";

export default function PreviewArea({ sprites, selected, onSelect, onAdd, onPlay, swapMsg }) {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="relative flex-1 overflow-hidden">
        <div className="absolute" style={{ top: 8, left: 8, zIndex: 10 }}>
          <button
            type="button"
            onClick={onPlay}
            className="bg-green-500 text-white text-sm px-2 py-1 rounded flex flex-row items-center"
          >
            <Icon name="flag" size={14} className="text-white mr-1" />
            Play
          </button>
        </div>
        {swapMsg ? (
          <div className="absolute text-sm text-red-600" style={{ top: 12, left: 84, zIndex: 10 }}>
            {swapMsg}
          </div>
        ) : null}
        {sprites.map((s) => (
          <div
            key={s.id}
            onClick={() => onSelect(s.id)}
            className="absolute cursor-pointer"
            style={{
              left: "50%",
              top: "50%",
              transform:
                "translate(-50%, -50%) translate(" +
                Math.round(s.x * 10) / 10 +
                "px, " +
                Math.round(-s.y * 10) / 10 +
                "px)",
              zIndex: selected === s.id ? 2 : 1,
            }}
          >
            {s.bubble && (
              <div
                className={
                  "absolute bg-white text-black text-sm px-2 py-1 border border-gray-400 whitespace-nowrap " +
                  (s.bubble.kind === "think" ? "rounded-full" : "rounded")
                }
                style={{ bottom: "100%", left: "50%", transform: "translateX(-50%)", marginBottom: 8 }}
              >
                {s.bubble.text}
              </div>
            )}
            <div
              className={selected === s.id ? "border-2 border-blue-400" : ""}
              style={{
                transform: "rotate(" + (s.direction - 90) + "deg)",
                filter: "hue-rotate(" + s.hue + "deg)",
              }}
            >
              <CatSprite />
            </div>
          </div>
        ))}
      </div>
      <div className="flex flex-row items-center border-t border-gray-200 bg-gray-100 p-2 overflow-x-auto">
        {sprites.map((s) => (
          <div
            key={s.id}
            onClick={() => onSelect(s.id)}
            className={
              "flex flex-col items-center mr-2 p-1 border cursor-pointer bg-white " +
              (selected === s.id ? "border-blue-500" : "border-gray-200")
            }
          >
            <div className="w-12 h-12 overflow-hidden">
              <div
                style={{
                  transform: "scale(0.45)",
                  transformOrigin: "top left",
                  filter: "hue-rotate(" + s.hue + "deg)",
                }}
              >
                <CatSprite />
              </div>
            </div>
            <span className="text-xs">{s.name}</span>
          </div>
        ))}
        <div
          onClick={onAdd}
          className="flex flex-col items-center justify-center border border-gray-200 bg-white p-1 cursor-pointer w-16 h-16"
        >
          <Icon name="plus" size={14} className="text-gray-600" />
          <span className="text-xs">Sprite</span>
        </div>
      </div>
    </div>
  );
}
