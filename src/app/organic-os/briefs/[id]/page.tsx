'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

import { use } from 'react';

export default function BriefDetailPage(props: { params: Promise<{ id: string }> }) {
  const params = use(props.params);
  const [brief, setBrief] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/organic-os/briefs/${params.id}?blog_id=passacumaru`)
      .then(r => r.json())
      .then(res => {
        setBrief(res.data);
        setLoading(false);
      });
  }, [params.id]);

  if (loading) return <div className="p-8">Carregando Detalhes do Brief...</div>;
  if (!brief) return <div className="p-8 text-red-500">Brief não encontrado.</div>;

  return (
    <div className="p-8 font-sans max-w-5xl mx-auto">
      <Link href="/organic-os/briefs" className="text-blue-600 hover:underline mb-6 inline-block">
        &larr; Voltar para Briefs
      </Link>
      
      <header className="mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900">{brief.template.titulo}</h1>
        <div className="flex gap-4 mt-2">
          <span className="bg-pink-100 text-pink-800 px-2 py-1 rounded text-xs font-bold">Score: {brief.template.score}/100</span>
          <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">Versão: {brief.template.versao}</span>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Outline JSON */}
        <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
          <div className="p-5 border-b bg-gray-50">
            <h3 className="font-bold text-lg text-gray-800">outline.json (Estrutura)</h3>
          </div>
          <div className="p-5">
            <pre className="text-xs text-gray-700 bg-gray-50 p-4 rounded border overflow-auto max-h-96">
              {JSON.stringify(brief.outline, null, 2)}
            </pre>
          </div>
        </div>

        {/* SEO JSON */}
        <div className="bg-white border rounded-xl shadow-sm overflow-hidden">
          <div className="p-5 border-b bg-blue-50">
            <h3 className="font-bold text-lg text-blue-800">seo-brief.json (Diretrizes SEO)</h3>
          </div>
          <div className="p-5">
            <pre className="text-xs text-gray-700 bg-blue-50/50 p-4 rounded border border-blue-100 overflow-auto max-h-96">
              {JSON.stringify(brief.seo, null, 2)}
            </pre>
          </div>
        </div>
      </div>
    </div>
  );
}
