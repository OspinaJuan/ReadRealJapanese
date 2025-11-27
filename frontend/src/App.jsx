import { useState } from "react"

function App() {
  // 1. Estado para guardar el texto que pega el usuario
  const [text, setText] = useState("")

  // 2. Placeholder para resultados (más adelante)
  const [tokens, setTokens] = useState(null)

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
              const res = await fetch("http://localhost:5000/api/analyze", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json"
                },
                body: JSON.stringify({ text })
              });

              const data = await res.json();
              setTokens(data.analyzedText);
            }
            
            analyzeText();
          }}
        >
          Analyze
        </button>

        {/* Área de resultados */}
        <div className="p-4 bg-white rounded-lg border min-h-[80px]">
          {tokens ? (
            tokens.map((token, index) => (
              <div key={index} className="py-1">
                <strong>{token.surface}</strong> ({token.reading}) - {token.pos}
                <br />
                {token.meaning}
              </div> 
            ))
          ) : (
            "Resultados aparecerán aquí."
          )}
        </div>
      </div>
    </div>
  )
}

export default App
