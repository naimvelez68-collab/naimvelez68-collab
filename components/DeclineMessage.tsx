import Divider from './GoldDivider'

export default function DeclineMessage() {
  return (
    <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--ecru)', padding: 'clamp(60px, 10vw, 80px) 16px' }}>
      <div className="animate-envelope w-full" style={{ maxWidth: '380px', background: 'var(--cream)', border: '1px solid rgba(174,163,142,0.3)', boxShadow: '0 12px 56px rgba(83,88,62,0.09)', padding: 'clamp(28px, 9vw, 52px)', textAlign: 'center' }}>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{ width: '32px', height: '1px', background: 'linear-gradient(to right, transparent, var(--grullo))' }} />
          <span style={{ color: 'var(--sage)', fontSize: '0.62rem' }}>✦</span>
          <div style={{ width: '32px', height: '1px', background: 'linear-gradient(to left, transparent, var(--grullo))' }} />
        </div>

        <p style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontWeight: 300, fontSize: '0.92rem', color: 'var(--rifle)', marginBottom: '6px', lineHeight: 1.75, opacity: 0.85 }}>
          "El amor todo lo sufre, todo lo cree,<br />todo lo espera, todo lo soporta."
        </p>
        <p style={{ fontFamily: 'Josefin Sans, sans-serif', fontWeight: 300, fontSize: '0.52rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: 'var(--grullo)', marginBottom: '24px' }}>
          1 Corintios 13:7
        </p>

        <Divider />

        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 400, fontStyle: 'italic', fontSize: 'clamp(1.2rem, 4vw, 1.6rem)', color: 'var(--rifle)', lineHeight: 1.4, margin: '22px 0 14px' }}>
          Gracias por acompañarnos<br />con tu cariño y tus buenos deseos.
        </h2>

        <p style={{ fontFamily: 'Josefin Sans, sans-serif', fontWeight: 300, fontSize: '0.75rem', color: 'var(--dark-brown)', lineHeight: 1.85, marginBottom: '28px', opacity: 0.82 }}>
          Aunque no puedas estar presente, valoramos mucho que formes parte de esta etapa tan especial para nosotros. Siempre tendrás un lugar en nuestro corazón.
        </p>

        <p style={{ fontFamily: 'Josefin Sans, sans-serif', fontWeight: 300, fontSize: '0.62rem', letterSpacing: '0.14em', color: 'var(--grullo)', marginBottom: '6px' }}>Con cariño,</p>

        <p style={{ fontFamily: 'Pinyon Script, cursive', fontSize: 'clamp(2rem, 7vw, 2.6rem)', color: 'var(--rifle)', lineHeight: 1.2, opacity: 0.8 }}>
          Naim & Sarahí
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '28px' }}>
          <div style={{ width: '24px', height: '1px', background: 'linear-gradient(to right, transparent, var(--grullo))' }} />
          <span style={{ color: 'var(--grullo)', fontSize: '0.5rem' }}>✦</span>
          <div style={{ width: '24px', height: '1px', background: 'linear-gradient(to left, transparent, var(--grullo))' }} />
        </div>
      </div>
    </section>
  )
}
