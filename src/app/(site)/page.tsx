import OrcamentoForm from "@/components/site/OrcamentoForm";
import Reveal from "@/components/site/Reveal";
import { Ico, WhatsIcon } from "@/components/site/icons";

export const dynamic = "force-dynamic";

const WHATS = "5585984500465";
const waLink = `https://wa.me/${WHATS}?text=${encodeURIComponent("Olá! Gostaria de solicitar um orçamento de viagem.")}`;

const HERO_IMG = "/banner.jpg";
const CTA_IMG = "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1600&q=80";

const porque = [
  { ic: "user", t: "Atendimento personalizado", d: "Cuidamos de cada detalhe para você viajar tranquilo." },
  { ic: "tag", t: "Melhores tarifas", d: "Trabalhamos com as melhores companhias e condições do mercado." },
  { ic: "headset", t: "Suporte completo", d: "Antes, durante e depois da sua viagem, estamos sempre com você." },
  { ic: "globe", t: "Nacional e internacional", d: "Para onde você quiser, nós levamos você." },
  { ic: "paw", t: "Viagens com pet", d: "Assessoria completa para viajar com o seu melhor amigo." },
];

const servicos = [
  { ic: "plane", t: "Passagens aéreas", d: "Nacionais e internacionais com as melhores tarifas." },
  { ic: "hotel", t: "Hotéis", d: "As melhores opções de hospedagem no mundo todo." },
  { ic: "insurance", t: "Seguro viagem", d: "Viaje com tranquilidade e proteção garantida." },
  { ic: "ship", t: "Cruzeiros", d: "Experiências incríveis em alto mar." },
  { ic: "passport", t: "Passaporte", d: "Assessoria completa para emissão do seu passaporte." },
  { ic: "globe", t: "Viagens internacionais", d: "Roteiros personalizados para realizar o seu sonho." },
  { ic: "paw", t: "Viagens com pet", d: "Toda a documentação e suporte para viajar com seu pet." },
  { ic: "headset", t: "Atendimento 100% online", d: "Converse com a nossa equipe pelo WhatsApp onde estiver." },
];

const depoimentos = [
  { txt: "Atendimento excelente! A GAABTUR cuidou de tudo da minha viagem para a Europa. Super indico!", nome: "Juliana M.", cidade: "Fortaleza · CE", img: "https://i.pravatar.cc/80?img=45" },
  { txt: "Empresa séria, confiável e com preços justos. Me senti segura da ida ao fim da minha viagem.", nome: "Carlos A.", cidade: "São Paulo · SP", img: "https://i.pravatar.cc/80?img=12" },
  { txt: "Suporte incrível! Tive assistência em todo momento. Já vou fechar a próxima viagem com eles.", nome: "Fernanda L.", cidade: "Rio de Janeiro · RJ", img: "https://i.pravatar.cc/80?img=32" },
];

function Logo({ height = 46 }: { height?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/logo.jpeg" alt="GAABTUR — Viagens e Turismo" className="g-logo-img" style={{ height }} />
  );
}

export default function SitePage() {
  return (
    <>
      {/* Header */}
      <header className="g-header" id="top">
        <div className="g-container g-nav">
          <Logo />
          <nav className="g-nav-links">
            <a href="#top" className="active">Início</a>
            <a href="#servicos">Serviços</a>
            <a href="#depoimentos">Depoimentos</a>
            <a href="#orcamento">Orçamento</a>
            <a href="#contato">Contato</a>
          </nav>
          <a className="g-btn g-btn-primary" href={waLink} target="_blank" rel="noopener">
            <WhatsIcon /> Solicitar orçamento
          </a>
        </div>
      </header>

      {/* Hero — capa de ponta a ponta */}
      <section className="g-hero" style={{ backgroundImage: `url(${HERO_IMG})` }}>
        <div className="g-container g-hero-inner">
          <div className="g-hero-left">
            <h1>Sua próxima viagem começa com a <span className="orange">GAABTUR.</span></h1>
            <p>
              Aqui você encontra as melhores opções em passagens, hotéis, seguro viagem, passaporte
              e muito mais, com atendimento humanizado do início ao fim da sua viagem.
            </p>
            <div className="g-hero-cta">
              <a className="g-btn g-btn-primary g-btn-lg" href={waLink} target="_blank" rel="noopener">
                <WhatsIcon /> Solicitar orçamento pelo WhatsApp
              </a>
            </div>
            <div className="g-trust">
              <span><span className="dot" /> Compra segura</span>
              <span><span className="dot" /> Suporte completo</span>
              <span><span className="dot" /> 9 anos de experiência</span>
            </div>
          </div>
        </div>
      </section>

      {/* Por que escolher */}
      <section className="g-section dark">
        <div className="g-container">
          <div className="g-section-head">
            <h2>Por que escolher a <span className="orange">GAABTUR</span>?</h2>
            <span className="g-divider" />
          </div>
          <div className="g-why">
            {porque.map((p, i) => (
              <Reveal key={p.t} delay={i * 60}>
                <div className="g-why-item">
                  <div className="g-ic"><Ico name={p.ic} /></div>
                  <h3>{p.t}</h3>
                  <p>{p.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Serviços */}
      <section className="g-section" id="servicos">
        <div className="g-container">
          <div className="g-section-head">
            <h2>Nossos <span className="orange">serviços</span></h2>
            <p>Tudo o que você precisa para viajar com praticidade e segurança.</p>
          </div>
          <div className="g-services">
            {servicos.map((s, i) => (
              <Reveal key={s.t} delay={i * 50}>
                <div className="g-svc">
                  <div className="g-ic"><Ico name={s.ic} /></div>
                  <h3>{s.t}</h3>
                  <p>{s.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Depoimentos */}
      <section className="g-section charcoal" id="depoimentos">
        <div className="g-container">
          <div className="g-section-head">
            <h2>O que nossos <span className="orange">clientes</span> dizem</h2>
            <span className="g-divider" />
          </div>
          <div className="g-testis">
            {depoimentos.map((d, i) => (
              <Reveal key={d.nome} delay={i * 80}>
                <div className="g-testi">
                  <div className="mark">&ldquo;</div>
                  <div className="stars">★★★★★</div>
                  <p>{d.txt}</p>
                  <div className="who">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={d.img} alt={d.nome} />
                    <span><b>{d.nome}</b><small>{d.cidade}</small></span>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* CTA band */}
      <section className="g-cta" style={{ backgroundImage: `url(${CTA_IMG})` }}>
        <div className="g-container g-cta-inner">
          <div>
            <span className="g-eyebrow" style={{ color: "rgba(255,255,255,.85)" }}>Vamos realizar sua próxima viagem?</span>
            <h2 style={{ marginTop: 10 }}>Pronto para decolar?</h2>
            <p>Fale agora com um de nossos consultores e receba seu orçamento em minutos.</p>
            <a className="g-btn g-btn-primary g-btn-lg" href={waLink} target="_blank" rel="noopener" style={{ marginTop: 22, background: "#fff", color: "var(--orange-dk)" }}>
              <WhatsIcon /> Quero meu orçamento
            </a>
          </div>
          <div className="g-cta-list">
            <span><span className="c"><Ico name="lightning" /></span> Resposta rápida</span>
            <span><span className="c"><Ico name="check" /></span> Orçamento sem compromisso</span>
            <span><span className="c"><Ico name="chat" /></span> Atendimento humanizado</span>
          </div>
        </div>
      </section>

      {/* Formulário (integra ao funil) */}
      <section className="g-section g-form-section" id="orcamento">
        <div className="g-container g-form-wrap">
          <div>
            <span className="g-eyebrow">Orçamento online</span>
            <h2 style={{ fontSize: "clamp(26px,3.4vw,38px)", marginTop: 12, color: "var(--ink)" }}>
              Prefere pedir por aqui? A gente te chama no WhatsApp.
            </h2>
            <p style={{ color: "var(--muted)", marginTop: 14, fontSize: 16.5, maxWidth: "44ch" }}>
              Preencha os dados da viagem e nossa equipe retorna com as melhores opções — rápido e sem compromisso.
            </p>
          </div>
          <OrcamentoForm />
        </div>
      </section>

      {/* Footer */}
      <footer className="g-footer" id="contato">
        <div className="g-container">
          <div className="g-footer-grid">
            <div>
              <Logo />
              <p style={{ marginTop: 16, maxWidth: "34ch" }}>
                Há 9 anos transformando sonhos em viagens inesquecíveis. Atendimento 100% online,
                com confiança e segurança.
              </p>
              <div className="g-socials">
                <a href="https://instagram.com/gaabtur_oficial" target="_blank" rel="noopener" aria-label="Instagram"><Ico name="instagram" /></a>
                <a href="#" aria-label="Facebook"><Ico name="facebook" /></a>
                <a href={waLink} target="_blank" rel="noopener" aria-label="WhatsApp"><WhatsIcon /></a>
              </div>
            </div>
            <div>
              <h4>Links úteis</h4>
              <ul>
                <li><a href="#top">Início</a></li>
                <li><a href="#servicos">Serviços</a></li>
                <li><a href="#depoimentos">Depoimentos</a></li>
                <li><a href="#orcamento">Orçamento</a></li>
              </ul>
            </div>
            <div>
              <h4>Serviços</h4>
              <ul>
                <li><a href="#servicos">Passagens aéreas</a></li>
                <li><a href="#servicos">Hotéis</a></li>
                <li><a href="#servicos">Seguro viagem</a></li>
                <li><a href="#servicos">Cruzeiros</a></li>
                <li><a href="#servicos">Viagens com pet</a></li>
              </ul>
            </div>
            <div>
              <h4>Fale conosco</h4>
              <ul className="g-foot-contact">
                <li><Ico name="phone" /> <a href={waLink} target="_blank" rel="noopener">(85) 9 8450-0465</a></li>
                <li><Ico name="instagram" /> <a href="https://instagram.com/gaabtur_oficial" target="_blank" rel="noopener">@gaabtur_oficial</a></li>
                <li><Ico name="mail" /> contato@gaabtur.com.br</li>
                <li><Ico name="pin" /> Fortaleza · CE</li>
              </ul>
            </div>
          </div>
          <div className="g-foot-bottom">
            © {new Date().getFullYear()} GAABTUR Viagens e Turismo. Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </>
  );
}
