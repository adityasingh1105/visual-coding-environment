import React, { useRef, useState } from "react";
import Sidebar from "./components/Sidebar";
import MidArea from "./components/MidArea";
import PreviewArea from "./components/PreviewArea";

let seq = 1;

function makeBlock(type) {
  const id = seq++;
  if (type === "move") return { id, type, steps: 10 };
  if (type === "turnLeft") return { id, type: "turn", dir: "left", degrees: 15 };
  if (type === "turnRight") return { id, type: "turn", dir: "right", degrees: 15 };
  if (type === "goto") return { id, type, x: 0, y: 0 };
  if (type === "repeat") return { id, type, times: 10 };
  if (type === "say") return { id, type, text: "Hello!", secs: 2 };
  if (type === "think") return { id, type, text: "Hmm...", secs: 2 };
  return null;
}

function num(v, fallback) {
  const n = parseFloat(v);
  if (isNaN(n)) return fallback;
  return n;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function place(blocks, block, beforeId) {
  if (!beforeId) return blocks.concat([block]);
  const out = [];
  let done = false;
  for (let i = 0; i < blocks.length; i++) {
    if (blocks[i].id === beforeId) {
      out.push(block);
      done = true;
    }
    out.push(blocks[i]);
  }
  if (!done) out.push(block);
  return out;
}

export default function App() {
  const [sprites, setSprites] = useState([
    {
      id: 1,
      name: "Sprite1",
      x: 0,
      y: 0,
      direction: 90,
      hue: 0,
      blocks: [],
      bubble: null,
    },
  ]);
  const [selected, setSelected] = useState(1);
  const [swapMsg, setSwapMsg] = useState("");
  const spritesRef = useRef(sprites);
  const runningRef = useRef(false);
  const lockUntil = useRef({});
  const swapCount = useRef(0);
  const nextId = useRef(2);

  function commit(next) {
    spritesRef.current = next;
    setSprites(next);
  }

  function updateSprite(id, fn) {
    commit(spritesRef.current.map((s) => (s.id === id ? fn(s) : s)));
  }

  function updateBlock(blockId, patch) {
    commit(
      spritesRef.current.map((s) => ({
        ...s,
        blocks: s.blocks.map((b) => (b.id === blockId ? { ...b, ...patch } : b)),
      }))
    );
  }

  function deleteBlock(blockId) {
    commit(
      spritesRef.current.map((s) => ({
        ...s,
        blocks: s.blocks.filter((b) => b.id !== blockId),
      }))
    );
  }

  function handleDrop(data, beforeId) {
    if (!data) return;
    if (data.indexOf("id:") === 0) {
      const blockId = parseInt(data.slice(3), 10);
      if (beforeId === blockId) return;
      const owner = spritesRef.current.find((s) => s.blocks.some((b) => b.id === blockId));
      if (!owner || owner.id !== selected) return;
      const block = owner.blocks.find((b) => b.id === blockId);
      const rest = owner.blocks.filter((b) => b.id !== blockId);
      commit(
        spritesRef.current.map((s) =>
          s.id === owner.id ? { ...s, blocks: place(rest, block, beforeId) } : s
        )
      );
      return;
    }
    const block = makeBlock(data);
    if (!block) return;
    commit(
      spritesRef.current.map((s) =>
        s.id === selected ? { ...s, blocks: place(s.blocks, block, beforeId) } : s
      )
    );
  }

  function addSprite() {
    const id = nextId.current;
    nextId.current = id + 1;
    const count = spritesRef.current.length;
    const sprite = {
      id: id,
      name: "Sprite" + id,
      x: count % 2 === 0 ? -140 : 140,
      y: Math.floor(count / 2) * 70,
      direction: 90,
      hue: count * 75,
      blocks: [],
      bubble: null,
    };
    commit(spritesRef.current.concat([sprite]));
    setSelected(id);
  }

  function checkSwap(id) {
    const list = spritesRef.current;
    let next = list;
    let changed = false;
    let involved = false;
    const now = Date.now();

    for (let i = 0; i < list.length; i++) {
      for (let j = i + 1; j < list.length; j++) {
        const a = list[i];
        const b = list[j];
        const hit = Math.abs(a.x - b.x) < 90 && Math.abs(a.y - b.y) < 90;
        if (!hit) continue;
        const key = a.id < b.id ? a.id + ":" + b.id : b.id + ":" + a.id;
        if (lockUntil.current[key] && lockUntil.current[key] > now) continue;
        lockUntil.current[key] = now + 1000;
        const left = next.find((s) => s.id === a.id);
        const right = next.find((s) => s.id === b.id);
        next = next.map((s) => {
          if (s.id === a.id) return { ...s, blocks: right.blocks };
          if (s.id === b.id) return { ...s, blocks: left.blocks };
          return s;
        });
        changed = true;
        if (a.id === id || b.id === id) involved = true;
      }
    }

    if (changed) {
      swapCount.current = swapCount.current + 1;
      commit(next);
      setSwapMsg("Animations swapped");
      alert("Animations swapped");
    }
    return involved;
  }

  async function runBlock(id, block) {
    const seen = swapCount.current;

    if (block.type === "move") {
      const steps = num(block.steps, 0);
      const parts = Math.max(1, Math.round(Math.abs(steps)));
      const each = steps / parts;
      for (let i = 0; i < parts; i++) {
        if (!runningRef.current) return false;
        if (swapCount.current !== seen) return true;
        updateSprite(id, (s) => {
          const rad = (s.direction * Math.PI) / 180;
          return {
            ...s,
            x: s.x + each * Math.sin(rad),
            y: s.y + each * Math.cos(rad),
          };
        });
        if (checkSwap(id) || swapCount.current !== seen) return true;
        await sleep(30);
      }
      return false;
    }

    if (block.type === "turn") {
      const deg = num(block.degrees, 0);
      const delta = block.dir === "left" ? -deg : deg;
      updateSprite(id, (s) => ({ ...s, direction: s.direction + delta }));
      await sleep(200);
      return false;
    }

    if (block.type === "goto") {
      updateSprite(id, (s) => ({
        ...s,
        x: num(block.x, 0),
        y: num(block.y, 0),
      }));
      await sleep(200);
      return checkSwap(id);
    }

    if (block.type === "say" || block.type === "think") {
      updateSprite(id, (s) => ({
        ...s,
        bubble: { kind: block.type, text: block.text || "" },
      }));
      let secs = num(block.secs, 1);
      if (secs < 0) secs = 0;
      await sleep(secs * 1000);
      updateSprite(id, (s) => ({ ...s, bubble: null }));
      return false;
    }

    return false;
  }

  async function runSprite(id) {
    let i = 0;
    while (runningRef.current) {
      const sprite = spritesRef.current.find((s) => s.id === id);
      if (!sprite) return;
      const repeatBlock = sprite.blocks.find((b) => b.type === "repeat");
      let limit = 1;
      if (repeatBlock) {
        limit = num(repeatBlock.times, 1);
        if (limit < 1) limit = 1;
        if (limit > 100) limit = 100;
      }
      if (i >= limit) return;
      const body = sprite.blocks.filter((b) => b.type !== "repeat");
      if (body.length === 0) return;
      for (let k = 0; k < body.length; k++) {
        if (!runningRef.current) return;
        const swapped = await runBlock(id, body[k]);
        if (swapped) break;
      }
      i = i + 1;
      const now = spritesRef.current.find((s) => s.id === id);
      if (!now) return;
      if (!now.blocks.find((b) => b.type === "repeat")) return;
    }
  }

  async function play() {
    if (runningRef.current) return;
    runningRef.current = true;
    setSwapMsg("");
    lockUntil.current = {};
    try {
      const ids = spritesRef.current.map((s) => s.id);
      await Promise.all(ids.map((id) => runSprite(id)));
    } finally {
      runningRef.current = false;
      commit(spritesRef.current.map((s) => ({ ...s, bubble: null })));
    }
  }

  const sprite = sprites.find((s) => s.id === selected) || sprites[0];

  return (
    <div className="bg-blue-100 pt-6 font-sans">
      <div className="h-screen overflow-hidden flex flex-row  ">
        <div className="flex-1 h-screen overflow-hidden flex flex-row bg-white border-t border-r border-gray-200 rounded-tr-xl mr-2">
          <Sidebar />
          <MidArea
            sprite={sprite}
            onDrop={handleDrop}
            onChange={updateBlock}
            onDelete={deleteBlock}
          />
        </div>
        <div className="w-1/3 h-screen overflow-hidden flex flex-row bg-white border-t border-l border-gray-200 rounded-tl-xl ml-2">
          <PreviewArea
            sprites={sprites}
            selected={selected}
            onSelect={setSelected}
            onAdd={addSprite}
            onPlay={play}
            swapMsg={swapMsg}
          />
        </div>
      </div>
    </div>
  );
}
