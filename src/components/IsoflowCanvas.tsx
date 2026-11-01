import Isoflow from "isoflow";

export default function IsoflowCanvas() {
  return (
    <div className="h-full w-full">
      <Isoflow editorMode="EDITABLE" />
    </div>
  );
}
