import { useState, useEffect } from 'react';

interface ReadCursorProps {
  visible: boolean;
}

export default function ReadCursor({ visible }: ReadCursorProps) {
  const [pos, setPos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    if (!visible) return;
    const move = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    window.addEventListener('mousemove', move);
    return () => window.removeEventListener('mousemove', move);
  }, [visible]);

  if (!visible) return null;

  return (
    <div
      className="fixed z-[10000] pointer-events-none flex items-center justify-center"
      style={{
        left: pos.x,
        top: pos.y,
        transform: 'translate(-50%, -50%)',
      }}
    >
      <div className="w-10 h-10 rounded-full bg-stone-900 flex items-center justify-center">
        <span className="text-white text-[7px] tracking-widest uppercase font-medium">
          читать
        </span>
      </div>
    </div>
  );
}
