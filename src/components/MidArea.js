import React from "react";
import Icon from "./Icon";

function Field({ value, onChange, wide }) {
  return (
    <input
      className={"text-black text-center mx-1 px-1 " + (wide ? "w-20" : "w-12")}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      onMouseDown={(e) => e.stopPropagation()}
      draggable={false}
    />
  );
}

function BlockRow({ block, onChange, onDelete, onDropOn }) {
  let bg = "bg-blue-500";
  if (block.type === "say" || block.type === "think") bg = "bg-purple-500";
  if (block.type === "repeat") bg = "bg-yellow-600";

  function onDragStart(e) {
    if (e.target.tagName === "INPUT") {
      e.preventDefault();
      return;
    }
    e.dataTransfer.setData("text/plain", "id:" + block.id);
    e.dataTransfer.effectAllowed = "move";
  }

  function onDrop(e) {
    e.preventDefault();
    e.stopPropagation();
    onDropOn(e.dataTransfer.getData("text/plain"), block.id);
  }

  return (
    <div className="my-2">
      <div
        draggable
        onDragStart={onDragStart}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        className={"inline-flex flex-row flex-wrap items-center text-white px-2 py-1 text-sm cursor-pointer " + bg}
      >
        {block.type === "move" && (
          <>
            Move
            <Field value={block.steps} onChange={(v) => onChange({ steps: v })} />
            steps
          </>
        )}
        {block.type === "turn" && (
          <>
            Turn
            <Icon
              name={block.dir === "left" ? "undo" : "redo"}
              size={15}
              className="text-white mx-2"
            />
            <Field value={block.degrees} onChange={(v) => onChange({ degrees: v })} />
            degrees
          </>
        )}
        {block.type === "goto" && (
          <>
            go to x:
            <Field value={block.x} onChange={(v) => onChange({ x: v })} />
            y:
            <Field value={block.y} onChange={(v) => onChange({ y: v })} />
          </>
        )}
        {block.type === "say" && (
          <>
            say
            <Field wide value={block.text} onChange={(v) => onChange({ text: v })} />
            for
            <Field value={block.secs} onChange={(v) => onChange({ secs: v })} />
            seconds
          </>
        )}
        {block.type === "think" && (
          <>
            think
            <Field wide value={block.text} onChange={(v) => onChange({ text: v })} />
            for
            <Field value={block.secs} onChange={(v) => onChange({ secs: v })} />
            seconds
          </>
        )}
        {block.type === "repeat" && (
          <>
            repeat
            <Field value={block.times} onChange={(v) => onChange({ times: v })} />
          </>
        )}
        <span
          className="ml-2 cursor-pointer"
          onMouseDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onDelete();
          }}
        >
          ×
        </span>
      </div>
    </div>
  );
}

export default function MidArea({ sprite, onDrop, onChange, onDelete }) {
  function onDropArea(e) {
    e.preventDefault();
    onDrop(e.dataTransfer.getData("text/plain"), null);
  }

  return (
    <div
      className="flex-1 h-full overflow-auto p-2"
      onDragOver={(e) => e.preventDefault()}
      onDrop={onDropArea}
    >
      {sprite && (
        <div className="text-sm mb-2">
          <span className="font-bold">{sprite.name}</span>
          <span className="text-gray-600">
            {" "}
            x:{Math.round(sprite.x)} y:{Math.round(sprite.y)} dir:{Math.round(sprite.direction)}
          </span>
        </div>
      )}
      {sprite && sprite.blocks.length === 0 && (
        <div className="text-gray-400 text-sm border border-dashed border-gray-300 p-4">
          Drag blocks here
        </div>
      )}
      {sprite &&
        sprite.blocks.map((block) => (
          <BlockRow
            key={block.id}
            block={block}
            onChange={(patch) => onChange(block.id, patch)}
            onDelete={() => onDelete(block.id)}
            onDropOn={onDrop}
          />
        ))}
    </div>
  );
}
