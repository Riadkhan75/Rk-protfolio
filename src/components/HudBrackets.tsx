export default function HudBrackets() {
  return (
    <div className="fixed inset-0 pointer-events-none z-[60]">
      {/* HUD: Corner Brackets */}
      <div className="absolute top-8 left-8 w-12 h-12 border-t-2 border-l-2 border-[#00f3ff] shadow-[0_0_15px_#00f3ff]" />
      <div className="absolute top-8 right-8 w-12 h-12 border-t-2 border-r-2 border-[#ff00ff] shadow-[0_0_15px_#ff00ff]" />
      <div className="absolute bottom-8 left-8 w-12 h-12 border-b-2 border-l-2 border-[#ff00ff] shadow-[0_0_15px_#ff00ff]" />
      <div className="absolute bottom-8 right-8 w-12 h-12 border-b-2 border-r-2 border-[#00f3ff] shadow-[0_0_15px_#00f3ff]" />
    </div>
  );
}
