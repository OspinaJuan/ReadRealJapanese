import { useState } from "react";
import React from "react";

function App() {
  // 1. Estado para guardar el texto que pega el usuario
  const [text, setText] = useState("");

  // 2. Placeholder para resultados (más adelante)
  const [tokens, setTokens] = useState([]);

  // 3. Estado para guardar popup
  const [popup, setPopup] = useState({
    visible: false,
    x: 0,
    y: 0,
    content: null
  });

  const handleClick = (e, content) => {
    const rect = e.target.getBoundingClientRect();

    setPopup({
      visible: true,
      x: rect.left,
      y: rect.bottom + 5,
      content: content
    });
  };

  const closePopup = () => {
    setPopup(prev => ({...prev, visible: false}));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      {/* Contenedor centrado */}
      <div className="max-w-3xl mx-auto space-y-6">

        {/* Título simple */}
        <h1 className="text-3xl font-semibold text-gray-800">
          ReadRealJapanese — MVP
        </h1>

        {/* Textarea controlada */}
        <textarea
          className="w-full h-48 p-4 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Pega tu texto japonés aquí..."
          value={text}
          onChange={(e) => setText(e.target.value)}
        />

        {/* Botón Analyze */}
        <button
          className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition"
          onClick={() => {
            async function analyzeText() {
              try{
                const res = await fetch("http://localhost:5001/api/text/analyze", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json"
                  },
                  body: JSON.stringify({ text })
                });

                if (!res.ok) {
                  throw new Error(`Server error: ${res.status}`);
                }

                const data = await res.json();
                setTokens(data.tokens);
              } catch (err) {
                console.error("Failed to analyze text:", err);
              }
            }
            
            analyzeText();
          }}
        >
          Analyze
        </button>

        {/* Área de resultados */}
        <div className="p-4 bg-white rounded-lg border min-h-[80px]">
          {tokens.length > 0 ? (
            tokens.map((t, i) => (
              <span 
                key={i}
                onClick={(e) => 
                  handleClick(
                    e,
                    <div>
                      {t.reading}, {t.pos}, {t.pitches}
                        <ul className="list-disc">
                          {t.meaning}
                        </ul>
                    </div>
                  )
                }
              >
                {t.surface}
              </span>
            )) 
          ) : (
            "Results will appear here."
          )}
          {/* Popup */}
            {popup.visible && (
              <div
                className="absolute bg-white border shadow-lg p-3 rounded"
                style={{ left: popup.x, top: popup.y }}
                onClick={closePopup}
              >
                {popup.content}
              </div>
            )}
        </div>
      </div>
    </div>
  )
}

export default App
