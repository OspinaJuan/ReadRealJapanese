import React, { useState } from 'react';
import { Flame, BookOpen, Star, Download, Plus, Menu, X } from 'lucide-react';

// Main App Component
export default function App() {
  const [currentView, setCurrentView] = useState('reader');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-purple-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="lg:hidden p-2 hover:bg-purple-100 rounded-lg transition-colors"
            >
              {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
              📚 ReadRealJapanese
            </h1>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2 bg-orange-100 px-4 py-2 rounded-full">
              <Flame className="text-orange-500" size={20} />
              <span className="font-bold text-orange-700">7 day streak!</span>
            </div>
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors font-medium">
              Login
            </button>
          </div>
        </div>
      </header>

      <div className="flex max-w-7xl mx-auto">
        {/* Sidebar */}
        <aside className={`${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 fixed lg:sticky top-16 left-0 h-[calc(100vh-4rem)] w-64 bg-white/80 backdrop-blur-sm border-r border-purple-200 p-4 transition-transform duration-300 z-40 overflow-y-auto`}>
          <nav className="space-y-2">
            <NavButton 
              icon={<BookOpen size={20} />} 
              label="Reader" 
              active={currentView === 'reader'}
              onClick={() => { setCurrentView('reader'); setSidebarOpen(false); }}
            />
            <NavButton 
              icon={<Star size={20} />} 
              label="My Library" 
              active={currentView === 'library'}
              onClick={() => { setCurrentView('library'); setSidebarOpen(false); }}
            />
            <NavButton 
              icon={<Download size={20} />} 
              label="Anki Export" 
              active={currentView === 'anki'}
              onClick={() => { setCurrentView('anki'); setSidebarOpen(false); }}
            />
          </nav>

          <div className="mt-8 p-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-xl">
            <h3 className="font-bold text-purple-900 mb-2">Today's Stats</h3>
            <div className="space-y-2 text-sm">
              <StatRow label="Characters read" value="2,847" />
              <StatRow label="Words learned" value="23" />
              <StatRow label="Reading time" value="1.5h" />
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 p-4 lg:p-8">
          {currentView === 'reader' && <ReaderView />}
          {currentView === 'library' && <LibraryView />}
          {currentView === 'anki' && <AnkiView />}
        </main>
      </div>
    </div>
  );
}

// Navigation Button Component
function NavButton({ icon, label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
        active 
          ? 'bg-purple-600 text-white shadow-lg' 
          : 'text-gray-700 hover:bg-purple-100'
      }`}
    >
      {icon}
      <span className="font-medium">{label}</span>
    </button>
  );
}

// Stat Row Component
function StatRow({ label, value }) {
  return (
    <div className="flex justify-between">
      <span className="text-purple-700">{label}</span>
      <span className="font-bold text-purple-900">{value}</span>
    </div>
  );
}

// Reader View - Main Feature
function ReaderView() {
  const [japaneseText, setJapaneseText] = useState('');
  const [analyzedText, setAnalyzedText] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    if (!japaneseText.trim()) return;
    
    setIsAnalyzing(true);
    
    // TODO: Replace with your actual backend API call
    setTimeout(() => {
      setAnalyzedText({
        words: [
          { text: '今日', furigana: 'きょう', pitch: 1, jlpt: 'N5', meaning: 'today' },
          { text: 'は', furigana: '', pitch: 0, jlpt: 'N5', meaning: 'particle' },
          { text: '良い', furigana: 'よい', pitch: 2, jlpt: 'N4', meaning: 'good' },
          { text: '天気', furigana: 'てんき', pitch: 1, jlpt: 'N5', meaning: 'weather' },
          { text: 'です', furigana: '', pitch: 0, jlpt: 'N5', meaning: 'is (polite)' },
        ]
      });
      setIsAnalyzing(false);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl shadow-xl p-6 border border-purple-200">
        <h2 className="text-xl font-bold text-purple-900 mb-4">Paste Japanese Text</h2>
        
        <textarea
          value={japaneseText}
          onChange={(e) => setJapaneseText(e.target.value)}
          placeholder="ここに日本語のテキストを貼り付けてください..."
          className="w-full h-40 p-4 border-2 border-purple-200 rounded-xl focus:border-purple-500 focus:outline-none resize-none text-lg"
        />
        
        <div className="flex gap-3 mt-4">
          <button
            onClick={handleAnalyze}
            disabled={isAnalyzing || !japaneseText.trim()}
            className="flex-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-6 py-3 rounded-xl font-bold hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? 'Analyzing...' : '✨ Analyze Text'}
          </button>
          <button
            onClick={() => { setJapaneseText(''); setAnalyzedText(null); }}
            className="px-6 py-3 border-2 border-purple-300 text-purple-700 rounded-xl font-medium hover:bg-purple-50 transition-colors"
          >
            Clear
          </button>
        </div>
      </div>

      {analyzedText && (
        <div className="bg-white rounded-2xl shadow-xl p-6 border border-purple-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-bold text-purple-900">Analyzed Text</h2>
            <button className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
              <Download size={18} />
              Export to Anki
            </button>
          </div>
          
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-6 rounded-xl">
            <div className="flex flex-wrap gap-4 text-2xl leading-relaxed">
              {analyzedText.words.map((word, idx) => (
                <WordToken key={idx} word={word} />
              ))}
            </div>
          </div>

          <div className="mt-4 flex gap-2 text-sm">
            <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full">N5: Beginner</span>
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full">N4: Elementary</span>
            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full">N3: Intermediate</span>
          </div>
        </div>
      )}
    </div>
  );
}

// Word Token Component with Hover
function WordToken({ word }) {
  const [showPopup, setShowPopup] = useState(false);
  
  const jlptColors = {
    'N5': 'text-blue-600',
    'N4': 'text-green-600',
    'N3': 'text-yellow-600',
    'N2': 'text-orange-600',
    'N1': 'text-red-600',
  };

  return (
    <div className="relative inline-block">
      <button
        onMouseEnter={() => setShowPopup(true)}
        onMouseLeave={() => setShowPopup(false)}
        className={`relative cursor-pointer hover:bg-purple-100 px-1 rounded transition-colors ${jlptColors[word.jlpt] || 'text-gray-700'}`}
      >
        {word.furigana && (
          <span className="absolute -top-4 left-0 text-xs text-purple-500 font-normal">
            {word.furigana}
          </span>
        )}
        {word.text}
      </button>

      {showPopup && (
        <div className="absolute top-full left-0 mt-2 w-64 bg-white border-2 border-purple-300 rounded-xl shadow-2xl p-4 z-50 animate-fadeIn">
          <div className="space-y-2">
            <div>
              <span className="text-2xl font-bold">{word.text}</span>
              {word.furigana && <span className="text-purple-500 ml-2">({word.furigana})</span>}
            </div>
            <div className="text-gray-700">{word.meaning}</div>
            <div className="flex gap-2 pt-2">
              <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded">
                {word.jlpt}
              </span>
              <span className="px-2 py-1 bg-pink-100 text-pink-700 text-xs rounded">
                Pitch: {word.pitch}
              </span>
            </div>
            <button className="w-full mt-2 flex items-center justify-center gap-2 bg-purple-600 text-white py-2 rounded-lg hover:bg-purple-700 transition-colors">
              <Plus size={16} />
              Add to Anki
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Library View
function LibraryView() {
  const savedTexts = [
    { title: 'Chapter 1 - Naruto', date: '2025-11-20', chars: 3420, tags: ['manga'] },
    { title: 'Demon Slayer Vol 1', date: '2025-11-18', chars: 5230, tags: ['manga'] },
    { title: 'Yoasobi - Idol lyrics', date: '2025-11-15', chars: 890, tags: ['lyrics'] },
  ];

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-purple-900">My Library</h2>
      
      {savedTexts.map((text, idx) => (
        <div key={idx} className="bg-white rounded-xl shadow-lg p-5 border border-purple-200 hover:shadow-xl transition-shadow cursor-pointer">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-bold text-lg text-gray-800">{text.title}</h3>
              <p className="text-sm text-gray-500 mt-1">{text.date} • {text.chars.toLocaleString()} characters</p>
              <div className="flex gap-2 mt-2">
                {text.tags.map((tag, i) => (
                  <span key={i} className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
            <BookOpen className="text-purple-400" size={24} />
          </div>
        </div>
      ))}
    </div>
  );
}

// Anki Export View
function AnkiView() {
  const queuedCards = [
    { word: '天気', reading: 'てんき', meaning: 'weather', context: '今日は良い天気です' },
    { word: '勉強', reading: 'べんきょう', meaning: 'study', context: '毎日日本語を勉強します' },
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-purple-900">Anki Export Queue</h2>
        <button className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors">
          <Download size={18} />
          Export {queuedCards.length} cards
        </button>
      </div>

      <div className="space-y-3">
        {queuedCards.map((card, idx) => (
          <div key={idx} className="bg-white rounded-xl shadow-lg p-5 border border-purple-200">
            <div className="flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <span className="text-2xl font-bold">{card.word}</span>
                  <span className="text-purple-500">({card.reading})</span>
                </div>
                <p className="text-gray-600 mt-1">{card.meaning}</p>
                <p className="text-sm text-gray-500 mt-2 italic">{card.context}</p>
              </div>
              <button className="text-red-500 hover:bg-red-50 p-2 rounded-lg transition-colors">
                <X size={20} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}