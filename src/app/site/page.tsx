import OrcamentoForm from "@/components/site/OrcamentoForm";
import Reveal from "@/components/site/Reveal";
import CountUp from "@/components/site/CountUp";
import ChatDemo from "@/components/site/ChatDemo";

export const dynamic = "force-dynamic";

const WHATS = "5585984500465";
const waLink = `https://wa.me/${WHATS}?text=${encodeURIComponent("Olá! Quero um orçamento de viagem.")}`;

const servicos = [
  { ic: "🎫", t: "Passagens nacionais", d: "As melhores tarifas para todo o Brasil, com parcelamento facilitado." },
  { ic: "🌍", t: "Passagens internacionais", d: "Emissões para qualquer destino do mundo, com todo o suporte na sua viagem." },
  { ic: "🧳", t: "Pacotes completos", d: "Voo, hospedagem e passeios em um só lugar — é só fazer as malas." },
  { ic: "🛂", t: "Passaporte & documentação", d: "Orientação completa para você viajar sem dor de cabeça." },
  { ic: "💳", t: "Pagamento facilitado", d: "Condições e parcelamentos que cabem no seu bolso." },
  { ic: "💬", t: "Suporte 24h", d: "Atendimento humano e IA a qualquer hora, antes, durante e depois da viagem." },
];

const passos = [
  { n: "01", t: "Conta pra gente", d: "Envie origem, destino, datas e quantidade de passageiros pelo formulário." },
  { n: "02", t: "Receba a cotação", d: "Nossa equipe monta as melhores opções e te responde rapidinho no WhatsApp." },
  { n: "03", t: "Viaje tranquilo", d: "Emitimos tudo e ficamos com você em cada etapa. Sonho vira passagem real." },
];

const destinos = [
  { t: "Lisboa", s: "Portugal", g: "linear-gradient(160deg,#ff9a56,#e8482a)" },
  { t: "Cancún", s: "México", g: "linear-gradient(160deg,#2fb8c6,#0b6e8f)" },
  { t: "Fernando de Noronha", s: "Brasil", g: "linear-gradient(160deg,#33c47a,#0b3a5b)" },
  { t: "Buenos Aires", s: "Argentina", g: "linear-gradient(160deg,#6f8bd6,#2a3f8f)" },
];

const feats = [
  { ic: "🏆", t: "9 anos de experiência", d: "Quase uma década realizando sonhos de viagem com segurança." },
  { ic: "💰", t: "Melhores tarifas", d: "Pesquisamos por você e negociamos as condições mais vantajosas." },
  { ic: "🤝", t: "Atendimento de verdade", d: "Gente real que entende do assunto — nada de robôs frios." },
  { ic: "⚡", t: "Resposta rápida", d: "Cotação ágil no WhatsApp, sem você ficar esperando dias." },
];

const depoimentos = [
  { txt: "Realizei o sonho de conhecer a Europa com um pacote que coube no meu orçamento. Atendimento nota 10!", who: "Ana Paula, Fortaleza" },
  { txt: "Consegui passagens muito mais baratas do que achei sozinho. E ainda me ajudaram com o passaporte.", who: "Rodrigo M., Recife" },
  { txt: "Suporte 24h salvou minha viagem quando meu voo atrasou. Recomendo de olhos fechados.", who: "Camila S., São Paulo" },
];

export default function SitePage() {
  return (
    <>
      {/* Header */}
      <header className="g-header">
        <div className="g-container g-nav">
          <div className="g-logo">GAAB<span>TUR</span></div>
          <nav className="g-nav-links">
            <a href="#servicos">Serviços</a>
            <a href="#como">Como funciona</a>
            <a href="#destinos">Destinos</a>
            <a href="#orcamento">Orçamento</a>
          </nav>
          <a className="g-btn g-btn-primary" href={waLink} target="_blank" rel="noopener">WhatsApp</a>
        </div>
      </header>

      {/* Hero */}
      <section className="g-hero">
        <div className="g-sun" aria-hidden />
        <svg className="g-route" viewBox="0 0 660 300" preserveAspectRatio="none" aria-hidden>
          <path d="M 40 250 Q 300 60 620 180" />
        </svg>
        <div className="g-plane" aria-hidden>✈️</div>

        <div className="g-container g-hero-grid">
          <div>
            <span className="g-eyebrow" style={{ color: "#ffd9a8" }}>✈️ Agência de viagens · há 9 anos</span>
            <h1 style={{ marginTop: 14 }}>Sonhos viram <em>passagens reais</em></h1>
            <p className="g-hero-sub">
              Passagens nacionais e internacionais, pacotes e emissões com as melhores tarifas —
              e um atendimento com IA que responde <strong>na hora</strong>, 24h por dia.
            </p>
            <div className="g-hero-badges">
              <span className="g-chip f">🌍 Nacional & Internacional</span>
              <span className="g-chip">💳 Parcele sua viagem</span>
              <span className="g-chip">💬 Suporte 24h</span>
            </div>
            <div className="g-stats">
              <div className="g-stat"><div className="num"><CountUp to={9} suffix="+" /></div><div className="lbl">anos de estrada</div></div>
              <div className="g-stat"><div className="num"><CountUp to={24} suffix="h" /></div><div className="lbl">de suporte</div></div>
              <div className="g-stat"><div className="num">∞</div><div className="lbl">destinos possíveis</div></div>
            </div>
          </div>
          <div id="orcamento">
            <OrcamentoForm />
          </div>
        </div>
      </section>

      {/* Serviços */}
      <section className="g-section" id="servicos">
        <div className="g-container">
          <div className="g-head">
            <span className="g-eyebrow">O que fazemos</span>
            <h2>Tudo para a sua viagem em um só lugar</h2>
            <p>Da passagem ao passaporte, cuidamos de cada detalhe para você só se preocupar em aproveitar.</p>
          </div>
          <div className="g-cards">
            {servicos.map((s, i) => (
              <Reveal key={s.t} delay={i * 70}>
                <div className="g-card">
                  <div className="ic">{s.ic}</div>
                  <h3>{s.t}</h3>
                  <p>{s.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Como funciona */}
      <section className="g-section sky" id="como">
        <div className="g-container">
          <div className="g-head">
            <span className="g-eyebrow" style={{ color: "#ffd9a8" }}>Simples assim</span>
            <h2>Como funciona</h2>
            <p>Três passos até a sua próxima viagem.</p>
          </div>
          <div className="g-steps">
            {passos.map((p, i) => (
              <Reveal key={p.n} delay={i * 100}>
                <div className="g-step">
                  <div className="n">{p.n}</div>
                  <h3>{p.t}</h3>
                  <p>{p.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Assinatura: atendimento com IA 24h */}
      <section className="g-section alt">
        <div className="g-container g-signature">
          <Reveal>
            <div>
              <span className="g-eyebrow">Atendimento que nunca dorme</span>
              <h2 style={{ fontSize: "clamp(28px,4vw,44px)", fontWeight: 800, marginTop: 10 }}>
                A gente responde <span style={{ color: "var(--coral-dk)" }}>na hora</span>, a qualquer hora
              </h2>
              <p style={{ color: "var(--muted)", marginTop: 14, fontSize: 17, maxWidth: "46ch" }}>
                Nada de esperar dias por um orçamento. Nosso atendimento inteligente responde na
                hora, entende o que você precisa e já adianta as melhores opções — de dia, de
                madrugada, no fim de semana.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: 10, marginTop: 20 }}>
                <div className="g-feat"><div className="ic">⚡</div><div><h3>Resposta imediata</h3><p>Sem fila, sem “aguarde”. Você é atendido no primeiro “oi”.</p></div></div>
                <div className="g-feat"><div className="ic">🕓</div><div><h3>24 horas por dia</h3><p>Inclusive quando a concorrência está fechada.</p></div></div>
                <div className="g-feat"><div className="ic">👩‍💻</div><div><h3>Time humano quando precisa</h3><p>Casos especiais caem direto com nossos consultores.</p></div></div>
              </div>
            </div>
          </Reveal>
          <ChatDemo />
        </div>
      </section>

      {/* Destinos */}
      <section className="g-section alt" id="destinos">
        <div className="g-container">
          <div className="g-head">
            <span className="g-eyebrow">Inspiração</span>
            <h2>Destinos que são pura paixão</h2>
            <p>Alguns dos lugares mais pedidos pelos nossos viajantes — mas levamos você a qualquer canto do mundo.</p>
          </div>
          <div className="g-dest">
            {destinos.map((d, i) => (
              <Reveal key={d.t} delay={i * 80}>
                <div className="g-dest-card" style={{ backgroundImage: d.g }}>
                  <strong>{d.t}</strong>
                  <span>{d.s}</span>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Diferenciais */}
      <section className="g-section">
        <div className="g-container">
          <div className="g-head">
            <span className="g-eyebrow">Por que a GAABTUR</span>
            <h2>Viajar com quem entende faz diferença</h2>
          </div>
          <div className="g-feats">
            {feats.map((f, i) => (
              <Reveal key={f.t} delay={i * 80}>
                <div className="g-feat">
                  <div className="ic">{f.ic}</div>
                  <div>
                    <h3>{f.t}</h3>
                    <p>{f.d}</p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="g-section alt">
        <div className="g-container">
          <div className="g-head">
            <span className="g-eyebrow">Quem viajou, recomenda</span>
            <h2>Histórias de quem já embarcou</h2>
          </div>
          <div className="g-quotes">
            {depoimentos.map((d, i) => (
              <Reveal key={d.who} delay={i * 90}>
                <div className="g-testi">
                  <div className="g-stars">★★★★★</div>
                  <p style={{ marginTop: 8 }}>&ldquo;{d.txt}&rdquo;</p>
                  <div className="who">{d.who}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final — faixa estilo cartão de embarque */}
      <section className="g-section">
        <div className="g-container">
          <Reveal>
            <div className="g-boarding">
              <div className="stub">
                <span className="lbl">BOARDING</span>
                <span className="code">GAAB</span>
                <span className="lbl">✈ GO</span>
              </div>
              <div className="body">
                <div style={{ display: "flex", flexWrap: "wrap", gap: 20, alignItems: "center", justifyContent: "space-between" }}>
                  <div>
                    <h2 style={{ fontSize: "clamp(24px,3.4vw,36px)" }}>Seu próximo destino te espera</h2>
                    <p style={{ color: "var(--muted)", marginTop: 8, fontSize: 16, maxWidth: "46ch" }}>
                      Preencha o formulário no topo ou fale agora no WhatsApp — respondemos na hora, 24h por dia.
                    </p>
                  </div>
                  <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                    <a className="g-btn g-btn-primary g-btn-lg" href="#orcamento">Pedir cotação</a>
                    <a className="g-btn g-btn-ghost g-btn-lg" href={waLink} target="_blank" rel="noopener">💬 WhatsApp</a>
                  </div>
                </div>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="g-footer">
        <div className="g-container">
          <div className="g-footer-grid">
            <div>
              <div className="g-logo" style={{ color: "#fff" }}>GAAB<span>TUR</span></div>
              <p style={{ marginTop: 12, maxWidth: "34ch" }}>
                Sonhos viram passagens reais. Agência de viagens com 9 anos de experiência, atendimento humano e suporte 24h.
              </p>
            </div>
            <div>
              <h4>Contato</h4>
              <p><a href={waLink} target="_blank" rel="noopener">WhatsApp: +55 85 98450-0465</a></p>
              <p style={{ marginTop: 6 }}><a href="https://instagram.com/gaabtur_oficial" target="_blank" rel="noopener">@gaabtur_oficial</a></p>
            </div>
            <div>
              <h4>Serviços</h4>
              <p><a href="#servicos">Passagens & pacotes</a></p>
              <p style={{ marginTop: 6 }}><a href="#orcamento">Pedir orçamento</a></p>
            </div>
          </div>
          <div className="g-footer-bottom">
            <span>© {new Date().getFullYear()} GAABTUR. Todos os direitos reservados.</span>
            <span>Feito com ✈️ e ☀️</span>
          </div>
        </div>
      </footer>
    </>
  );
}
