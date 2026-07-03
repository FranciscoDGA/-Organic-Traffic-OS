'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function BriefsPage() {
  const [briefs, setBriefs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  const fetchDados = () => {
    setLoading(true);
    fetch('/api/organic-os/briefs?blog_id=passacumaru')
      .then(r => r.json())
      .then(res => {
        setBriefs(res.data || []);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchDados();
  }, []);

  const handleGenerate = async () => {
    setGenerating(true);
    // Simulating generating a brief for a calendar item
    await fetch('/api/organic-os/briefs/create', { 
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        itemId: `ed-${Date.now()}`,
        itemTitle: 'Como Passar na Prova da Banca IVIN'
      })
    });
    setGenerating(false);
    fetchDados();
  };

  if (loading && briefs.length === 0) return <div className="p-8">Carregando Briefs...</div>;

  return (
    <div className="p-8 font-sans max-w-7xl mx-auto">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-extrabold text-gray-900">Brief Intelligence Engine</h1>
          <p className="text-gray-500 mt-2">A ponte entre o Editor-Chefe e o Agente Escritor. Geração de escopos super detalhados.</p>
        </div>
        <div>
          <button 
            onClick={handleGenerate} 
            disabled={generating}
            className="px-6 py-3 bg-pink-600 text-white font-bold rounded-lg hover:bg-pink-700 disabled:opacity-50"
          >
            {generating ? 'Criando Brief...' : 'Simular Criação de Brief'}
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white border rounded-xl p-5 shadow-sm">
          <h3 className="text-sm font-medium text-gray-500 mb-1">Total de Briefs Prontos</h3>
          <p className="text-3xl font-bold text-pink-600">{briefs.length}</p>
        </div>
      </div>

      <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
        <div className="p-5 border-b bg-pink-50">
          <h3 className="font-bold text-lg text-pink-800">Briefs Editoriais (Premium)</h3>
        </div>
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b text-gray-500">
              <th className="p-4 font-medium">Título do Briefing</th>
              <th className="p-4 font-medium">Cluster</th>
              <th className="p-4 font-medium">Score (Completude)</th>
              <th className="p-4 font-medium">Status</th>
              <th className="p-4 font-medium">Ação</th>
            </tr>
          </thead>
          <tbody>
            {briefs.map((b: any) => (
              <tr key={b.id} className="border-b hover:bg-gray-50">
                <td className="p-4 font-bold text-gray-800">{b.titulo}</td>
                <td className="p-4 text-gray-600">{b.cluster}</td>
                <td className="p-4 font-bold text-pink-600">{b.score} / 100</td>
                <td className="p-4">
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-bold">{b.status}</span>
                </td>
                <td className="p-4">
                  <Link href={`/organic-os/briefs/${b.id}`} className="text-blue-600 hover:underline">
                    Ver Detalhes
                  </Link>
                </td>
              </tr>
            ))}
            {briefs.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-500">Nenhum brief gerado.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
