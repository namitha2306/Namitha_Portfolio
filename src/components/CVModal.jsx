import React, { useState, useEffect, useCallback } from 'react';
import { X, Download, Eye, FileText, ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from 'lucide-react';
import { PDFDocument } from 'pdf-lib';

const CV_PATH = '/Namitha_MS_2026.pdf';

async function downloadPage(pageIndex, label) {
  try {
    const existingPdfBytes = await fetch(CV_PATH).then(res => res.arrayBuffer());
    const srcDoc = await PDFDocument.load(existingPdfBytes);
    const newDoc  = await PDFDocument.create();
    const [copiedPage] = await newDoc.copyPages(srcDoc, [pageIndex]);
    newDoc.addPage(copiedPage);
    const pdfBytes = await newDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `Namitha_MS_CV_Page${label}.pdf`;
    a.click();
    URL.revokeObjectURL(url);
  } catch (err) {
    console.error('PDF extract error:', err);
  }
}

async function downloadFull() {
  const a    = document.createElement('a');
  a.href     = CV_PATH;
  a.download = 'Namitha_MS_2026.pdf';
  a.click();
}

export default function CVModal({ isOpen, onClose }) {
  const [activePage, setActivePage] = useState(1);
  const [downloading, setDownloading] = useState(null); // null | 1 | 2 | 'full'
  const [zoom, setZoom] = useState(100);

  // Lock body scroll when modal open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
      setActivePage(1);
      setZoom(100);
    }
    return () => { document.body.style.overflow = ''; };
  }, [isOpen]);

  // ESC key close
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  const handleDownload = useCallback(async (type) => {
    setDownloading(type);
    if (type === 1) await downloadPage(0, '1');
    else if (type === 2) await downloadPage(1, '2');
    else await downloadFull();
    setDownloading(null);
  }, []);

  if (!isOpen) return null;

  const iframeSrc = `${CV_PATH}#page=${activePage}&toolbar=0&navpanes=0&scrollbar=0&zoom=${zoom}`;

  return (
    <>
      {/* ── Backdrop ────────────────────────────────────── */}
      <div
        onClick={onClose}
        style={{
          position: 'fixed', inset: 0,
          background: 'rgba(12, 10, 8, 0.88)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          zIndex: 10000,
          animation: 'cvFadeIn 0.25s ease',
        }}
      />

      {/* ── Modal Panel ─────────────────────────────────── */}
      <div
        style={{
          position: 'fixed',
          top: '50%', left: '50%',
          transform: 'translate(-50%, -50%)',
          width: 'min(95vw, 860px)',
          height: 'min(94vh, 920px)',
          background: 'rgba(22, 18, 14, 0.97)',
          border: '1px solid rgba(204, 42, 37, 0.35)',
          borderRadius: '20px',
          boxShadow: '0 32px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(204,42,37,0.12)',
          zIndex: 10001,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          animation: 'cvSlideUp 0.3s cubic-bezier(.16,1,.3,1)',
        }}
      >
        {/* ── Header ────────────────────────────────────── */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          borderBottom: '1px solid rgba(245,237,216,0.08)',
          flexShrink: 0,
          gap: '12px',
          flexWrap: 'wrap',
        }}>
          {/* Title */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{
              padding: '7px',
              background: 'rgba(204,42,37,0.15)',
              borderRadius: '10px',
              color: '#CC2A25',
              display: 'flex',
            }}>
              <FileText size={18} />
            </div>
            <div>
              <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1rem', color: '#F5EDD8' }}>
                Namitha M S — CV
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-code)' }}>
                Namitha_MS_2026.pdf · 2 pages
              </div>
            </div>
          </div>

          {/* Controls row */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            {/* Page Tabs */}
            <div style={{
              display: 'flex',
              background: 'rgba(245,237,216,0.06)',
              border: '1px solid rgba(245,237,216,0.10)',
              borderRadius: '10px',
              padding: '3px',
              gap: '2px',
            }}>
              {[1, 2].map(p => (
                <button
                  key={p}
                  onClick={() => setActivePage(p)}
                  style={{
                    padding: '6px 16px',
                    borderRadius: '8px',
                    border: 'none',
                    cursor: 'pointer',
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    fontSize: '0.82rem',
                    transition: 'all .2s ease',
                    background: activePage === p
                      ? '#CC2A25'
                      : 'transparent',
                    color: activePage === p ? '#F5EDD8' : 'var(--text-secondary)',
                    boxShadow: activePage === p ? '0 2px 10px rgba(204,42,37,0.4)' : 'none',
                  }}
                >
                  Page {p}
                </button>
              ))}
            </div>

            {/* Zoom controls */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <button
                onClick={() => setZoom(z => Math.max(60, z - 10))}
                title="Zoom out"
                style={iconBtn}
              >
                <ZoomOut size={15} />
              </button>
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-code)', minWidth: '38px', textAlign: 'center' }}>
                {zoom}%
              </span>
              <button
                onClick={() => setZoom(z => Math.min(175, z + 10))}
                title="Zoom in"
                style={iconBtn}
              >
                <ZoomIn size={15} />
              </button>
            </div>

            {/* Close */}
            <button
              onClick={onClose}
              title="Close"
              style={{ ...iconBtn, marginLeft: '4px' }}
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* ── PDF Viewer ────────────────────────────────── */}
        <div style={{
          flex: 1,
          overflow: 'hidden',
          position: 'relative',
          background: '#1a1410',
        }}>
          <iframe
            key={`${activePage}-${zoom}`}
            src={iframeSrc}
            title={`CV Page ${activePage}`}
            style={{
              width: '100%',
              height: '100%',
              border: 'none',
              display: 'block',
            }}
          />
        </div>

        {/* ── Footer — Download Buttons ─────────────────── */}
        <div style={{
          padding: '14px 20px',
          borderTop: '1px solid rgba(245,237,216,0.08)',
          display: 'flex',
          alignItems: 'center',
          gap: '10px',
          flexShrink: 0,
          flexWrap: 'wrap',
          background: 'rgba(12, 10, 8, 0.4)',
        }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-code)', flexGrow: 1 }}>
            ↓ Download individual pages or full CV
          </span>

          {/* Download Page 1 */}
          <DownloadBtn
            label="Page 1"
            loading={downloading === 1}
            onClick={() => handleDownload(1)}
            variant="outline"
          />

          {/* Download Page 2 */}
          <DownloadBtn
            label="Page 2"
            loading={downloading === 2}
            onClick={() => handleDownload(2)}
            variant="outline"
          />

          {/* Download Full */}
          <DownloadBtn
            label="Full CV"
            loading={downloading === 'full'}
            onClick={() => handleDownload('full')}
            variant="solid"
          />
        </div>
      </div>

      {/* ── Keyframe animations ───────────────────────── */}
      <style>{`
        @keyframes cvFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes cvSlideUp {
          from { opacity: 0; transform: translate(-50%, calc(-50% + 28px)); }
          to   { opacity: 1; transform: translate(-50%, -50%); }
        }
      `}</style>
    </>
  );
}

/* ── Small helpers ──────────────────────────────────────── */

const iconBtn = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: '32px',
  height: '32px',
  borderRadius: '8px',
  border: '1px solid rgba(245,237,216,0.10)',
  background: 'rgba(245,237,216,0.05)',
  color: 'var(--text-secondary)',
  cursor: 'pointer',
  transition: 'all .2s ease',
};

function DownloadBtn({ label, loading, onClick, variant }) {
  const isSolid = variant === 'solid';
  return (
    <button
      onClick={onClick}
      disabled={!!loading}
      title={`Download ${label}`}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '6px',
        padding: '9px 18px',
        borderRadius: '10px',
        border: isSolid ? 'none' : '1px solid rgba(204,42,37,0.45)',
        background: isSolid
          ? '#CC2A25'
          : 'rgba(204,42,37,0.10)',
        color: isSolid ? '#F5EDD8' : '#CC2A25',
        fontFamily: 'var(--font-display)',
        fontWeight: 700,
        fontSize: '0.82rem',
        cursor: loading ? 'wait' : 'pointer',
        opacity: loading ? 0.65 : 1,
        transition: 'all .2s ease',
        boxShadow: isSolid ? '0 4px 14px rgba(204,42,37,0.35)' : 'none',
        whiteSpace: 'nowrap',
      }}
    >
      {loading
        ? <span style={{ display: 'inline-block', width: '14px', height: '14px', border: '2px solid currentColor', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin .7s linear infinite' }} />
        : <Download size={14} />
      }
      {loading ? 'Saving…' : `Download ${label}`}
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </button>
  );
}
