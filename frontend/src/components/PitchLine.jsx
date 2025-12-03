export default function PitchLine({ reading, accent, pattern }) {
  if (!reading || !pattern) return null;

  return (
    <div className="mb-2">
      <div className="flex gap-1 justify-center">
        {pattern.map((p, i) => (
          <span
            key={i}
            style={{
              display: "inline-block",
              borderTop: `2px solid ${p === "H" ? "red" : "gray"}`,
              width: "1.2em",
              height: "0.3em"
            }}
          />
        ))}
      </div>
      <div className="text-center text-lg">{reading}</div>
      <div className="text-center text-sm text-gray-500">
        accent: {accent}
      </div>
    </div>
  );
}
