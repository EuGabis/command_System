import OrcamentoForm from "@/components/site/OrcamentoForm";
import Reveal from "@/components/site/Reveal";
import { Ico, WhatsIcon } from "@/components/site/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUsers, faTicket, faGlobe, faPaw, faPlane, faHotel, faShip, faPassport, faHeadset,
} from "@fortawesome/free-solid-svg-icons";

const FA_MAP = {
  users: faUsers, ticket: faTicket, globe: faGlobe, paw: faPaw, plane: faPlane,
  hotel: faHotel, ship: faShip, passport: faPassport, headset: faHeadset,
} as const;

// Ícone dos blocos "Por que escolher" e "Serviços" (sólidos, Font Awesome).
function SvcIcon({ name }: { name: string }) {
  if (name === "shieldcheck") {
    return (
      <svg viewBox="0 0 24 24" aria-hidden>
        <path
          fill="currentColor"
          fillRule="evenodd"
          d="M12 2 4 5v6c0 5 3.4 8.5 8 10 4.6-1.5 8-5 8-10V5l-8-3zM16.8 8.3 10.6 14.5 7.4 11.3 5.9 12.8 10.6 17.5 18.3 9.8 16.8 8.3z"
        />
      </svg>
    );
  }
  return <FontAwesomeIcon icon={FA_MAP[name as keyof typeof FA_MAP] ?? faGlobe} />;
}

export const dynamic = "force-dynamic";

const WHATS = "5585984500465";
const waLink = `https://wa.me/${WHATS}?text=${encodeURIComponent("Olá! Gostaria de solicitar um orçamento de viagem.")}`;

const HERO_IMG = "/banner.jpg";
const CTA_IMG = "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?auto=format&fit=crop&w=1600&q=80";

const porque = [
  { ic: "users", t: "Atendimento personalizado", d: "Cuidamos de cada detalhe para você viajar tranquilo." },
  { ic: "ticket", t: "Melhores tarifas", d: "Trabalhamos com as melhores companhias e condições do mercado." },
  { ic: "shieldcheck", t: "Suporte completo", d: "Antes, durante e depois da sua viagem, estamos sempre com você." },
  { ic: "globe", t: "Nacional e internacional", d: "Para onde você quiser, nós levamos você." },
  { ic: "paw", t: "Viagens com pet", d: "Assessoria completa para viajar com o seu melhor amigo." },
];

const servicos = [
  { ic: "plane", t: "Passagens aéreas", d: "Nacionais e internacionais com as melhores tarifas." },
  { ic: "hotel", t: "Hotéis", d: "As melhores opções de hospedagem no mundo todo." },
  { ic: "shieldcheck", t: "Seguro viagem", d: "Viaje com tranquilidade e proteção garantida." },
  { ic: "ship", t: "Cruzeiros", d: "Experiências incríveis em alto mar." },
  { ic: "passport", t: "Passaporte", d: "Assessoria completa para emissão do seu passaporte." },
  { ic: "globe", t: "Viagens internacionais", d: "Roteiros personalizados para realizar o seu sonho." },
  { ic: "paw", t: "Viagens com pet", d: "Toda a documentação e suporte para viajar com seu pet." },
  { ic: "headset", t: "Atendimento 100% online", d: "Converse com a nossa equipe pelo WhatsApp onde estiver." },
];

const videos = [
  { src: "/depoimento-edilene.mp4", nome: "Edilene Cavalcante", legenda: "Cliente GAABTUR" },
];

const depoimentos = [
  { txt: "Atendimento excelente! A GAABTUR cuidou de tudo da minha viagem para a Europa. Super indico!", nome: "Juliana M.", cidade: "Fortaleza · CE", img: "https://i.pravatar.cc/80?img=45" },
  { txt: "Empresa séria, confiável e com preços justos. Me senti segura da ida ao fim da minha viagem.", nome: "Carlos A.", cidade: "São Paulo · SP", img: "https://i.pravatar.cc/80?img=12" },
  { txt: "Suporte incrível! Tive assistência em todo momento. Já vou fechar a próxima viagem com eles.", nome: "Fernanda L.", cidade: "Rio de Janeiro · RJ", img: "https://i.pravatar.cc/80?img=32" },
];

function Logo({ height = 40 }: { height?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src="/logo.png" alt="GAABTUR — Viagens e Turismo" className="g-logo-img" style={{ height }} />
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
          <div className="g-nav-right">
            <a className="g-btn g-btn-primary g-btn-sm" href={waLink} target="_blank" rel="noopener">
              <WhatsIcon /> <span className="g-btn-label">Solicitar </span>orçamento
            </a>
            <details className="g-menu">
              <summary aria-label="Menu">
                <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M3 6h18M3 12h18M3 18h18" /></svg>
              </summary>
              <div className="g-menu-panel">
                <a href="#top">Início</a>
                <a href="#servicos">Serviços</a>
                <a href="#depoimentos">Depoimentos</a>
                <a href="#orcamento">Orçamento</a>
                <a href="#contato">Contato</a>
              </div>
            </details>
          </div>
        </div>
      </header>

      {/* Hero — capa de ponta a ponta */}
      <section className="g-hero" style={{ backgroundImage: `url(${HERO_IMG})` }}>
        <div className="g-container g-hero-inner">
          <div className="g-hero-left">
            <h1>Sua próxima viagem começa com a <span className="wm-gaab">GAAB</span><span className="orange">TUR.</span></h1>
            <p>
              Aqui você encontra as melhores opções em passagens, hotéis, seguro viagem, passaporte
              e muito mais, com atendimento humanizado do início ao fim da sua viagem.
            </p>
            <div className="g-hero-cta">
              <a className="g-btn g-btn-primary g-btn-lg g-btn-pulse" href={waLink} target="_blank" rel="noopener">
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
            <h2>Por que escolher a <span className="wm-gaab">GAAB</span><span className="orange">TUR</span>?</h2>
            <span className="g-divider" />
          </div>
          <div className="g-why">
            {porque.map((p, i) => (
              <Reveal key={p.t} delay={i * 60}>
                <div className="g-why-item">
                  <div className="g-ic"><SvcIcon name={p.ic} /></div>
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
              <Reveal key={s.t} delay={i * 60} from={i % 2 === 0 ? "left" : "right"}>
                <div className="g-svc">
                  <div className="g-ic"><SvcIcon name={s.ic} /></div>
                  <h3>{s.t}</h3>
                  <p>{s.d}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Depoimentos em vídeo */}
      <section className="g-section ink">
        <div className="g-container">
          <div className="g-section-head">
            <h2>Depoimentos em <span className="orange">vídeo</span></h2>
            <p>Veja quem já viajou com a gente contando como foi a experiência.</p>
          </div>
          <div className="g-videos">
            {videos.map((v) => (
              <figure className="g-video" key={v.src}>
                <video controls preload="none" poster="/video-poster.jpg" playsInline>
                  <source src={v.src} type="video/mp4" />
                  Seu navegador não suporta vídeo.
                </video>
                <figcaption>{v.nome}<span>{v.legenda}</span></figcaption>
              </figure>
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
              Solicite sua cotação online.
            </h2>
            <p style={{ color: "var(--muted)", marginTop: 14, fontSize: 16.5, maxWidth: "44ch" }}>
              Nós encontramos a melhor opção para a sua viagem e entraremos em contato.
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
              <p style={{ marginTop: 18, color: "#fff", fontWeight: 700, fontFamily: "var(--font-display)", fontSize: 16 }}>
                Sua próxima viagem começa aqui.
              </p>
              <p style={{ marginTop: 8, maxWidth: "42ch" }}>
                Há mais de 9 anos, a GAABTUR conecta pessoas aos melhores destinos, oferecendo
                atendimento personalizado, preços competitivos e total segurança para você viajar
                com tranquilidade.
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
            © 2026 GAABTUR Viagens e Turismo.<br />Todos os direitos reservados.
          </div>
        </div>
      </footer>
    </>
  );
}
