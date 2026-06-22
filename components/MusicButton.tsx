'use client'

import { useState, useRef, useEffect } from 'react'

export default function MusicButton() {
  const [playing, setPlaying] = useState(false)
  const [visible, setVisible] = useState(false)
  const audioRef = useRef<HTMLAudioElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 2000)
    return () => clearTimeout(timer)
  }, [])

  const toggle = () => {
    const audio = audioRef.current
    if (!audio) return
    if (playing) {
      audio.pause()
    } else {
      audio.play().catch(() => {})
    }
    setPlaying(!playing)
  }

  if (!visible) return null

  return (
    <>
      {/* Audio element - usa una URL pública de música instrumental libre de derechos */}
      <audio ref={audioRef} loop>
        <source src="/music.mp3" type="audio/mpeg" />
      </audio>

      <button
        onClick={toggle}
        title={playing ? 'Pausar música' : 'Activar música'}
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 50,
          width: '44px',
          height: '44px',
          borderRadius: '50%',
          background: 'rgba(248,243,234,0.92)',
          border: '1px solid rgba(184,155,94,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          backdropFilter: 'blur(8px)',
          transition: 'all 0.3s ease',
          boxShadow: '0 2px 14px rgba(184,155,94,0.22)',
          padding: 0,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'var(--gold)'
          e.currentTarget.style.borderColor = 'var(--gold)'
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(248,243,234,0.92)'
          e.currentTarget.style.borderColor = 'rgba(184,155,94,0.5)'
        }}
      >
        {playing ? (
          /* Pause icon */
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
            <rect x="3" y="2" width="3.5" height="12" rx="1" fill="var(--gold)" />
            <rect x="9.5" y="2" width="3.5" height="12" rx="1" fill="var(--gold)" />
          </svg>
        ) : (
          /* Music note icon */
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M9 18V5l12-2v13" stroke="var(--gold)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="6" cy="18" r="3" stroke="var(--gold)" strokeWidth="1.5" />
            <circle cx="18" cy="16" r="3" stroke="var(--gold)" strokeWidth="1.5" />
          </svg>
        )}
      </button>

      {/* Tooltip sutil */}
      {!playing && (
        <div
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '78px',
            zIndex: 49,
            background: 'rgba(248,243,234,0.95)',
            border: '1px solid rgba(184,155,94,0.3)',
            padding: '6px 12px',
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 300,
            fontSize: '0.6rem',
            letterSpacing: '0.12em',
            color: 'var(--brown)',
            whiteSpace: 'nowrap',
            boxShadow: '0 2px 8px rgba(94,81,72,0.1)',
            animation: 'fadeIn 0.5s ease both',
            animationDelay: '0.3s',
            opacity: 0,
          }}
        >
          Activar música
        </div>
      )}
    </>
  )
}
