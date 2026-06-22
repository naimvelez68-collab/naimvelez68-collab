import Divider from './GoldDivider'

export default function ThankYouMessage() {
  return (
    <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--ecru)', padding: 'clamp(60px,10vw,80px) 16px' }}>
      <div
        className="animate-envelope w-full"
        style={{ maxWidth: '400px', background: 'var(--cream)', border: '1px solid rgba(174,163,142,0.3)', boxShadow: '0 12px 56px rgba(83,88,62,0.09)', padding: 'clamp(28px,9vw,52px)', textAlign: 'center' }}
      >
        {/* Ornamento */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginBottom: '20px' }}>
          <div style={{ width: '32px', height: '1px', background: 'linear-gradient(to right, transparent, var(--grullo))' }} />
          <span style={{ color: 'var(--sage)', fontSize: '0.62rem' }}>✦</span>
          <div style={{ width: '32px', height: '1px', background: 'linear-gradient(to left, transparent, var(--grullo))' }} />
        </div>

        {/* Ícono circular */}
        <div style={{ width: '52px', height: '52px', borderRadius: '50%', background: 'radial-gradient(circle at 36% 34%, #5C7530, #3D4F1E, #263310)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 3px 14px rgba(61,79,30,0.3)' }}>
          <span style={{ color: 'rgba(232,217,160,0.9)', fontSize: '1.1rem' }}>✉</span>
        </div>

        {/* Título */}
        <h2 style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 400, fontStyle: 'italic', fontSize: 'clamp(1.4rem,5vw,1.85rem)', color: 'var(--rifle)', lineHeight: 1.35, marginBottom: '18px' }}>
          Gracias por guardar<br />esta fecha con nosotros.
        </h2>

        <Divider color="var(--grullo)" />

        <p style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 400, fontSize: 'clamp(0.92rem,3vw,1.05rem)', color: 'var(--dark-brown)', lineHeight: 1.9, margin: '20px 0 22px', fontStyle: 'italic', opacity: 0.88 }}>
          Nos alegra profundamente saber que podremos contar contigo en este momento tan especial.
        </p>

        {/* Bloque de detalles del evento */}
        <div
          style={{
            background: 'linear-gradient(135deg, rgba(226,222,216,0.45), rgba(242,237,227,0.6))',
            border: '1px solid rgba(174,163,142,0.3)',
            borderLeft: '3px solid var(--thyme)',
            padding: '18px 20px',
            marginBottom: '22px',
            textAlign: 'left',
          }}
        >
          <p style={{ fontFamily: 'Josefin Sans, sans-serif', fontWeight: 400, fontSize: '0.54rem', letterSpacing: '0.3em', textTransform: 'uppercase', color: 'var(--sage)', marginBottom: '12px' }}>
            Detalles del evento
          </p>

          {/* Fecha */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.85rem', marginTop: '1px', color: 'var(--thyme)' }}>📅</span>
            <div>
              <p style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 500, fontSize: 'clamp(1rem,3vw,1.1rem)', color: 'var(--rifle)', lineHeight: 1.3 }}>
                Sábado, 8 de agosto de 2026
              </p>
              <p style={{ fontFamily: 'Josefin Sans, sans-serif', fontWeight: 300, fontSize: '0.65rem', letterSpacing: '0.1em', color: 'var(--grullo)', marginTop: '2px' }}>
                08 · 08 · 2026
              </p>
            </div>
          </div>

          {/* Hora */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--thyme)' }}>🕑</span>
            <div>
              <p style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 500, fontSize: 'clamp(1rem,3vw,1.1rem)', color: 'var(--rifle)', lineHeight: 1.3 }}>
                14:00 h
              </p>
              <p style={{ fontFamily: 'Josefin Sans, sans-serif', fontWeight: 300, fontSize: '0.65rem', letterSpacing: '0.1em', color: 'var(--grullo)', marginTop: '2px' }}>
                2:00 PM
              </p>
            </div>
          </div>

          {/* Lugar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span style={{ fontSize: '0.85rem', color: 'var(--thyme)' }}>📍</span>
            <div>
              <p style={{ fontFamily: 'Cormorant Garamond, serif', fontWeight: 500, fontSize: 'clamp(1rem,3vw,1.1rem)', color: 'var(--rifle)', lineHeight: 1.3 }}>
                Ibarra, Ecuador
              </p>
              <p style={{ fontFamily: 'Josefin Sans, sans-serif', fontWeight: 300, fontSize: '0.65rem', letterSpacing: '0.1em', color: 'var(--grullo)', marginTop: '2px' }}>
                Provincia de Imbabura
              </p>
            </div>
          </div>
        </div>

        <p style={{ fontFamily: 'Cormorant Garamond, serif', fontStyle: 'italic', fontWeight: 300, fontSize: '0.88rem', color: 'var(--sage)', lineHeight: 1.7, marginBottom: '20px', opacity: 0.85 }}>
          Pronto recibirás tu invitación formal con todos los detalles.
        </p>

        <Divider color="var(--grullo)" />

        <p style={{ fontFamily: 'Josefin Sans, sans-serif', fontWeight: 300, fontSize: '0.62rem', letterSpacing: '0.14em', color: 'var(--grullo)', margin: '18px 0 6px' }}>
          Con cariño,
        </p>

        <p style={{ fontFamily: 'Pinyon Script, cursive', fontSize: 'clamp(2rem,7vw,2.6rem)', color: 'var(--rifle)', lineHeight: 1.2, opacity: 0.8 }}>
          Naim & Sarahí
        </p>

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px', marginTop: '20px' }}>
          <div style={{ width: '24px', height: '1px', background: 'linear-gradient(to right, transparent, var(--grullo))' }} />
          <span style={{ color: 'var(--grullo)', fontSize: '0.5rem' }}>✦</span>
          <div style={{ width: '24px', height: '1px', background: 'linear-gradient(to left, transparent, var(--grullo))' }} />
        </div>
      </div>
    </section>
  )
}
