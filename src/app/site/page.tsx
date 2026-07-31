import OrcamentoForm from "@/components/site/OrcamentoForm";
import Reveal from "@/components/site/Reveal";
import CountUp from "@/components/site/CountUp";
import ChatDemo from "@/components/site/ChatDemo";

export const dynamic = "force-dynamic";

const WHATS = "5585984500465";
const waLink = `https://wa.me/${WHATS}?text=${encodeURIComponent("Olá! Gostaria de um orçamento de viagem.")}`;

const servicos = [
  { t: "Passagens nacionais", d: "As melhores tarifas para todo o Brasil, com parcelamento que cabe no seu planejamento." },
  { t: "Passagens internacionais", d: "Emissões para qualquer destino do mundo, com acompanhamento em toda a jornada." },
  { t: "Pacotes completos", d: "Voo, hospedagem e experiências reunidos — você só decide para onde ir." },
  { t: "Passaporte e documentação", d: "Orientação precisa para viajar sem imprevistos burocráticos." },
  { t: "Pagamento facilitado", d: "Condições e parcelamentos pensados para o seu orçamento." },
  { t: "Suporte 24 horas", d: "Atendimento antes, durante e depois da viagem — sempre que você precisar." },
];

const passos = [
  { n: "I", t: "Conte seu plano", d: "Origem, destino, datas e número de passageiros — em poucos minutos." },
  { n: "II", t: "Receba a cotação", d: "Reunimos as melhores opções e respondemos rapidamente pelo WhatsApp." },
  { n: "III", t: "Viaje tranquilo", d: "Cuidamos da emissão e acompanhamos cada etapa da sua viagem." },
];

const destinos = [
  { t: "Lisboa", s: "Portugal", g: "linear-gradient(160deg,#c67a4a,#7a3b28)" },
  { t: "Cancún", s: "México", g: "linear-gradient(160deg,#3f8a94,#123a4a)" },
  { t: "Noronha", s: "Brasil", g: "linear-gradient(160deg,#3f8f6a,#12333a)" },
  { t: "Buenos Aires", s: "Argentina", g: "linear-gradient(160deg,#5a6f9c,#252f52)" },
];

const feats = [
  { k: "01", t: "Nove anos de estrada", d: "Quase uma década desenhando viagens com segurança e cuidado." },
  { k: "02", t: "Tarifas negociadas", d: "Pesquisamos e negociamos por você as condições mais vantajosas." },
  { k: "03", t: "Gente de verdade", d: "Consultores que entendem do assunto — atendimento próximo, nada de respostas frias." },
  { k: "04", t: "Agilidade real", d: "Cotação rápida, sem você esperar dias por um retorno." },
];

const depoimentos = [
  { txt: "Realizei o sonho de conhecer a Europa com um pacote que coube no meu orçamento. Atendimento impecável.", who: "Ana Paula — Fortaleza" },
  { txt: "Consegui passagens bem mais baratas do que sozinha. E ainda me orientaram com o passaporte.", who: "Rodrigo M. — Recife" },
  { txt: "O suporte salvou minha viagem quando o voo atrasou. Recomendo sem pensar duas vezes.", who: "Camila S. — São Paulo" },
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
          <a className="g-btn g-btn-primary" href={waLink} target="_blank" rel="noopener">Falar agora</a>
        </div>
      </header>

      {/* Hero */}
      <section className="g-hero">
        <div className="g-container g-hero-grid">
          <div>
            <span className="g-eyebrow light">Agência de viagens · desde 2016</span>
            <h1 style={{ marginTop: 22 }}>
              Sonhos viram<br /><span className="accent">passagens reais</span>
            </h1>
            <p className="g-hero-sub">
              Passagens nacionais e internacionais, pacotes e emissões com tarifas negociadas —
              e um atendimento que responde na hora, a qualquer hora.
            </p>
            <div className="g-hero-meta">
              <span>Nacional &amp; internacional</span>
              <span className="sep" />
              <span>Parcelamento facilitado</span>
              <span className="sep" />
              <span>Suporte 24h</span>
            </div>
            <div className="g-stats">
              <div className="g-stat"><div className="num"><CountUp to={9} suffix="" /></div><div className="lbl">Anos de experiência</div></div>
              <div className="g-stat"><div className="num"><CountUp to={24} suffix="h" /></div><div className="lbl">De suporte</div></div>
              <div className="g-stat"><div className="num">+120</div><div className="lbl">Destinos atendidos</div></div>
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
          <Reveal>
            <div className="g-head">
              <span className="g-eyebrow">O que oferecemos</span>
              <h2>Tudo para a sua viagem, do primeiro contato ao retorno</h2>
            </div>
          </Reveal>
          <div className="g-cards">
            {servicos.map((s, i) => (
              <Reveal key={s.t} delay={i * 60}>
                <div className="g-card">
                  <span className="idx">{String(i + 1).padStart(2, "0")}</span>
                  <h3>{s.t}</h3>
                  <p>{s.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Assinatura: atendimento IA */}
      <section className="g-section ink">
        <div className="g-container g-signature">
          <Reveal>
            <div>
              <span className="g-eyebrow light">Atendimento que não dorme</span>
              <h2 style={{ fontSize: "clamp(30px,4.4vw,50px)", marginTop: 18 }}>
                A resposta chega <em>na hora</em>,<br />a qualquer hora
              </h2>
              <p style={{ color: "rgba(255,255,255,.72)", marginTop: 18, fontSize: 18, maxWidth: "46ch", lineHeight: 1.7 }}>
                Nada de esperar dias por um orçamento. Nosso atendimento inteligente entende o
                que você precisa e já adianta as melhores opções — de dia, de madrugada ou no fim de semana.
              </p>
              <div className="g-sig-list">
                <div className="g-sig-item"><span className="k">i</span><div><h3>Resposta imediata</h3><p>Sem fila e sem “aguarde”. Você é atendido no primeiro contato.</p></div></div>
                <div className="g-sig-item"><span className="k">ii</span><div><h3>24 horas por dia</h3><p>Inclusive quando a concorrência já fechou.</p></div></div>
                <div className="g-sig-item"><span className="k">iii</span><div><h3>Consultor humano quando importa</h3><p>Casos especiais seguem direto com nossa equipe.</p></div></div>
              </div>
            </div>
          </Reveal>
          <Reveal delay={120}>
            <ChatDemo />
          </Reveal>
        </div>
      </section>

      {/* Como funciona */}
      <section className="g-section ink" id="como" style={{ background: "var(--ink-2)" }}>
        <div className="g-container">
          <Reveal>
            <div className="g-head">
              <span className="g-eyebrow light">O processo</span>
              <h2>Três passos até a próxima viagem</h2>
            </div>
          </Reveal>
          <div className="g-steps">
            {passos.map((p, i) => (
              <Reveal key={p.n} delay={i * 90}>
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

      {/* Destinos */}
      <section className="g-section paper" id="destinos">
        <div className="g-container">
          <Reveal>
            <div className="g-head">
              <span className="g-eyebrow">Inspiração</span>
              <h2>Destinos que ficam na memória</h2>
              <p>Alguns dos lugares mais pedidos pelos nossos viajantes — mas levamos você a qualquer canto do mundo.</p>
            </div>
          </Reveal>
          <div className="g-dest">
            {destinos.map((d, i) => (
              <Reveal key={d.t} delay={i * 70}>
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
          <Reveal>
            <div className="g-head">
              <span className="g-eyebrow">Por que a GAABTUR</span>
              <h2>Viajar com quem entende faz diferença</h2>
            </div>
          </Reveal>
          <div className="g-feats">
            {feats.map((f) => (
              <Reveal key={f.k}>
                <div className="g-feat-row">
                  <span className="k">{f.k}</span>
                  <h3>{f.t}</h3>
                  <p>{f.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="g-section paper">
        <div className="g-container">
          <Reveal>
            <div className="g-head">
              <span className="g-eyebrow">Quem viajou, recomenda</span>
              <h2>Histórias de quem já embarcou</h2>
            </div>
          </Reveal>
          <div className="g-quotes">
            {depoimentos.map((d, i) => (
              <Reveal key={d.who} delay={i * 80}>
                <div className="g-testi">
                  <div className="mark">&ldquo;</div>
                  <p>{d.txt}</p>
                  <div className="who">{d.who}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="g-section">
        <div className="g-container">
          <Reveal>
            <div className="g-cta-band">
              <div>
                <h2>Seu próximo destino já pode começar hoje</h2>
                <p>Preencha o formulário ou fale com a nossa equipe — respondemos na hora, 24 horas por dia.</p>
              </div>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                <a className="g-btn g-btn-primary g-btn-lg" href="#orcamento">Pedir cotação</a>
                <a className="g-btn g-btn-outline-light g-btn-lg" href={waLink} target="_blank" rel="noopener">WhatsApp</a>
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
              <p style={{ marginTop: 16, maxWidth: "36ch" }}>
                Sonhos viram passagens reais. Agência de viagens com nove anos de experiência,
                atendimento próximo e suporte 24 horas.
              </p>
            </div>
            <div>
              <h4>Contato</h4>
              <p><a href={waLink} target="_blank" rel="noopener">WhatsApp +55 85 98450-0465</a></p>
              <p><a href="https://instagram.com/gaabtur_oficial" target="_blank" rel="noopener">@gaabtur_oficial</a></p>
            </div>
            <div>
              <h4>Navegue</h4>
              <p><a href="#servicos">Serviços</a></p>
              <p><a href="#orcamento">Pedir orçamento</a></p>
            </div>
          </div>
          <div className="g-footer-bottom">
            <span>© {new Date().getFullYear()} GAABTUR. Todos os direitos reservados.</span>
            <span>Fortaleza · Ceará</span>
          </div>
        </div>
      </footer>
    </>
  );
}
