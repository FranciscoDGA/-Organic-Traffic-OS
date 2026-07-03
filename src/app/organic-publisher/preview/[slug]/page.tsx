'use client';

import React from 'react';
import { useSearchParams } from 'next/navigation';

export default function PreviewPage({ params }: { params: { slug: string } }) {
  const searchParams = useSearchParams();
  const title = searchParams.get('title') || 'Sem título';
  const category = searchParams.get('category') || 'Sem categoria';
  const tags = searchParams.get('tags') || '';
  const author = searchParams.get('author') || 'Anônimo';
  const excerpt = searchParams.get('excerpt') || '';
  const seoTitle = searchParams.get('seo_title') || '';
  const seoDesc = searchParams.get('seo_desc') || '';
  const cta = searchParams.get('cta') || '';

  return (
    <div style={{
      background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)',
      color: '#f8fafc',
      minHeight: '100vh',
      fontFamily: 'Inter, sans-serif',
      padding: '40px 20px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    }}>
      {/* Central Glassmorphic Card */}
      <div style={{
        maxWidth: '800px',
        width: '100%',
        background: 'rgba(255, 255, 255, 0.03)',
        backdropFilter: 'blur(12px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '16px',
        padding: '32px',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.5)'
      }}>
        {/* Header Preview Ribbon */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
          paddingBottom: '16px',
          marginBottom: '24px'
        }}>
          <span style={{
            background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)',
            color: '#ffffff',
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: 'bold',
            textTransform: 'uppercase'
          }}>
            Modo Rascunho / Preview
          </span>
          <span style={{ fontSize: '13px', color: '#94a3b8' }}>
            Autor: <strong>{author}</strong>
          </span>
        </div>

        {/* Content */}
        <h1 style={{
          fontSize: '32px',
          fontWeight: 800,
          lineHeight: '1.2',
          marginBottom: '16px',
          background: 'linear-gradient(to right, #f8fafc, #cbd5e1)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          {title}
        </h1>

        <div style={{
          display: 'flex',
          gap: '8px',
          flexWrap: 'wrap',
          marginBottom: '24px'
        }}>
          <span style={{
            background: 'rgba(59, 130, 246, 0.1)',
            border: '1px solid rgba(59, 130, 246, 0.2)',
            color: '#60a5fa',
            padding: '2px 8px',
            borderRadius: '4px',
            fontSize: '12px'
          }}>
            {category}
          </span>
          {tags.split(',').filter(Boolean).map(tag => (
            <span key={tag} style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              color: '#cbd5e1',
              padding: '2px 8px',
              borderRadius: '4px',
              fontSize: '12px'
            }}>
              #{tag}
            </span>
          ))}
        </div>

        {excerpt && (
          <p style={{
            fontSize: '16px',
            lineHeight: '1.6',
            color: '#94a3b8',
            fontStyle: 'italic',
            borderLeft: '4px solid #8b5cf6',
            paddingLeft: '16px',
            marginBottom: '32px'
          }}>
            {excerpt}
          </p>
        )}

        <div style={{
          fontSize: '16px',
          lineHeight: '1.8',
          color: '#cbd5e1',
          marginBottom: '40px'
        }}>
          <p>O conteúdo completo do artigo formatado em HTML/Markdown será renderizado pelo blog utilizando os estilos nativos após aprovação.</p>
        </div>

        {cta && (
          <div style={{
            background: 'rgba(139, 92, 246, 0.1)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            borderRadius: '12px',
            padding: '20px',
            textAlign: 'center',
            marginBottom: '40px'
          }}>
            <h4 style={{ color: '#a78bfa', margin: '0 0 8px 0', fontSize: '15px', fontWeight: 'bold' }}>Call To Action (CTA)</h4>
            <p style={{ margin: 0, fontSize: '14px', color: '#cbd5e1' }}>{cta}</p>
          </div>
        )}

        {/* SEO Metadados */}
        <div style={{
          background: 'rgba(0, 0, 0, 0.2)',
          border: '1px solid rgba(255, 255, 255, 0.05)',
          borderRadius: '8px',
          padding: '16px',
          fontSize: '13px'
        }}>
          <h4 style={{ margin: '0 0 12px 0', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Metadados de SEO</h4>
          <div style={{ marginBottom: '8px' }}>
            <span style={{ color: '#64748b' }}>Title Tag:</span> <strong style={{ color: '#f1f5f9' }}>{seoTitle || title}</strong>
          </div>
          <div>
            <span style={{ color: '#64748b' }}>Meta Description:</span> <span style={{ color: '#cbd5e1' }}>{seoDesc || excerpt || 'Nenhuma descrição adicionada.'}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
