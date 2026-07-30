import Link from "next/link";
import Icon, { type IconName } from "@/components/Icon";

export const metadata = { title: "Central de Ajuda — Central de Comando" };

function Item({
  icon,
  titulo,
  children,
  aberto = false,
}: {
  icon: IconName;
  titulo: string;
  children: React.ReactNode;
  aberto?: boolean;
}) {
  return (
    <details className="help-details" open={aberto}>
      <summary>
        <span className="help-ico"><Icon name={icon} size={18} /></span>
        {titulo}
      </summary>
      <div className="help-body">{children}</div>
    </details>
  );
}

export default function AjudaPage() {
  return (
    <div style={{ paddingBottom: 40 }}>
      <div className="eyebrow" style={{ marginBottom: 8 }}>Manual</div>
      <h1 style={{ fontSize: 25, fontWeight: 700, marginBottom: 4 }}>Central de Ajuda</h1>
      <p style={{ color: "var(--muted)", marginBottom: 24 }}>
        Guia completo do sistema. Toque em cada tópico para abrir.
      </p>

      <Item icon="info" titulo="O que é a Central de Comando" aberto>
        <p>
          A Central de Comando é um painel único para <strong>atender seus clientes no WhatsApp e
          no Instagram com ajuda de uma Inteligência Artificial (IA)</strong>. Ela recebe as
          mensagens, responde automaticamente com a personalidade que você configurar, organiza
          tudo em conversas e ainda monta um funil de vendas (pipeline) sozinha.
        </p>
        <p>Com ela você consegue:</p>
        <ul>
          <li>Conectar seus canais (WhatsApp e Instagram) num lugar só;</li>
          <li>Ter um atendente virtual respondendo 24h, com o tom e as informações do seu negócio;</li>
          <li>Assumir o controle manualmente a qualquer momento (falar como humano);</li>
          <li>Acompanhar cada contato num quadro de vendas que se organiza automaticamente.</li>
        </ul>
      </Item>

      <Item icon="rocket" titulo="Primeiros passos (ordem recomendada)">
        <p>Se está começando agora, siga esta ordem:</p>
        <ol>
          <li><strong>Entre na sua conta</strong> (login).</li>
          <li>Vá em <strong>Perfil</strong> e preencha seu nome e os <strong>dados do negócio</strong> (empresa/marca) — a IA usa isso como contexto.</li>
          <li>Conecte um canal em <strong>WhatsApp</strong> e/ou <strong>Instagram</strong>.</li>
          <li>Configure a <strong>IA</strong> de cada canal (persona, tom, informações).</li>
          <li>Acompanhe tudo em <strong>Conversas</strong> e no <strong>Pipeline</strong>.</li>
        </ol>
        <div className="tip">
          Você não precisa fazer tudo de uma vez. Pode conectar só o WhatsApp primeiro e adicionar
          o Instagram depois.
        </div>
      </Item>

      <Item icon="lock" titulo="Login e acesso">
        <p>
          O acesso é <strong>fechado</strong>: só quem tem conta entra. No <strong>primeiro
          acesso</strong>, a tela de login mostra a opção de criar a conta do dono. Depois disso, o
          cadastro trava — novas contas só são criadas por você.
        </p>
        <p>
          Todas as telas são protegidas: sem estar logado, o sistema sempre leva para a tela de
          login.
        </p>
        <div className="tip">
          Guarde bem seu e-mail e senha. Se esquecer a senha, ela pode ser redefinida no painel
          administrativo.
        </div>
      </Item>

      <Item icon="dashboard" titulo="Dashboard (tela inicial)">
        <p>
          É o resumo do seu atendimento, <strong>separado por canal</strong>. Para cada canal
          (WhatsApp e Instagram) você vê três números:
        </p>
        <ul>
          <li><strong>Conexão</strong> — se o canal está conectado, pendente ou com erro;</li>
          <li><strong>Conversas</strong> — total de conversas daquele canal;</li>
          <li><strong>Aguardando</strong> — conversas abertas ou que precisam de atenção humana.</li>
        </ul>
        <p>
          Os botões levam direto para configurar o canal ou ver as conversas dele. Abaixo há um
          <strong> checklist de configuração</strong> que mostra o que ainda falta ajustar.
        </p>
      </Item>

      <Item icon="whatsapp" titulo="Conectar o WhatsApp">
        <p>Existem <strong>duas formas</strong> de conectar o WhatsApp — escolha nas abas da tela:</p>
        <p>
          <strong>1) QR Code (mais simples)</strong> — conecta lendo um QR Code com o seu WhatsApp,
          igual ao WhatsApp Web. Rápido para começar. Bom para número pessoal/comercial comum.
        </p>
        <p>
          <strong>2) API Oficial (Meta Cloud API)</strong> — usa a conta oficial da Meta. Mais
          robusta e indicada para volume alto. Exige uma conta Meta Business e alguns dados:
        </p>
        <ul>
          <li><strong>Phone Number ID</strong> e <strong>WABA ID</strong> — identificadores do número;</li>
          <li><strong>Access Token</strong> — a “chave” de acesso do aplicativo;</li>
          <li><strong>Verify Token</strong> e <strong>URL de callback</strong> — usados para configurar o webhook no painel da Meta.</li>
        </ul>
        <p>
          Depois de salvar, use o botão <strong>Testar conexão</strong> para confirmar que está tudo
          certo. A própria tela do canal já mostra o resumo e as conversas do WhatsApp.
        </p>
        <div className="tip">
          Não sabe onde pegar esses dados? Eles ficam no painel <em>Meta for Developers</em>. Se
          preferir simplicidade, comece pela conexão por <strong>QR Code</strong>.
        </div>
      </Item>

      <Item icon="instagram" titulo="Conectar o Instagram">
        <p>
          O Instagram usa a API oficial da Meta (Graph API). É preciso ter uma conta{" "}
          <strong>Business ou Creator</strong> vinculada a uma Página do Facebook. Os dados pedidos são:
        </p>
        <ul>
          <li><strong>Page ID</strong> — ID da Página do Facebook;</li>
          <li><strong>Instagram Business Account ID</strong> — ID da conta comercial do Instagram;</li>
          <li><strong>Access Token</strong> e <strong>App Secret</strong> — chaves de acesso e verificação.</li>
        </ul>
        <p>Configure o webhook com a URL de callback mostrada na tela e teste a conexão.</p>
      </Item>

      <Item icon="ai" titulo="Configurar a IA (uma para cada canal)">
        <p>
          Na tela <strong>Configuração da IA</strong> você define como o atendente virtual se
          comporta. Cada canal tem sua <strong>própria configuração</strong> — troque entre WhatsApp
          e Instagram nas abas do topo. O que você pode ajustar:
        </p>
        <ul>
          <li><strong>Ligar/Desligar a IA</strong> — quando desligada, as mensagens são só registradas e ninguém recebe resposta automática (atendimento 100% humano);</li>
          <li><strong>Persona / instrução principal</strong> — quem é o atendente (ex.: “Você é o atendente da Loja X…”);</li>
          <li><strong>Tom de voz</strong> — formal, descontraído, etc.;</li>
          <li><strong>Modelo</strong> — qual motor de IA usar;</li>
          <li><strong>Base de conhecimento</strong> — informações do negócio: horários, preços, formas de pagamento, políticas, links. A IA usa isso para responder;</li>
          <li><strong>Regras de escalonamento</strong> — quando a IA deve passar para um humano (ex.: pedido de reembolso).</li>
        </ul>
        <div className="tip">
          Quanto mais completa a <strong>base de conhecimento</strong>, melhores e mais certas as
          respostas da IA.
        </div>
      </Item>

      <Item icon="chat" titulo="Conversas (inbox)">
        <p>
          É onde ficam todas as conversas, de todos os canais, em tempo real. Recursos:
        </p>
        <ul>
          <li><strong>Filtro por canal</strong> — ver só WhatsApp, só Instagram ou todos;</li>
          <li><strong>Histórico completo</strong> — cada mensagem, com data e quem enviou (cliente, IA ou você);</li>
          <li><strong>IA por conversa</strong> — dá para <strong>desligar a IA só naquela conversa</strong> quando você quiser assumir o atendimento pessoalmente, sem afetar as outras;</li>
          <li><strong>Envio manual</strong> — você digita e envia mensagens como atendente humano direto pela tela.</li>
        </ul>
        <div className="tip">
          Diferença importante: desligar a IA em <em>Configuração da IA</em> afeta o canal inteiro;
          desligar na conversa afeta só aquele contato.
        </div>
      </Item>

      <Item icon="pipeline" titulo="Pipeline (funil de vendas / Kanban)">
        <p>
          É um quadro que organiza seus contatos por etapa da venda — parecido com post-its em
          colunas. O diferencial: a <strong>IA preenche e move os cards sozinha</strong>, lendo as
          conversas.
        </p>
        <p>As etapas são:</p>
        <ul>
          <li><strong>Novo Lead</strong> → <strong>Em Atendimento</strong> → <strong>Cotação Enviada</strong> → <strong>Negociação</strong> → <strong>Fechado</strong> ou <strong>Perdido</strong>.</li>
        </ul>
        <p>
          A IA também <strong>extrai dados do lead</strong> da conversa (por exemplo origem, destino,
          datas, número de pessoas, valor) e resume o contato para você. Você pode{" "}
          <strong>arrastar um card manualmente</strong> para outra etapa — quando faz isso, aquele
          card fica “travado” e a IA não muda mais a etapa dele sozinha (você tem a palavra final).
        </p>
      </Item>

      <Item icon="user" titulo="Perfil e dados do negócio">
        <p>Na tela de Perfil você gerencia:</p>
        <ul>
          <li><strong>Nome de exibição</strong> e <strong>foto</strong>;</li>
          <li><strong>E-mail</strong> e <strong>troca de senha</strong>;</li>
          <li><strong>Dados do negócio</strong> (empresa e marca) — importantes porque a IA os usa como contexto: ela passa a atender “em nome de” sua empresa.</li>
        </ul>
      </Item>

      <Item icon="shield" titulo="Segurança e privacidade">
        <ul>
          <li><strong>Acesso protegido</strong> por login em todas as telas;</li>
          <li><strong>Credenciais criptografadas</strong> — os tokens do WhatsApp/Instagram são guardados de forma cifrada;</li>
          <li><strong>Banco protegido</strong> — as tabelas só são acessadas pelo servidor, nunca diretamente pelo navegador;</li>
          <li><strong>Cadastro fechado</strong> — ninguém cria conta sem ser você.</li>
        </ul>
      </Item>

      <Item icon="help" titulo="Perguntas frequentes">
        <p><strong>A IA respondeu errado / não respondeu.</strong> Verifique se a IA está ligada (no canal e na conversa) e melhore a <em>base de conhecimento</em> com mais informações.</p>
        <p><strong>Quero atender eu mesmo um cliente.</strong> Abra a conversa, desligue a IA daquela conversa e use o envio manual.</p>
        <p><strong>Um canal aparece “Desconectado”.</strong> Vá na tela do canal, confira as credenciais e clique em <em>Testar conexão</em>.</p>
        <p><strong>Os números do Dashboard estão zerados.</strong> É normal enquanto não houver conversas — eles se preenchem sozinhos conforme as mensagens chegam.</p>
      </Item>

      <Item icon="book" titulo="Glossário (palavras técnicas)">
        <ul>
          <li><strong>IA</strong> — Inteligência Artificial; o atendente virtual que responde automaticamente.</li>
          <li><strong>Canal</strong> — cada meio de atendimento (WhatsApp ou Instagram).</li>
          <li><strong>Lead</strong> — um contato/potencial cliente.</li>
          <li><strong>Pipeline / Funil</strong> — as etapas por onde um lead passa até fechar (ou não).</li>
          <li><strong>Persona</strong> — a personalidade e o papel do atendente virtual.</li>
          <li><strong>Handoff</strong> — quando o atendimento passa da IA para um humano.</li>
          <li><strong>Webhook</strong> — o “aviso” que o WhatsApp/Instagram mandam ao sistema quando chega uma mensagem.</li>
          <li><strong>Token</strong> — uma chave de acesso, como uma senha, usada para conectar aos canais.</li>
          <li><strong>QR Code</strong> — código de barras quadrado lido pela câmera para conectar o WhatsApp.</li>
        </ul>
      </Item>

      <div className="card" style={{ marginTop: 20, display: "flex", gap: 12, alignItems: "center", flexWrap: "wrap" }}>
        <span className="help-ico"><Icon name="dashboard" size={18} /></span>
        <div style={{ fontSize: 14, color: "var(--muted)", flex: 1, minWidth: 200 }}>
          Precisa de mais alguma coisa? Comece pelo <strong style={{ color: "var(--text)" }}>Painel</strong> e siga o checklist de configuração.
        </div>
        <Link href="/" className="btn secondary">Ir para o painel <Icon name="arrow" size={15} /></Link>
      </div>
    </div>
  );
}
