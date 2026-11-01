import { Excalidraw } from "@excalidraw/excalidraw";
import "@excalidraw/excalidraw/index.css";

export default function ExcalidrawCanvas() {
  return (
    <div className="h-full w-full">
      <Excalidraw theme="light" UIOptions={{ canvasActions: { toggleTheme: false } }} />
    </div>
  );
}
