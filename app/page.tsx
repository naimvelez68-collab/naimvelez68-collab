'use client'

import { useState, useEffect, useRef } from 'react'
import ConfirmForm from '@/components/ConfirmForm'
import DeclineMessage from '@/components/DeclineMessage'
import ThankYouMessage from '@/components/ThankYouMessage'
import WaxSeal from '@/components/WaxSeal'
import Divider from '@/components/GoldDivider'
import CountdownOnPhoto, { CountdownLight } from '@/components/Countdown'

type Stage = 'hero' | 'letter' | 'form' | 'decline' | 'thankyou'

const PREV: Partial<Record<Stage, Stage>> = {
  letter: 'hero', form: 'letter', decline: 'letter', thankyou: 'hero',
}

export default function Home() {
  const [stage, setStage] = useState<Stage>('hero')
  const [fading, setFading] = useState(false)

  const go = (next: Stage) => {
    setFading(true)
    setTimeout(() => {
      setStage(next)
      setFading(false)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }, 400)
  }

  return (
    <main style={{ background: 'var(--ecru)', minHeight: '100svh' }}>
      {stage !== 'hero' && (
        <button
          onClick={() => { const p = PREV[stage]; if (p) go(p) }}
          style={{
            position: 'fixed', top: '20px', left: '20px', zIndex: 200,
            background: 'rgba(250,248,244,0.92)',
            border: '1px solid rgba(176,164,142,0.4)',
            color: 'var(--rifle)',
            fontFamily: 'Josefin Sans, sans-serif', fontWeight: 400,
            fontSize: '0.58rem', letterSpacing: '0.22em', textTransform: 'uppercase',
            padding: '9px 18px', cursor: 'pointer',
            backdropFilter: 'blur(8px)', transition: 'all 0.3s',
            display: 'flex', alignItems: 'center', gap: '8px',
          }}
        >
          <svg width="13" height="10" viewBox="0 0 13 10" fill="none">
            <line x1="12" y1="5" x2="1" y2="5" stroke="var(--rifle)" strokeWidth="1.2"/>
            <polyline points="5,1 1,5 5,9" fill="none" stroke="var(--rifle)" strokeWidth="1.2"/>
          </svg>
          Volver
        </button>
      )}

      <div style={{ transition: 'opacity 0.4s ease', opacity: fading ? 0 : 1 }}>
        {stage === 'hero'     && <HeroSection   onOpen={() => go('letter')} />}
        {stage === 'letter'   && <LetterSection onYes={() => go('form')} onNo={() => go('decline')} />}
        {stage === 'form'     && <ConfirmForm   onSuccess={() => go('thankyou')} />}
        {stage === 'decline'  && <DeclineMessage />}
        {stage === 'thankyou' && <ThankYouMessage />}
      </div>
    </main>
  )
}

/* ══════════════════════════════════════════════════════════════
   HERO
   - Sección 200vh: el usuario baja y ve más de la foto
   - Viewport sticky de 100svh: el texto queda fijo mientras
     la imagen se desplaza revelando parte inferior (parallax)
   - objectPosition '33% 0%': prioriza la novia + muestra desde
     la parte superior de la imagen (cabezas + hombros visibles)
══════════════════════════════════════════════════════════════ */
function HeroSection({ onOpen }: { onOpen: () => void }) {
  const imgRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let raf = 0
    const onScroll = () => {
      cancelAnimationFrame(raf)
      raf = requestAnimationFrame(() => {
        if (!imgRef.current) return
        /* Parallax muy sutil — máximo 60px para no salir de las caras */
        const shift = Math.min(window.scrollY * 0.08, 60)
        imgRef.current.style.transform = `translateY(-${shift}px)`
      })
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => { window.removeEventListener('scroll', onScroll); cancelAnimationFrame(raf) }
  }, [])

  return (
    /* Sección ALTA → el usuario puede bajar para ver más foto */
    <section style={{ height: '200vh' }}>

      {/* Panel sticky que ocupa exactamente el viewport */}
      <div style={{ position: 'sticky', top: 0, height: '100svh', minHeight: '600px', overflow: 'hidden' }}>

        {/* ── FOTO con parallax ─────────────────────────────── */}
        {/* Wrapper un 30 % más alto que el panel para que
            translateY tenga espacio de movimiento sin dejar huecos */}
        <div
          ref={imgRef}
          style={{
            position: 'absolute',
            top: 0, left: 0, right: 0,
            height: '130%',
            willChange: 'transform',
          }}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/couple.jpg"
            alt="Naim y Sarahí"
            style={{
              width: '100%', height: '100%',
              objectFit: 'cover',
              /* 33% horizontal → desplaza hacia la novia (lado izq.)
                 42% vertical   → centra exactamente donde están
                                   las caras de los dos              */
              objectPosition: '33% 42%',
              filter: 'grayscale(60%) sepia(12%) brightness(1.07) contrast(0.91)',
              display: 'block',
            }}
          />
        </div>

        {/* Velo oscuro centrado — mejora legibilidad del texto */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to bottom, rgba(0,0,0,0.18) 0%, rgba(0,0,0,0.08) 30%, rgba(0,0,0,0.08) 60%, rgba(0,0,0,0.30) 100%)' }} />

        {/* ── TEXTO SOBRE LA FOTO ───────────────────────────── */}
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
          padding: '16px clamp(16px,5vw,40px)',
          textAlign: 'center',
          gap: 0,
        }}>

          {/* SAVE THE DATE */}
          <p className="animate-fade-in delay-100" style={{
            fontFamily: 'Cormorant Garamond, serif', fontWeight: 400,
            fontSize: 'clamp(1.1rem, 3.8vw, 2.2rem)',
            letterSpacing: '0.42em', textTransform: 'uppercase',
            color: '#FAF8F4',
            textShadow: '0 1px 8px rgba(0,0,0,0.5)',
            marginBottom: '8px',
          }}>
            Save the Date
          </p>

          <div className="animate-fade-in delay-200" style={{ width: '40px', height: '1px', background: 'rgba(255,255,255,0.55)', marginBottom: 'clamp(10px,2vh,18px)' }} />

          {/* NAIM */}
          <h1 className="animate-fade-in-up delay-200" style={{
            fontFamily: 'Cormorant Garamond, serif', fontWeight: 300,
            fontSize: 'clamp(3.2rem, 11vw, 6.5rem)',
            color: '#FAF8F4', lineHeight: 0.92, letterSpacing: '0.04em',
            textShadow: '0 2px 12px rgba(0,0,0,0.45)',
            marginBottom: 'clamp(4px,1vh,10px)',
          }}>
            Naim
          </h1>

          {/* & */}
          <p className="animate-fade-in delay-300" style={{
            fontFamily: 'Pinyon Script, cursive',
            fontSize: 'clamp(2rem, 7vw, 4rem)',
            color: '#A8C080',
            textShadow: '0 1px 6px rgba(0,0,0,0.4)',
            lineHeight: 1,
            marginBottom: 'clamp(4px,1vh,10px)',
          }}>
            &
          </p>

          {/* SARAHÍ */}
          <h1 className="animate-fade-in-up delay-300" style={{
            fontFamily: 'Cormorant Garamond, serif', fontWeight: 300,
            fontSize: 'clamp(3.2rem, 11vw, 6.5rem)',
            color: '#FAF8F4', lineHeight: 0.92, letterSpacing: '0.04em',
            textShadow: '0 2px 12px rgba(0,0,0,0.45)',
            marginBottom: 'clamp(10px,2vh,20px)',
          }}>
            Sarahí
          </h1>

          {/* Fecha */}
          <p className="animate-fade-in delay-400" style={{
            fontFamily: 'Josefin Sans, sans-serif', fontWeight: 300,
            fontSize: 'clamp(0.9rem, 2.8vw, 1.3rem)',
            letterSpacing: '0.4em', color: '#FAF8F4',
            textShadow: '0 1px 6px rgba(0,0,0,0.45)',
            marginBottom: '6px',
          }}>
            08 . 08 . 2026
          </p>

          {/* Ciudad */}
          <p className="animate-fade-in delay-400" style={{
            fontFamily: 'Josefin Sans, sans-serif', fontWeight: 300,
            fontSize: 'clamp(0.6rem, 1.8vw, 0.75rem)',
            letterSpacing: '0.32em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.72)',
            textShadow: '0 1px 4px rgba(0,0,0,0.4)',
            marginBottom: 'clamp(8px,1.5vh,14px)',
          }}>
            Ibarra · Imbabura · Ecuador
          </p>

          {/* Línea decorativa */}
          <div className="animate-fade-in delay-400" style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: 'clamp(8px,1.5vh,14px)' }}>
            <div style={{ width: '32px', height: '1px', background: '#A8C080', opacity: 0.8 }} />
            <div style={{ width: '4px', height: '4px', borderRadius: '50%', background: '#A8C080', opacity: 0.8 }} />
            <div style={{ width: '32px', height: '1px', background: '#A8C080', opacity: 0.8 }} />
          </div>

          {/* Frase bíblica */}
          <p className="animate-fade-in delay-500" style={{
            fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontWeight: 400,
            fontSize: 'clamp(0.95rem, 2.8vw, 1.18rem)',
            color: '#FAF8F4', textShadow: '0 1px 6px rgba(0,0,0,0.45)',
            marginBottom: '4px', lineHeight: 1.6,
          }}>
            "Ponme como un sello sobre tu corazón."
          </p>
          <p className="animate-fade-in delay-500" style={{
            fontFamily: 'Josefin Sans, sans-serif', fontWeight: 300,
            fontSize: 'clamp(0.6rem, 1.8vw, 0.72rem)',
            letterSpacing: '0.28em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.7)',
            textShadow: '0 1px 4px rgba(0,0,0,0.4)',
            marginBottom: 'clamp(12px,2vh,22px)',
          }}>
            Cantares 8:6
          </p>

          {/* Botón */}
          <button
            onClick={onOpen}
            className="animate-fade-in delay-600"
            style={{
              background: 'rgba(28,30,12,0.88)',
              border: '1px solid rgba(255,255,255,0.25)',
              color: '#FAF8F4',
              fontFamily: 'Josefin Sans, sans-serif', fontWeight: 400,
              fontSize: 'clamp(0.62rem, 1.8vw, 0.74rem)',
              letterSpacing: '0.3em', textTransform: 'uppercase',
              padding: 'clamp(12px,2vh,16px) clamp(28px,5vw,52px)',
              cursor: 'pointer', transition: 'all 0.4s ease',
              marginBottom: 'clamp(8px,1.5vh,12px)',
              backdropFilter: 'blur(4px)',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--moss)' }}
            onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(28,30,12,0.88)' }}
          >
            Abrir nuestra fecha
          </button>

          <p className="animate-fade-in delay-600" style={{
            fontFamily: 'Josefin Sans, sans-serif', fontWeight: 300,
            fontSize: 'clamp(0.58rem, 1.6vw, 0.68rem)',
            letterSpacing: '0.32em', textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.6)',
            textShadow: '0 1px 4px rgba(0,0,0,0.3)',
            marginBottom: 'clamp(10px,1.8vh,18px)',
          }}>
            Una invitación te espera
          </p>

          {/* Contador */}
          <div className="animate-fade-in delay-700">
            <CountdownOnPhoto />
          </div>
        </div>
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════
   CON AMOR
══════════════════════════════════════════════════════════════ */
function ConAmorSection() {
  return (
    <section style={{ background: 'var(--timberwolf)', padding: 'clamp(52px,10vw,88px) clamp(28px,7vw,56px)', textAlign: 'center' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', marginBottom: '28px' }}>
        <div style={{ width: '44px', height: '1px', background: 'linear-gradient(to right, transparent, var(--grullo))' }} />
        <span style={{ color: 'var(--grullo)', fontSize: '0.65rem' }}>✦</span>
        <div style={{ width: '44px', height: '1px', background: 'linear-gradient(to left, transparent, var(--grullo))' }} />
      </div>
      <p style={{ fontFamily: 'Pinyon Script, cursive', fontSize: 'clamp(2.8rem,9vw,4rem)', color: 'var(--rifle)', marginBottom: '28px', lineHeight: 1.2 }}>
        Con amor
      </p>
      <div style={{ maxWidth: '480px', margin: '0 auto' }}>
        <p style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 500, fontStyle: 'italic', fontSize: 'clamp(1.1rem,3.5vw,1.3rem)', color: 'var(--rifle)', lineHeight: 1.85, marginBottom: '18px' }}>
          Nuestra historia de amor no comenzó el día que nos conocimos.
        </p>
        <p style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 400, fontSize: 'clamp(1rem,3vw,1.15rem)', color: 'var(--dark-brown)', lineHeight: 1.95, marginBottom: '18px', opacity: 0.88 }}>
          Comenzó mucho antes, cuando Dios, en Su perfecta voluntad, empezó a escribir un camino que terminaría uniendo nuestras vidas.
        </p>
        <p style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 400, fontSize: 'clamp(1rem,3vw,1.15rem)', color: 'var(--dark-brown)', lineHeight: 1.95, marginBottom: '28px', opacity: 0.88 }}>
          Hoy, con el corazón lleno de gratitud, queremos compartir esta alegría con las personas que han sido parte de esa historia y que ocupan un lugar especial en nuestro corazón.
        </p>
        <p style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 600, fontStyle: 'italic', fontSize: 'clamp(1.1rem,3.5vw,1.3rem)', color: 'var(--rifle)' }}>
          Guarda esta fecha.
        </p>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px', marginTop: '36px' }}>
        <div style={{ width: '32px', height: '1px', background: 'linear-gradient(to right, transparent, var(--grullo))' }} />
        <span style={{ color: 'var(--grullo)', fontSize: '0.55rem' }}>✦</span>
        <div style={{ width: '32px', height: '1px', background: 'linear-gradient(to left, transparent, var(--grullo))' }} />
      </div>
    </section>
  )
}

/* ══════════════════════════════════════════════════════════════
   CARTA + RSVP
══════════════════════════════════════════════════════════════ */
function LetterSection({ onYes, onNo }: { onYes: () => void; onNo: () => void }) {
  return (
    <div>
      <ConAmorSection />
      <section style={{ background: 'var(--ecru)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 'clamp(40px,8vw,64px) clamp(16px,5vw,32px)' }}>
        <div
          className="animate-envelope w-full"
          style={{ maxWidth: '400px', background: 'var(--cream)', border: '1px solid rgba(176,164,142,0.28)', boxShadow: '0 14px 60px rgba(77,82,56,0.08), 0 1px 0 rgba(255,255,255,0.7) inset', padding: 'clamp(28px,9vw,56px)', textAlign: 'center' }}
        >
          <p style={{ fontFamily: 'Josefin Sans, sans-serif', fontWeight: 400, fontSize: '0.54rem', letterSpacing: '0.38em', color: 'var(--sage)', marginBottom: '3px' }}>N · S</p>
          <p style={{ fontFamily: 'Josefin Sans, sans-serif', fontWeight: 300, fontSize: '0.5rem', letterSpacing: '0.28em', textTransform: 'uppercase', color: 'var(--grullo)', marginBottom: '22px' }}>Nuestra Invitación</p>

          <div style={{ background: 'rgba(226,222,216,0.38)', borderLeft: '2px solid var(--grullo)', padding: '16px 18px', marginBottom: '18px', textAlign: 'left', position: 'relative', overflow: 'hidden' }}>
            {[...Array(7)].map((_, i) => <div key={i} style={{ position: 'absolute', left: 0, right: 0, top: `${(i + 1) * 14}px`, height: '1px', background: 'var(--grullo)', opacity: 0.09 }} />)}
            <p style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 400, fontStyle: 'italic', fontSize: 'clamp(1.05rem,3.5vw,1.15rem)', color: 'var(--rifle)', lineHeight: 1.78, position: 'relative', zIndex: 1 }}>
              Con mucha alegría queremos que guardes esta fecha especial.
            </p>
          </div>

          <p style={{ fontFamily: 'Josefin Sans, sans-serif', fontWeight: 400, fontSize: 'clamp(0.62rem,2vw,0.68rem)', letterSpacing: '0.22em', textTransform: 'uppercase', color: 'var(--rifle)', marginBottom: '3px' }}>Naim & Sarahí</p>
          <p style={{ fontFamily: 'Josefin Sans, sans-serif', fontWeight: 300, fontSize: '0.6rem', letterSpacing: '0.2em', color: 'var(--grullo)', marginBottom: '4px' }}>08 · 08 · 2026</p>
          <p style={{ fontFamily: 'Josefin Sans, sans-serif', fontWeight: 300, fontSize: '0.54rem', letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--sage)', marginBottom: '20px' }}>Ibarra · Imbabura · Ecuador</p>

          <Divider color="var(--grullo)" />

          <p style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontWeight: 400, fontSize: 'clamp(1rem,3.5vw,1.1rem)', color: 'var(--dark-brown)', lineHeight: 1.8, margin: '22px 0 26px' }}>
            Nos encantaría saber si podremos contar contigo en este día tan especial
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <button onClick={onYes}
              style={{ background: 'var(--olive)', border: '1px solid var(--olive)', color: '#FAF8F4', fontFamily: 'Josefin Sans, sans-serif', fontWeight: 400, fontSize: 'clamp(0.62rem,2.2vw,0.7rem)', letterSpacing: '0.2em', textTransform: 'uppercase', padding: '16px', cursor: 'pointer', transition: 'all 0.35s ease', width: '100%' }}
              onMouseEnter={(e) => { e.currentTarget.style.background = 'var(--moss)'; e.currentTarget.style.borderColor = 'var(--moss)' }}
              onMouseLeave={(e) => { e.currentTarget.style.background = 'var(--olive)'; e.currentTarget.style.borderColor = 'var(--olive)' }}>
              💫 Con gusto les acompañaré
            </button>
            <button onClick={onNo}
              style={{ background: 'transparent', border: '1px solid rgba(176,164,142,0.5)', color: 'var(--rifle)', fontFamily: 'Josefin Sans, sans-serif', fontWeight: 300, fontSize: 'clamp(0.62rem,2.2vw,0.7rem)', letterSpacing: '0.2em', textTransform: 'uppercase', padding: '16px', cursor: 'pointer', transition: 'all 0.35s ease', width: '100%' }}
              onMouseEnter={(e) => { e.currentTarget.style.borderColor = 'var(--sage)' }}
              onMouseLeave={(e) => { e.currentTarget.style.borderColor = 'rgba(176,164,142,0.5)' }}>
              🤍 No me será posible asistir
            </button>
          </div>

          <p style={{ fontFamily: 'Pinyon Script, cursive', fontSize: 'clamp(2rem,7vw,2.6rem)', color: 'var(--rifle)', marginTop: '26px', opacity: 0.58, lineHeight: 1.2 }}>
            Naim & Sarahí
          </p>
        </div>
      </section>
    </div>
  )
}
