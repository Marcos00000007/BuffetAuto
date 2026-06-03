/* ============================================================
   BuffetAuto – app.js  (versão alinhada ao diagrama de classes)
   UC1  Clientes   UC2  Eventos    UC3  Orçamento  UC4  Contrato
   UC5  Porções    UC6  L.Compras  UC7  OS         UC8  Estoque
   UC9  Fornecedor UC10 Agenda     UC11 Rel.Op.    UC12 Rel.Fin.
   ============================================================ */

// ════════════════════════════════════════════════════════════
// ESTADO GLOBAL — estrutura espelha o diagrama de classes
// ════════════════════════════════════════════════════════════
const STATE = {

  /* UC1 – Classe Cliente
     id, nome, cpf, email, telefone, endereco,
     tipoPreferido, dataCadastro, ativo, historico          */
  clientes: [
    { id:1, nome:'Ana Silva',       cpf:'012.345.678-90', email:'ana@email.com',        telefone:'(61) 99821-3344', endereco:'SQN 210, Bl.A', tipoPreferido:'Casamento',   dataCadastro:'2025-01-10', ativo:true,  historico:3 },
    { id:2, nome:'Dr. Paulo Ramos', cpf:'987.654.321-00', email:'paulo@ramos.com',      telefone:'(61) 98765-2211', endereco:'Asa Sul, 508',  tipoPreferido:'Aniversário', dataCadastro:'2025-03-22', ativo:true,  historico:1 },
    { id:3, nome:'Tech Corp Ltda',  cpf:'12.345.678/0001-90', email:'contato@techcorp.com', telefone:'(61) 3344-5500',  endereco:'SCS Qd. 4',   tipoPreferido:'Corporativo', dataCadastro:'2024-11-05', ativo:true,  historico:5 },
    { id:4, nome:'Família Costa',   cpf:'111.222.333-44', email:'costa@email.com',      telefone:'(61) 99234-7788', endereco:'Lago Norte',    tipoPreferido:'Casamento',   dataCadastro:'2025-02-14', ativo:false, historico:2 },
  ],

  /* UC2 – Classe Evento
     id, nome, tipo, data, local, nConvidados,
     status, cardapio, valorUnit, responsavel                */
  eventos: [
    { id:1, nome:'Casamento Silva & Costa',      tipo:'Casamento',   data:'2026-06-14', local:'Espaço Villa Bella',   nConvidados:180, status:'confirmado', cardapio:'premium', valorUnit:380, responsavel:'Carla Mendes' },
    { id:2, nome:'Formatura Medicina UFDF',       tipo:'Formatura',   data:'2026-06-22', local:'Hotel Nobile',          nConvidados:320, status:'aguardando', cardapio:'standard',valorUnit:260, responsavel:'Pedro Alves' },
    { id:3, nome:'Aniversário 50 anos Dr. Paulo', tipo:'Aniversário', data:'2026-07-05', local:'Chácara das Flores',    nConvidados:90,  status:'confirmado', cardapio:'standard',valorUnit:260, responsavel:'Carla Mendes' },
    { id:4, nome:'Confraternização Tech Corp',    tipo:'Corporativo', data:'2026-07-18', local:'Centro de Convenções',  nConvidados:200, status:'proposta',   cardapio:'basico',  valorUnit:180, responsavel:'João Souza' },
    { id:5, nome:'Bodas de Ouro Família Ramos',   tipo:'Casamento',   data:'2026-08-02', local:'Quinta dos Sonhos',     nConvidados:120, status:'cancelado',  cardapio:'gourmet', valorUnit:520, responsavel:'Pedro Alves' },
  ],

  /* UC8 – Classe ItemEstoque
     id, ingrediente, unidade, quantidade, estoqueMinimo, fornecedor */
  estoque: [
    { id:1, ingrediente:'Filé Mignon',    unidade:'kg', quantidade:45,  estoqueMinimo:20, fornecedor:'Frigorífico Sul'  },
    { id:2, ingrediente:'Camarão GG',     unidade:'kg', quantidade:12,  estoqueMinimo:15, fornecedor:'Pesqueiro Mar'    },
    { id:3, ingrediente:'Champagne Brut', unidade:'un', quantidade:80,  estoqueMinimo:50, fornecedor:'Vinhos & Bebidas' },
    { id:4, ingrediente:'Salmão',         unidade:'kg', quantidade:8,   estoqueMinimo:20, fornecedor:'Pesqueiro Mar'    },
    { id:5, ingrediente:'Creme de Leite', unidade:'cx', quantidade:120, estoqueMinimo:60, fornecedor:'Laticínios Belo'  },
  ],

  /* UC9 – Classe Fornecedor
     id, nome, cnpj, categoria, telefone, email,
     endereco, prazoEntrega, avaliacao, ativo              */
  fornecedores: [
    { id:1, nome:'Frigorífico Sul',   cnpj:'11.222.333/0001-44', categoria:'Carnes',        telefone:'(61) 3211-4400', email:'vendas@frigosul.com.br',  endereco:'SCIA Qd. 12', prazoEntrega:'3 dias', avaliacao:5, ativo:true },
    { id:2, nome:'Pesqueiro Mar',     cnpj:'22.333.444/0001-55', categoria:'Frutos do Mar', telefone:'(61) 3344-6600', email:'pedidos@pesqueiroar.com',  endereco:'Feira da Torre',prazoEntrega:'1 dia',  avaliacao:4, ativo:true },
    { id:3, nome:'Vinhos & Bebidas',  cnpj:'33.444.555/0001-66', categoria:'Bebidas',       telefone:'(61) 3500-1122', email:'comercial@vinhosbeb.com',  endereco:'SCS Qd. 3',   prazoEntrega:'5 dias', avaliacao:5, ativo:true },
    { id:4, nome:'Laticínios Belo',   cnpj:'44.555.666/0001-77', categoria:'Laticínios',    telefone:'(61) 3211-8800', email:'contato@belolatic.com.br', endereco:'SAAN Lote 5',  prazoEntrega:'2 dias', avaliacao:4, ativo:true },
  ],

  pedidos: [],
  filterEventoStatus: '',
  filterFornCat: '',
  calendarDate: new Date(2026, 5, 1),
};

// ════════════════════════════════════════════════════════════
// HELPERS
// ════════════════════════════════════════════════════════════
function valorEvento(e) { return e.nConvidados * e.valorUnit; }

function estoqueStatus(item) {
  if (item.quantidade <= 0) return 'crítico';
  if (item.quantidade < item.estoqueMinimo * 0.6) return 'crítico';
  if (item.quantidade < item.estoqueMinimo) return 'baixo';
  return 'ok';
}

function fmtBRL(n) {
  return 'R$\u00A0' + Number(n).toLocaleString('pt-BR', { minimumFractionDigits:0, maximumFractionDigits:0 });
}

function formatDate(iso) {
  if (!iso) return '—';
  const [y,m,d] = iso.split('-');
  const meses = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  return `${d}/${meses[+m-1]}/${y}`;
}

function nextId(arr) { return arr.length ? Math.max(...arr.map(x=>x.id))+1 : 1; }

function statusBadge(status) {
  const map = {
    confirmado:'<span class="badge badge-success">Confirmado</span>',
    aguardando: '<span class="badge badge-warning">Aguardando</span>',
    proposta:   '<span class="badge badge-info">Proposta</span>',
    cancelado:  '<span class="badge badge-danger">Cancelado</span>',
    ok:         '<span class="badge badge-success">OK</span>',
    baixo:      '<span class="badge badge-warning">Baixo</span>',
    crítico:    '<span class="badge badge-danger">Crítico</span>',
  };
  return map[status] || `<span class="badge badge-muted">${status}</span>`;
}

function ativoBadge(ativo) {
  return ativo
    ? '<span class="badge badge-success">Ativo</span>'
    : '<span class="badge badge-muted">Inativo</span>';
}

function estrelas(n) { return '★'.repeat(n)+'☆'.repeat(5-n); }

function formatCNPJ(raw) {
  const d = raw.replace(/\D/g,'').slice(0,14);
  return d.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,'$1.$2.$3/$4-$5');
}

function formatCPF(raw) {
  const d = raw.replace(/\D/g,'').slice(0,14);
  if (d.length > 11)
    return d.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/,'$1.$2.$3/$4-$5');
  return d.replace(/^(\d{3})(\d{3})(\d{3})(\d{2})$/,'$1.$2.$3-$4');
}

// ════════════════════════════════════════════════════════════
// TOAST
// ════════════════════════════════════════════════════════════
function showToast(msg, type='success') {
  document.querySelectorAll('.toast').forEach(t=>t.remove());
  const t = document.createElement('div');
  t.className = 'toast';
  t.style.cssText=`position:fixed;bottom:24px;right:24px;z-index:9999;
    background:${type==='success'?'var(--green-900)':'#C0392B'};
    color:#fff;padding:12px 20px;border-radius:10px;
    font-size:.87rem;box-shadow:var(--shadow-lg);
    display:flex;align-items:center;gap:10px;
    animation:fadeUp .3s ease;max-width:340px;`;
  t.innerHTML=`<span>${type==='success'?'✅':'❌'}</span><span>${msg}</span>`;
  document.body.appendChild(t);
  setTimeout(()=>t.remove(),3500);
}

// ════════════════════════════════════════════════════════════
// MODAL
// ════════════════════════════════════════════════════════════
function openModal(title, bodyHTML, footerHTML='') {
  document.getElementById('modal-title').textContent = title;
  document.getElementById('modal-body').innerHTML   = bodyHTML;
  const footer = document.getElementById('modal-footer');
  footer.innerHTML = footerHTML;
  footer.style.display = footerHTML ? 'flex' : 'none';
  const modal = document.getElementById('app-modal');
  modal.style.display = 'flex';
  // Scroll to top do body do modal
  document.getElementById('modal-body').scrollTop = 0;
}
function closeModal() {
  document.getElementById('app-modal').style.display = 'none';
}

// ════════════════════════════════════════════════════════════
// NAVEGAÇÃO
// ════════════════════════════════════════════════════════════
function navigate(pageId) {
  document.querySelectorAll('.nav-item').forEach(el=>
    el.classList.toggle('active', el.dataset.page===pageId));
  document.querySelectorAll('.page').forEach(p=>p.style.display='none');
  const target = document.getElementById('page-'+pageId);
  if (target) {
    target.style.display='block';
    target.querySelectorAll('.fade-up,.fade-up-2,.fade-up-3,.fade-up-4').forEach(el=>{
      el.style.animation='none'; el.offsetHeight; el.style.animation='';
    });
  }
  closeSidebar();
  const titles={dashboard:'Dashboard',eventos:'Gestão de Eventos',clientes:'Clientes',
    orcamento:'Novo Orçamento',estoque:'Controle de Estoque',fornecedores:'Fornecedores',
    agenda:'Agenda de Eventos',relatorios:'Relatórios'};
  const el=document.querySelector('.topbar-title');
  if(el) el.textContent=titles[pageId]||'BuffetAuto';

  if(pageId==='dashboard')   renderDashboard();
  if(pageId==='agenda')      renderCalendar();
  if(pageId==='relatorios')  renderRelatorios();
  if(pageId==='estoque')     atualizarBannerEstoque();
  if(pageId==='fornecedores')renderFornecedores();
}

function toggleSidebar() {
  document.querySelector('.sidebar').classList.toggle('open');
  document.querySelector('.sidebar-overlay').classList.toggle('open');
}
function closeSidebar() {
  document.querySelector('.sidebar')?.classList.remove('open');
  document.querySelector('.sidebar-overlay')?.classList.remove('open');
}

// ════════════════════════════════════════════════════════════
// DASHBOARD (dinâmico — calcula dos dados reais)
// ════════════════════════════════════════════════════════════
function renderDashboard() {
  const hoje = new Date();
  const mesesPt=['janeiro','fevereiro','março','abril','maio','junho','julho','agosto','setembro','outubro','novembro','dezembro'];
  const elData = document.getElementById('dash-data-hoje');
  if(elData) elData.innerHTML=`Hoje é <strong>${hoje.getDate()} de ${mesesPt[hoje.getMonth()]} de ${hoje.getFullYear()}</strong>. Resumo da operação:`;

  const ativos = STATE.eventos.filter(e=>e.status!=='cancelado');
  const fat    = ativos.reduce((s,e)=>s+valorEvento(e),0);
  const alertas= STATE.estoque.filter(i=>estoqueStatus(i)!=='ok');

  const set=(id,v)=>{const el=document.getElementById(id);if(el)el.textContent=v;};
  set('dash-eventos-mes', ativos.length);
  set('dash-faturamento', fmtBRL(fat));
  set('dash-clientes',    STATE.clientes.filter(c=>c.ativo).length);
  set('dash-alertas',     alertas.length);

  const alertNomes = document.getElementById('dash-alertas-nomes');
  if(alertNomes) alertNomes.textContent = alertas.length
    ? alertas.map(i=>i.ingrediente).join(', ')
    : 'estoque dentro do normal';

  // Próximos eventos
  const cont = document.getElementById('dash-proximos-eventos');
  if(cont) {
    const proximos = [...ativos].sort((a,b)=>a.data.localeCompare(b.data)).slice(0,3);
    if(!proximos.length){ cont.innerHTML='<p class="text-muted text-sm">Nenhum evento ativo.</p>'; }
    else cont.innerHTML = proximos.map(e=>{
      const [,m,d]=e.data.split('-');
      const mesesCurtos=['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
      return `<div class="event-card">
        <div class="event-date-box">
          <div class="event-date-day">${d}</div>
          <div class="event-date-month">${mesesCurtos[+m-1]}</div>
        </div>
        <div class="event-info">
          <div class="event-name">${e.nome}</div>
          <div class="event-meta">
            <span>📍 ${e.local}</span><span>👥 ${e.nConvidados} conv.</span>
          </div>
          <div style="margin-top:6px">${statusBadge(e.status)}</div>
        </div>
        <div class="event-actions">
          <button class="btn btn-outline btn-sm" onclick="abrirOS(${e.id})">📋 OS</button>
        </div>
      </div>`;
    }).join('');
  }

  // Alertas
  const listaAlertas = document.getElementById('dash-alertas-lista');
  if(listaAlertas){
    let html='';
    alertas.forEach(i=>{
      html+=`<div class="alert alert-warning"><span>${estoqueStatus(i)==='crítico'?'🚨':'📦'}</span>
        <div><strong>Estoque ${estoqueStatus(i)}:</strong> ${i.ingrediente} — ${i.quantidade} ${i.unidade} (mín. ${i.estoqueMinimo})</div></div>`;
    });
    STATE.eventos.filter(e=>e.status==='aguardando').forEach(e=>{
      html+=`<div class="alert alert-info"><span>📄</span><div><strong>Contrato pendente:</strong> ${e.nome}</div></div>`;
    });
    if(!html) html='<div class="alert alert-success"><span>✅</span><div>Nenhum alerta pendente.</div></div>';
    listaAlertas.innerHTML=html;
  }
}

// ════════════════════════════════════════════════════════════
// UC2 – EVENTOS
// ════════════════════════════════════════════════════════════
function renderEventos(filter='') {
  const tbody=document.querySelector('#eventos-tbody');
  if(!tbody) return;
  const st=STATE.filterEventoStatus;
  const filtered=STATE.eventos.filter(e=>
    (e.nome.toLowerCase().includes(filter.toLowerCase())||
     e.tipo.toLowerCase().includes(filter.toLowerCase()))&&
    (!st||e.status===st));
  if(!filtered.length){
    tbody.innerHTML='<tr><td colspan="8" style="text-align:center;padding:28px;color:var(--text-muted)">Nenhum evento encontrado.</td></tr>';
    return;
  }
  tbody.innerHTML=filtered.map(e=>`
    <tr>
      <td><strong>${e.nome}</strong><br><span class="text-sm text-muted">${e.tipo} · ${e.cardapio}</span></td>
      <td>${formatDate(e.data)}</td>
      <td>${e.local}</td>
      <td>${e.nConvidados}</td>
      <td>${fmtBRL(valorEvento(e))}</td>
      <td>${statusBadge(e.status)}</td>
      <td>${e.responsavel}</td>
      <td>
        <div class="flex gap-2">
          <button class="btn btn-ghost btn-sm btn-icon" title="Editar" onclick="editarEvento(${e.id})">✏️</button>
          <button class="btn btn-ghost btn-sm btn-icon" title="Gerar OS (UC7)" onclick="abrirOS(${e.id})">📋</button>
          <button class="btn btn-ghost btn-sm btn-icon" title="Gerar Contrato (UC4)" onclick="abrirContrato(${e.id})">📄</button>
          <button class="btn btn-ghost btn-sm btn-icon" title="Cancelar evento (UC3.4)" onclick="cancelarEvento(${e.id})">🚫</button>
          <button class="btn btn-ghost btn-sm btn-icon" title="Excluir" onclick="excluirEvento(${e.id})">🗑️</button>
        </div>
      </td>
    </tr>`).join('');
}

function novoEvento() {
  openModal('UC2.1 – Cadastrar Evento', `
    <div class="form-grid form-grid-2" style="gap:14px">
      <div class="form-group" style="grid-column:1/-1">
        <label class="form-label">Nome do evento <span>*</span></label>
        <input id="ev-nome" class="form-control" placeholder="Ex: Casamento João & Maria">
      </div>
      <div class="form-group">
        <label class="form-label">Tipo <span>*</span></label>
        <select id="ev-tipo" class="form-control">
          <option value="">Selecione</option>
          <option>Casamento</option><option>Formatura</option>
          <option>Aniversário</option><option>Corporativo</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Data <span>*</span></label>
        <input id="ev-data" type="date" class="form-control">
      </div>
      <div class="form-group">
        <label class="form-label">Nº de convidados <span>*</span></label>
        <input id="ev-convidados" type="number" class="form-control" min="1" placeholder="Ex: 150">
      </div>
      <div class="form-group">
        <label class="form-label">Cardápio / Valor por pessoa <span>*</span></label>
        <select id="ev-valorUnit" class="form-control">
          <option value="180" data-cardapio="basico">Básico — R$ 180/pessoa</option>
          <option value="260" data-cardapio="standard">Standard — R$ 260/pessoa</option>
          <option value="380" data-cardapio="premium">Premium — R$ 380/pessoa</option>
          <option value="520" data-cardapio="gourmet">Gourmet — R$ 520/pessoa</option>
        </select>
      </div>
      <div class="form-group" style="grid-column:1/-1">
        <label class="form-label">Local <span>*</span></label>
        <input id="ev-local" class="form-control" placeholder="Ex: Espaço Villa Bella">
      </div>
      <div class="form-group">
        <label class="form-label">Responsável</label>
        <input id="ev-responsavel" class="form-control" value="Carla Mendes">
      </div>
      <div class="form-group">
        <label class="form-label">Status inicial</label>
        <select id="ev-status-edit" class="form-control">
          <option value="proposta">Proposta</option>
          <option value="aguardando">Aguardando</option>
          <option value="confirmado">Confirmado</option>
        </select>
      </div>
    </div>`,
    `<button class="btn btn-outline" onclick="closeModal()">Cancelar</button>
     <button class="btn btn-primary" onclick="salvarEvento()">💾 Salvar Evento</button>`
  );
}

function salvarEvento(id=null) {
  const nome        = document.getElementById('ev-nome')?.value.trim();
  const tipo        = document.getElementById('ev-tipo')?.value;
  const data        = document.getElementById('ev-data')?.value;
  const nConvidados = parseInt(document.getElementById('ev-convidados')?.value);
  const local       = document.getElementById('ev-local')?.value.trim();
  const sel         = document.getElementById('ev-valorUnit');
  const valorUnit   = parseInt(sel?.value)||260;
  const cardapio    = sel?.options[sel.selectedIndex]?.dataset.cardapio||'standard';
  const responsavel = document.getElementById('ev-responsavel')?.value.trim()||'Carla Mendes';
  const status      = document.getElementById('ev-status-edit')?.value||'proposta';

  if(!nome||!tipo||!data||!nConvidados||!local){
    showToast('Preencha todos os campos obrigatórios.','error'); return;
  }
  STATE.eventos.push({ id:nextId(STATE.eventos), nome, tipo, data, local, nConvidados, status, cardapio, valorUnit, responsavel });
  showToast(`Evento "${nome}" criado!`);
  closeModal();
  renderEventos(document.getElementById('search-eventos')?.value||'');
  renderDashboard();
}

function editarEvento(id) {
  const e=STATE.eventos.find(x=>x.id===id); if(!e) return;
  openModal(`UC2.2 – Alterar Evento`,`
    <div class="form-grid form-grid-2" style="gap:14px">
      <div class="form-group" style="grid-column:1/-1">
        <label class="form-label">Nome do evento <span>*</span></label>
        <input id="ev-nome" class="form-control" value="${e.nome}">
      </div>
      <div class="form-group">
        <label class="form-label">Tipo</label>
        <select id="ev-tipo" class="form-control">
          ${['Casamento','Formatura','Aniversário','Corporativo'].map(t=>`<option${t===e.tipo?' selected':''}>${t}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Data</label>
        <input id="ev-data" type="date" class="form-control" value="${e.data}">
      </div>
      <div class="form-group">
        <label class="form-label">Nº de convidados</label>
        <input id="ev-convidados" type="number" class="form-control" value="${e.nConvidados}" min="1">
      </div>
      <div class="form-group">
        <label class="form-label">Cardápio / Valor por pessoa</label>
        <select id="ev-valorUnit" class="form-control">
          ${[{v:180,c:'basico',l:'Básico'},{v:260,c:'standard',l:'Standard'},{v:380,c:'premium',l:'Premium'},{v:520,c:'gourmet',l:'Gourmet'}].map(x=>
            `<option value="${x.v}" data-cardapio="${x.c}"${x.v===e.valorUnit?' selected':''}>${x.l} — R$ ${x.v}/pessoa</option>`).join('')}
        </select>
      </div>
      <div class="form-group" style="grid-column:1/-1">
        <label class="form-label">Local</label>
        <input id="ev-local" class="form-control" value="${e.local}">
      </div>
      <div class="form-group">
        <label class="form-label">Status</label>
        <select id="ev-status-edit" class="form-control">
          ${['confirmado','aguardando','proposta','cancelado'].map(s=>`<option value="${s}"${s===e.status?' selected':''}>${s.charAt(0).toUpperCase()+s.slice(1)}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Responsável</label>
        <input id="ev-responsavel" class="form-control" value="${e.responsavel}">
      </div>
    </div>`,
    `<button class="btn btn-outline" onclick="closeModal()">Cancelar</button>
     <button class="btn btn-primary" onclick="confirmarEditEvento(${id})">💾 Salvar</button>`
  );
}

function confirmarEditEvento(id) {
  const e=STATE.eventos.find(x=>x.id===id); if(!e) return;
  const sel=document.getElementById('ev-valorUnit');
  e.nome        = document.getElementById('ev-nome')?.value.trim()||e.nome;
  e.tipo        = document.getElementById('ev-tipo')?.value||e.tipo;
  e.data        = document.getElementById('ev-data')?.value||e.data;
  e.nConvidados = parseInt(document.getElementById('ev-convidados')?.value)||e.nConvidados;
  e.local       = document.getElementById('ev-local')?.value.trim()||e.local;
  e.valorUnit   = parseInt(sel?.value)||e.valorUnit;
  e.cardapio    = sel?.options[sel.selectedIndex]?.dataset.cardapio||e.cardapio;
  e.status      = document.getElementById('ev-status-edit')?.value||e.status;
  e.responsavel = document.getElementById('ev-responsavel')?.value.trim()||e.responsavel;
  closeModal();
  renderEventos(document.getElementById('search-eventos')?.value||'');
  renderDashboard();
  showToast(`Evento "${e.nome}" atualizado!`);
}

function cancelarEvento(id) {
  const e=STATE.eventos.find(x=>x.id===id); if(!e) return;
  openModal('UC3.4 – Cancelar Evento',`
    <p>Cancelar o evento <strong>${e.nome}</strong>?</p>
    <p class="text-muted text-sm" style="margin-top:8px">O evento ficará com status "Cancelado" e não contará no faturamento.</p>`,
    `<button class="btn btn-outline" onclick="closeModal()">Voltar</button>
     <button class="btn btn-danger" onclick="confirmarCancelar(${id})">🚫 Confirmar Cancelamento</button>`
  );
}
function confirmarCancelar(id) {
  const e=STATE.eventos.find(x=>x.id===id); if(!e) return;
  e.status='cancelado'; closeModal();
  renderEventos(document.getElementById('search-eventos')?.value||'');
  renderDashboard();
  showToast(`Evento "${e.nome}" cancelado.`);
}

function excluirEvento(id) {
  const e=STATE.eventos.find(x=>x.id===id); if(!e) return;
  openModal('Excluir Evento',`<p>Excluir permanentemente <strong>${e.nome}</strong>? Esta ação não pode ser desfeita.</p>`,
    `<button class="btn btn-outline" onclick="closeModal()">Cancelar</button>
     <button class="btn btn-danger" onclick="STATE.eventos=STATE.eventos.filter(x=>x.id!==${id});closeModal();renderEventos();renderDashboard();showToast('Evento excluído.')">🗑️ Excluir</button>`
  );
}

// ─── UC7 – Ordem de Serviço ───────────────────────────────────
function abrirOS(id) {
  const e=STATE.eventos.find(x=>x.id===id); if(!e) return;
  const total=valorEvento(e);
  openModal(`UC7 – Ordem de Serviço`,`
    <div style="background:var(--bg);border-radius:10px;padding:16px;margin-bottom:14px;font-size:.87rem">
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:10px">
        <div><span class="text-muted">Evento:</span><br><strong>${e.nome}</strong></div>
        <div><span class="text-muted">Tipo:</span><br><strong>${e.tipo}</strong></div>
        <div><span class="text-muted">Data:</span><br><strong>${formatDate(e.data)}</strong></div>
        <div><span class="text-muted">Local:</span><br><strong>${e.local}</strong></div>
        <div><span class="text-muted">Convidados:</span><br><strong>${e.nConvidados} pessoas</strong></div>
        <div><span class="text-muted">Responsável:</span><br><strong>${e.responsavel}</strong></div>
      </div>
    </div>
    <h4 style="font-family:'Cormorant Garamond',serif;margin-bottom:10px">🍽️ UC5 – Ficha Técnica de Produção</h4>
    <table style="width:100%;font-size:.85rem;border-collapse:collapse">
      <thead><tr style="background:var(--bg)">
        <th style="padding:8px;text-align:left;border-bottom:1px solid var(--border)">Item</th>
        <th style="padding:8px;text-align:right;border-bottom:1px solid var(--border)">Qtd.</th>
        <th style="padding:8px;border-bottom:1px solid var(--border)">Unid.</th>
      </tr></thead>
      <tbody>
        <tr><td style="padding:8px">Proteína principal</td><td style="padding:8px;text-align:right">${(e.nConvidados*.35).toFixed(1)}</td><td style="padding:8px">kg</td></tr>
        <tr style="background:var(--bg)"><td style="padding:8px">Acompanhamentos</td><td style="padding:8px;text-align:right">${(e.nConvidados*.25).toFixed(1)}</td><td style="padding:8px">kg</td></tr>
        <tr><td style="padding:8px">Bebidas</td><td style="padding:8px;text-align:right">${(e.nConvidados*1.5).toFixed(0)}</td><td style="padding:8px">litros</td></tr>
        <tr style="background:var(--bg)"><td style="padding:8px">Sobremesas</td><td style="padding:8px;text-align:right">${Math.ceil(e.nConvidados/10)}</td><td style="padding:8px">porções</td></tr>
        <tr><td style="padding:8px">Equipe necessária</td><td style="padding:8px;text-align:right">${Math.ceil(e.nConvidados/25)}</td><td style="padding:8px">colaboradores</td></tr>
      </tbody>
    </table>
    <div style="margin-top:14px;padding:12px 16px;background:var(--gold-100);border-radius:8px;display:flex;justify-content:space-between;align-items:center">
      <span style="font-weight:600">Valor total</span>
      <strong style="font-family:'Cormorant Garamond',serif;font-size:1.4rem;color:var(--green-700)">${fmtBRL(total)}</strong>
    </div>`,
    `<button class="btn btn-outline" onclick="closeModal()">Fechar</button>
     <button class="btn btn-primary" onclick="window.print();showToast('Enviando para impressão…')">🖨️ Imprimir OS</button>`
  );
}

// ─── UC4 – Contrato ───────────────────────────────────────────
function abrirContrato(id) {
  const e=STATE.eventos.find(x=>x.id===id); if(!e) return;
  const total=fmtBRL(valorEvento(e));
  const entrada=fmtBRL(valorEvento(e)*.3);
  const hoje=new Date().toLocaleDateString('pt-BR');
  openModal(`UC4 – Contrato de Prestação de Serviços`,`
    <div style="font-size:.84rem;line-height:1.7;max-height:420px;overflow-y:auto">
      <div style="text-align:center;margin-bottom:14px">
        <div style="font-family:'Cormorant Garamond',serif;font-size:1.4rem;font-weight:700">CONTRATO DE PRESTAÇÃO DE SERVIÇOS</div>
        <div class="text-muted text-sm">BuffetAuto · Gerado em ${hoje}</div>
      </div>
      <p><strong>CONTRATANTE:</strong> ${e.nome} &nbsp;|&nbsp; <strong>CONTRATADO:</strong> Buffet Auto Ltda.</p>
      <hr class="divider">
      <p><strong>Cláusula 1 – Objeto:</strong> Prestação de serviços de buffet completo para o evento <em>${e.nome}</em>, tipo <em>${e.tipo}</em>, em <strong>${formatDate(e.data)}</strong>, local <strong>${e.local}</strong>, para <strong>${e.nConvidados} convidados</strong>.</p>
      <p><strong>Cláusula 2 – Valor:</strong> Total de <strong>${total}</strong>. Entrada 30%: <strong>${entrada}</strong> no ato. Saldo 70% até 5 dias úteis antes do evento.</p>
      <p><strong>Cláusula 3 – Obrigações:</strong> Equipe qualificada, alimentos de qualidade, montagem/desmontagem e cardápio acordado (${e.cardapio}).</p>
      <p><strong>Cláusula 4 – Cancelamento:</strong> +30 dias: devolução de 80% da entrada. Menos de 30 dias: entrada não reembolsável.</p>
      <p><strong>Cláusula 5 – Foro:</strong> Comarca de Brasília/DF.</p>
      <div style="margin-top:20px;display:grid;grid-template-columns:1fr 1fr;gap:20px;text-align:center">
        <div><div style="border-top:1px solid var(--border);padding-top:6px;margin-top:36px">Contratante<br><span class="text-sm text-muted">${e.nome}</span></div></div>
        <div><div style="border-top:1px solid var(--border);padding-top:6px;margin-top:36px">Contratado<br><span class="text-sm text-muted">Buffet Auto Ltda.</span></div></div>
      </div>
    </div>`,
    `<button class="btn btn-outline" onclick="closeModal()">Fechar</button>
     <button class="btn btn-gold" onclick="assinarContrato(${id})">✍️ UC4.2 · Enviar para Assinatura Digital</button>
     <button class="btn btn-primary" onclick="window.print();showToast('PDF gerado!')">⬇️ Baixar PDF</button>`
  );
}
function assinarContrato(id) {
  const e=STATE.eventos.find(x=>x.id===id); if(!e) return;
  if(e.status==='proposta') e.status='aguardando';
  closeModal(); renderEventos(); renderDashboard();
  showToast('Contrato enviado via FlowSign para assinatura digital!');
}

// ─── Exportar CSV ──────────────────────────────────────────────
function exportarCSV(tipo) {
  let rows, filename;
  if(tipo==='eventos'){
    rows=[['ID','Nome','Tipo','Data','Local','Convidados','Cardápio','Valor','Status','Responsável'],
      ...STATE.eventos.map(e=>[e.id,e.nome,e.tipo,e.data,e.local,e.nConvidados,e.cardapio,valorEvento(e),e.status,e.responsavel])];
    filename='buffetauto-eventos.csv';
  } else if(tipo==='clientes'){
    rows=[['ID','Nome','CPF/CNPJ','Email','Telefone','Tipo','Histórico','Ativo'],
      ...STATE.clientes.map(c=>[c.id,c.nome,c.cpf,c.email,c.telefone,c.tipoPreferido,c.historico,c.ativo?'Sim':'Não'])];
    filename='buffetauto-clientes.csv';
  } else if(tipo==='estoque'){
    rows=[['ID','Ingrediente','Unidade','Quantidade','Mín.','Status','Fornecedor'],
      ...STATE.estoque.map(i=>[i.id,i.ingrediente,i.unidade,i.quantidade,i.estoqueMinimo,estoqueStatus(i),i.fornecedor])];
    filename='buffetauto-estoque.csv';
  } else if(tipo==='fornecedores'){
    rows=[['ID','Nome','CNPJ','Categoria','Telefone','Email','Prazo','Avaliação','Ativo'],
      ...STATE.fornecedores.map(f=>[f.id,f.nome,f.cnpj,f.categoria,f.telefone,f.email,f.prazoEntrega,f.avaliacao,f.ativo?'Sim':'Não'])];
    filename='buffetauto-fornecedores.csv';
  } else return;

  const csv=rows.map(r=>r.map(v=>`"${String(v).replace(/"/g,'""')}"`).join(',')).join('\n');
  const blob=new Blob(['\uFEFF'+csv],{type:'text/csv;charset=utf-8;'});
  const a=document.createElement('a'); a.href=URL.createObjectURL(blob); a.download=filename; a.click();
  showToast(`"${filename}" exportado com sucesso!`);
}

// ════════════════════════════════════════════════════════════
// UC1 – CLIENTES
// ════════════════════════════════════════════════════════════
function renderClientes(filter='') {
  const tbody=document.querySelector('#clientes-tbody'); if(!tbody) return;
  const filtered=STATE.clientes.filter(c=>
    c.nome.toLowerCase().includes(filter.toLowerCase())||
    c.cpf.includes(filter)||
    (c.email||'').toLowerCase().includes(filter.toLowerCase()));
  if(!filtered.length){
    tbody.innerHTML='<tr><td colspan="8" style="text-align:center;padding:28px;color:var(--text-muted)">Nenhum cliente encontrado.</td></tr>'; return;
  }
  tbody.innerHTML=filtered.map(c=>`
    <tr>
      <td><div class="flex items-center gap-2">
        <div class="sidebar-avatar" style="width:32px;height:32px;font-size:.75rem">${c.nome.split(' ').map(n=>n[0]).slice(0,2).join('')}</div>
        <strong>${c.nome}</strong></div></td>
      <td class="text-sm">${c.cpf}</td>
      <td>${c.telefone}</td>
      <td class="text-sm">${c.email||'—'}</td>
      <td>${c.tipoPreferido}</td>
      <td>${c.historico} evento${c.historico!==1?'s':''}</td>
      <td>${ativoBadge(c.ativo)}</td>
      <td>
        <div class="flex gap-2">
          <button class="btn btn-outline btn-sm" onclick="fichaCliente(${c.id})">Ver ficha</button>
          <button class="btn btn-ghost btn-sm btn-icon" title="Novo orçamento" onclick="orcamentoParaCliente(${c.id})">💰</button>
          <button class="btn btn-ghost btn-sm btn-icon" title="Editar (UC1.2)" onclick="editarCliente(${c.id})">✏️</button>
          <button class="btn btn-ghost btn-sm btn-icon" title="Inativar (UC1.4)" onclick="toggleAtivoCliente(${c.id})">${c.ativo?'🚫':'✅'}</button>
        </div>
      </td>
    </tr>`).join('');
}

function novoCliente() {
  openModal('UC1.1 – Cadastrar Cliente',`
    <div class="form-grid form-grid-2" style="gap:14px">
      <div class="form-group" style="grid-column:1/-1">
        <label class="form-label">Nome completo ou razão social <span>*</span></label>
        <input id="cl-nome" class="form-control" placeholder="Ex: Ana Silva ou Tech Corp Ltda">
      </div>
      <div class="form-group">
        <label class="form-label">CPF / CNPJ <span>*</span></label>
        <input id="cl-cpf" class="form-control" placeholder="000.000.000-00 ou 00.000.000/0001-00" maxlength="18">
      </div>
      <div class="form-group">
        <label class="form-label">Telefone <span>*</span></label>
        <input id="cl-tel" class="form-control" placeholder="(61) 99999-9999">
      </div>
      <div class="form-group">
        <label class="form-label">E-mail</label>
        <input id="cl-email" type="email" class="form-control" placeholder="email@exemplo.com">
      </div>
      <div class="form-group">
        <label class="form-label">Tipo de evento preferido</label>
        <select id="cl-tipo" class="form-control">
          <option>Casamento</option><option>Formatura</option>
          <option>Aniversário</option><option>Corporativo</option>
        </select>
      </div>
      <div class="form-group" style="grid-column:1/-1">
        <label class="form-label">Endereço</label>
        <input id="cl-endereco" class="form-control" placeholder="Ex: SQN 210, Bloco A, Asa Norte">
      </div>
    </div>`,
    `<button class="btn btn-outline" onclick="closeModal()">Cancelar</button>
     <button class="btn btn-primary" onclick="salvarCliente()">💾 Salvar Cliente</button>`
  );
}

function salvarCliente() {
  const nome     = document.getElementById('cl-nome')?.value.trim();
  const cpf      = document.getElementById('cl-cpf')?.value.trim();
  const tel      = document.getElementById('cl-tel')?.value.trim();
  const email    = document.getElementById('cl-email')?.value.trim();
  const tipo     = document.getElementById('cl-tipo')?.value;
  const endereco = document.getElementById('cl-endereco')?.value.trim();
  if(!nome||!tel){ showToast('Nome e telefone são obrigatórios.','error'); return; }
  STATE.clientes.push({ id:nextId(STATE.clientes), nome, cpf:cpf||'—', email, telefone:tel,
    endereco, tipoPreferido:tipo, dataCadastro:new Date().toISOString().split('T')[0], ativo:true, historico:0 });
  closeModal(); renderClientes(document.getElementById('search-clientes')?.value||'');
  renderDashboard(); showToast(`Cliente "${nome}" cadastrado!`);
}

function editarCliente(id) {
  const c=STATE.clientes.find(x=>x.id===id); if(!c) return;
  openModal(`UC1.2 – Alterar Cliente`,`
    <div class="form-grid form-grid-2" style="gap:14px">
      <div class="form-group" style="grid-column:1/-1">
        <label class="form-label">Nome <span>*</span></label>
        <input id="cl-nome" class="form-control" value="${c.nome}">
      </div>
      <div class="form-group">
        <label class="form-label">CPF / CNPJ</label>
        <input id="cl-cpf" class="form-control" value="${c.cpf}" maxlength="18">
      </div>
      <div class="form-group">
        <label class="form-label">Telefone</label>
        <input id="cl-tel" class="form-control" value="${c.telefone}">
      </div>
      <div class="form-group">
        <label class="form-label">E-mail</label>
        <input id="cl-email" type="email" class="form-control" value="${c.email||''}">
      </div>
      <div class="form-group">
        <label class="form-label">Tipo preferido</label>
        <select id="cl-tipo" class="form-control">
          ${['Casamento','Formatura','Aniversário','Corporativo'].map(t=>`<option${t===c.tipoPreferido?' selected':''}>${t}</option>`).join('')}
        </select>
      </div>
      <div class="form-group" style="grid-column:1/-1">
        <label class="form-label">Endereço</label>
        <input id="cl-endereco" class="form-control" value="${c.endereco||''}">
      </div>
    </div>`,
    `<button class="btn btn-outline" onclick="closeModal()">Cancelar</button>
     <button class="btn btn-primary" onclick="confirmarEditCliente(${id})">💾 Salvar</button>`
  );
}
function confirmarEditCliente(id) {
  const c=STATE.clientes.find(x=>x.id===id); if(!c) return;
  c.nome          = document.getElementById('cl-nome')?.value.trim()||c.nome;
  c.cpf           = document.getElementById('cl-cpf')?.value.trim()||c.cpf;
  c.telefone      = document.getElementById('cl-tel')?.value.trim()||c.telefone;
  c.email         = document.getElementById('cl-email')?.value.trim();
  c.tipoPreferido = document.getElementById('cl-tipo')?.value||c.tipoPreferido;
  c.endereco      = document.getElementById('cl-endereco')?.value.trim();
  closeModal(); renderClientes(document.getElementById('search-clientes')?.value||'');
  showToast(`Cliente "${c.nome}" atualizado!`);
}

function toggleAtivoCliente(id) {
  const c=STATE.clientes.find(x=>x.id===id); if(!c) return;
  c.ativo=!c.ativo;
  renderClientes(document.getElementById('search-clientes')?.value||'');
  renderDashboard();
  showToast(`Cliente "${c.nome}" ${c.ativo?'reativado':'inativado'}.`);
}

function fichaCliente(id) {
  const c=STATE.clientes.find(x=>x.id===id); if(!c) return;
  openModal(`UC1.3 – Consultar Cliente`,`
    <div style="display:grid;grid-template-columns:1fr 1fr;gap:12px;background:var(--bg);border-radius:10px;padding:16px;margin-bottom:14px;font-size:.87rem">
      <div><span class="text-muted">Nome:</span><br><strong>${c.nome}</strong></div>
      <div><span class="text-muted">CPF/CNPJ:</span><br><strong>${c.cpf}</strong></div>
      <div><span class="text-muted">Telefone:</span><br><strong>${c.telefone}</strong></div>
      <div><span class="text-muted">E-mail:</span><br><strong>${c.email||'—'}</strong></div>
      <div><span class="text-muted">Endereço:</span><br><strong>${c.endereco||'—'}</strong></div>
      <div><span class="text-muted">Tipo preferido:</span><br><strong>${c.tipoPreferido}</strong></div>
      <div><span class="text-muted">Cadastrado em:</span><br><strong>${formatDate(c.dataCadastro)}</strong></div>
      <div><span class="text-muted">Status:</span><br>${ativoBadge(c.ativo)}</div>
      <div><span class="text-muted">Eventos registrados:</span><br><strong>${c.historico}</strong></div>
    </div>`,
    `<button class="btn btn-outline" onclick="closeModal()">Fechar</button>
     <button class="btn btn-primary" onclick="closeModal();orcamentoParaCliente(${id})">💰 Gerar Orçamento</button>`
  );
}

function orcamentoParaCliente(id) {
  const c=STATE.clientes.find(x=>x.id===id); if(!c) return;
  navigate('orcamento');
  setTimeout(()=>{
    const el=document.getElementById('orc-nome'); if(el) el.value=c.nome;
    const et=document.getElementById('orc-tipo'); if(et) et.value=c.tipoPreferido||'';
  },100);
  showToast(`Orçamento iniciado para ${c.nome}`);
}

// ════════════════════════════════════════════════════════════
// UC3 – ORÇAMENTO
// ════════════════════════════════════════════════════════════
function calcularOrcamento() {
  const nome       = document.getElementById('orc-nome')?.value.trim();
  const convidados = parseInt(document.getElementById('orc-convidados')?.value);
  const cardapio   = document.getElementById('orc-cardapio')?.value;
  const extra      = document.getElementById('orc-extra')?.checked;
  const tipo       = document.getElementById('orc-tipo')?.value||'';

  if(!nome||!convidados||!cardapio){
    showToast('Preencha todos os campos obrigatórios.','error'); return;
  }
  const precos={basico:180,standard:260,premium:380,gourmet:520};
  const base=precos[cardapio];
  const subtotal=convidados*base;
  const extras=extra?subtotal*.15:0;
  const total=subtotal+extras;
  const margem=total*.35;
  const custo=total*.65;

  const resultDiv=document.getElementById('orc-result'); if(!resultDiv) return;
  const infoDiv=document.getElementById('orc-info'); if(infoDiv) infoDiv.style.display='none';
  resultDiv.style.display='block';
  resultDiv.innerHTML=`
    <div class="alert alert-success" style="margin-bottom:14px">✅ Orçamento gerado para <strong>${nome}</strong></div>
    <div class="card">
      <div class="card-header"><span class="card-title">💰 UC3 – Resumo Financeiro</span></div>
      <div class="card-body">
        <div style="display:grid;gap:10px">
          <div class="flex justify-between"><span class="text-muted">Convidados:</span><strong>${convidados} pessoas</strong></div>
          <div class="flex justify-between"><span class="text-muted">Cardápio (${cardapio}):</span><strong>${fmtBRL(base)}/pessoa</strong></div>
          <div class="flex justify-between"><span class="text-muted">Subtotal:</span><strong>${fmtBRL(subtotal)}</strong></div>
          ${extra?`<div class="flex justify-between"><span class="text-muted">Estrutura +15%:</span><strong>${fmtBRL(extras)}</strong></div>`:''}
          <hr class="divider">
          <div class="flex justify-between"><span style="font-weight:600">Valor total</span>
            <strong style="font-family:'Cormorant Garamond',serif;font-size:1.5rem;color:var(--green-700)">${fmtBRL(total)}</strong></div>
          <div class="flex justify-between"><span class="text-muted">Custo estimado (65%):</span><strong style="color:var(--danger)">${fmtBRL(custo)}</strong></div>
          <div class="flex justify-between"><span class="text-muted">Margem estimada (35%):</span><strong style="color:var(--success)">${fmtBRL(margem)}</strong></div>
        </div>
        <div class="flex gap-3" style="margin-top:16px;flex-wrap:wrap">
          <button class="btn btn-primary" onclick="adicionarEventoDoOrcamento('${nome.replace(/'/g,"\\'")}','${tipo}',${convidados},${base},'${cardapio}')">🎉 Criar Evento</button>
          <button class="btn btn-outline" onclick="exportarOrcamentoPDF('${nome.replace(/'/g,"\\'")}',${total})">⬇️ Baixar PDF</button>
        </div>
      </div>
    </div>`;
  resultDiv.scrollIntoView({behavior:'smooth'});
}

function adicionarEventoDoOrcamento(nome,tipo,nConvidados,valorUnit,cardapio) {
  const data=new Date(Date.now()+30*86400000).toISOString().split('T')[0];
  STATE.eventos.push({id:nextId(STATE.eventos), nome:`Evento — ${nome}`, tipo:tipo||'Casamento',
    data, local:'A definir', nConvidados, status:'proposta', cardapio:cardapio||'standard',
    valorUnit, responsavel:'Carla Mendes'});
  showToast(`Evento criado a partir do orçamento de ${nome}!`);
  renderDashboard();
}

function exportarOrcamentoPDF(nome,total) {
  showToast(`PDF do orçamento de ${nome} (${fmtBRL(total)}) gerado!`);
}

// ════════════════════════════════════════════════════════════
// UC8 – ESTOQUE
// ════════════════════════════════════════════════════════════
function atualizarBannerEstoque() {
  const alertas=STATE.estoque.filter(i=>estoqueStatus(i)!=='ok');
  const banner=document.getElementById('estoque-alert-banner');
  const msg=document.getElementById('estoque-alert-msg');
  if(!banner) return;
  if(alertas.length){
    banner.style.display='flex';
    msg.textContent=`${alertas.length} ingrediente(s) abaixo do estoque mínimo: ${alertas.map(i=>i.ingrediente).join(', ')}`;
  } else {
    banner.style.display='none';
  }
}

function renderEstoque(filter='') {
  const tbody=document.querySelector('#estoque-tbody'); if(!tbody) return;
  const filtered=STATE.estoque.filter(i=>i.ingrediente.toLowerCase().includes(filter.toLowerCase()));
  tbody.innerHTML=filtered.map(i=>{
    const st=estoqueStatus(i);
    const pct=Math.min(100,Math.round((i.quantidade/(i.estoqueMinimo*2))*100));
    return `<tr>
      <td><strong>${i.ingrediente}</strong></td>
      <td><strong>${i.quantidade}</strong> ${i.unidade}</td>
      <td>${i.estoqueMinimo} ${i.unidade}</td>
      <td><div style="display:flex;align-items:center;gap:8px">
        <div class="progress-bar" style="width:80px"><div class="progress-fill ${st==='ok'?'':'gold'}" style="width:${pct}%"></div></div>
        <span class="text-sm text-muted">${pct}%</span>
      </div></td>
      <td>${i.fornecedor}</td>
      <td>${statusBadge(st)}</td>
      <td><div class="flex gap-2">
        <button class="btn btn-outline btn-sm" onclick="movEstoque(${i.id},'entrada')">+ Entrada</button>
        <button class="btn btn-ghost btn-sm" onclick="movEstoque(${i.id},'saida')">− Saída</button>
        <button class="btn btn-ghost btn-sm btn-icon" onclick="excluirIngrediente(${i.id})">🗑️</button>
      </div></td>
    </tr>`;
  }).join('');
}

function movEstoque(id,tipo) {
  const item=STATE.estoque.find(i=>i.id===id); if(!item) return;
  openModal(`${tipo==='entrada'?'UC8.1 · 📥 Registrar Entrada':'UC8.2 · 📤 Registrar Saída'} — ${item.ingrediente}`,`
    <div style="background:var(--bg);border-radius:8px;padding:14px;margin-bottom:14px;font-size:.87rem">
      <div class="flex justify-between"><span class="text-muted">Estoque atual:</span><strong>${item.quantidade} ${item.unidade}</strong></div>
      <div class="flex justify-between" style="margin-top:6px"><span class="text-muted">Estoque mínimo:</span><strong>${item.estoqueMinimo} ${item.unidade}</strong></div>
    </div>
    <div class="form-group">
      <label class="form-label">Quantidade (${item.unidade}) <span>*</span></label>
      <input id="mov-qtd" type="number" class="form-control" min="0.1" step="0.1" placeholder="Ex: 10">
    </div>
    <div class="form-group" style="margin-top:12px">
      <label class="form-label">Observação</label>
      <input id="mov-obs" class="form-control" placeholder="Ex: Pedido Pesqueiro Mar">
    </div>`,
    `<button class="btn btn-outline" onclick="closeModal()">Cancelar</button>
     <button class="btn ${tipo==='entrada'?'btn-primary':'btn-danger'}" onclick="confirmarMovEstoque(${id},'${tipo}')">
       ${tipo==='entrada'?'📥 Confirmar Entrada':'📤 Confirmar Saída'}</button>`
  );
}

function confirmarMovEstoque(id,tipo) {
  const item=STATE.estoque.find(i=>i.id===id);
  const qtd=parseFloat(document.getElementById('mov-qtd')?.value);
  if(!qtd||qtd<=0){ showToast('Informe uma quantidade válida.','error'); return; }
  if(tipo==='saida'&&qtd>item.quantidade){ showToast('Quantidade insuficiente em estoque.','error'); return; }
  item.quantidade=parseFloat((tipo==='entrada'?item.quantidade+qtd:item.quantidade-qtd).toFixed(2));
  closeModal();
  renderEstoque(document.getElementById('search-estoque')?.value||'');
  atualizarBannerEstoque();
  renderDashboard();
  showToast(`${tipo==='entrada'?'Entrada':'Saída'} de ${qtd} ${item.unidade} registrada para ${item.ingrediente}!`);
}

function novoIngrediente() {
  openModal('Novo Ingrediente no Estoque',`
    <div class="form-grid form-grid-2" style="gap:14px">
      <div class="form-group" style="grid-column:1/-1">
        <label class="form-label">Nome do ingrediente <span>*</span></label>
        <input id="ing-nome" class="form-control" placeholder="Ex: Filé de Frango">
      </div>
      <div class="form-group">
        <label class="form-label">Unidade <span>*</span></label>
        <select id="ing-unidade" class="form-control">
          <option value="kg">kg</option><option value="un">un</option>
          <option value="cx">cx</option><option value="lt">lt</option><option value="g">g</option>
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Quantidade inicial</label>
        <input id="ing-qtd" type="number" class="form-control" value="0" min="0" step="0.1">
      </div>
      <div class="form-group">
        <label class="form-label">Estoque mínimo <span>*</span></label>
        <input id="ing-min" type="number" class="form-control" value="10" min="1">
      </div>
      <div class="form-group" style="grid-column:1/-1">
        <label class="form-label">Fornecedor</label>
        <select id="ing-forn" class="form-control">
          ${STATE.fornecedores.map(f=>`<option>${f.nome}</option>`).join('')}
        </select>
      </div>
    </div>`,
    `<button class="btn btn-outline" onclick="closeModal()">Cancelar</button>
     <button class="btn btn-primary" onclick="salvarIngrediente()">💾 Salvar</button>`
  );
}
function salvarIngrediente() {
  const nome       = document.getElementById('ing-nome')?.value.trim();
  const unidade    = document.getElementById('ing-unidade')?.value;
  const quantidade = parseFloat(document.getElementById('ing-qtd')?.value)||0;
  const estoqueMinimo= parseFloat(document.getElementById('ing-min')?.value)||10;
  const fornecedor = document.getElementById('ing-forn')?.value||'—';
  if(!nome){ showToast('Nome é obrigatório.','error'); return; }
  STATE.estoque.push({id:nextId(STATE.estoque),ingrediente:nome,unidade,quantidade,estoqueMinimo,fornecedor});
  closeModal(); renderEstoque(); atualizarBannerEstoque(); renderDashboard();
  showToast(`"${nome}" adicionado ao estoque!`);
}
function excluirIngrediente(id) {
  const i=STATE.estoque.find(x=>x.id===id); if(!i) return;
  STATE.estoque=STATE.estoque.filter(x=>x.id!==id);
  renderEstoque(document.getElementById('search-estoque')?.value||'');
  atualizarBannerEstoque(); renderDashboard();
  showToast(`"${i.ingrediente}" removido do estoque.`);
}

// ─── UC6 – Gerar Lista de Compras ─────────────────────────────
function gerarListaCompras() {
  const criticos=STATE.estoque.filter(i=>estoqueStatus(i)!=='ok');
  if(!criticos.length){ showToast('Estoque dentro do nível desejado!'); return; }
  openModal('UC6 – Lista de Compras',`
    <div class="alert alert-warning" style="margin-bottom:14px">⚠️ <strong>${criticos.length} item(ns)</strong> precisam de reposição.</div>
    <table style="width:100%;font-size:.85rem;border-collapse:collapse">
      <thead><tr style="background:var(--bg)">
        <th style="padding:8px;text-align:left">Ingrediente</th>
        <th style="padding:8px;text-align:center">Atual</th>
        <th style="padding:8px;text-align:center;color:var(--danger)">Comprar</th>
        <th style="padding:8px;text-align:left">Fornecedor</th>
      </tr></thead>
      <tbody>${criticos.map(i=>{
        const falta=Math.ceil(i.estoqueMinimo*2-i.quantidade);
        return `<tr><td style="padding:8px"><strong>${i.ingrediente}</strong></td>
          <td style="padding:8px;text-align:center">${i.quantidade} ${i.unidade}</td>
          <td style="padding:8px;text-align:center;font-weight:600;color:var(--danger)">${falta} ${i.unidade}</td>
          <td style="padding:8px">${i.fornecedor}</td></tr>`;
      }).join('')}</tbody>
    </table>`,
    `<button class="btn btn-outline" onclick="closeModal()">Fechar</button>
     <button class="btn btn-primary" onclick="exportarCSV('estoque');closeModal()">⬇️ Exportar</button>`
  );
}

// ════════════════════════════════════════════════════════════
// UC9 – FORNECEDORES  (com CNPJ + formulário front completo)
// ════════════════════════════════════════════════════════════
function renderFornecedores() {
  const container=document.querySelector('#fornecedores-container'); if(!container) return;
  const filterText=(document.getElementById('search-fornecedores')?.value||'').toLowerCase();
  const filterCat=document.getElementById('filter-cat-forn')?.value||'';

  const filtered=STATE.fornecedores.filter(f=>
    (f.nome.toLowerCase().includes(filterText)||f.cnpj.includes(filterText))&&
    (!filterCat||f.categoria===filterCat));

  if(!filtered.length){
    container.innerHTML='<p class="text-muted" style="grid-column:1/-1">Nenhum fornecedor encontrado.</p>'; return;
  }
  container.innerHTML=filtered.map(f=>`
    <div class="card" style="padding:20px">
      <div class="flex justify-between items-center" style="margin-bottom:12px">
        <div>
          <div style="font-weight:600;font-size:1rem">${f.nome}</div>
          <div class="text-sm text-muted">CNPJ: ${f.cnpj}</div>
        </div>
        <div class="flex gap-2" style="align-items:center">
          <span class="badge badge-info">${f.categoria}</span>
          ${ativoBadge(f.ativo)}
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:6px;font-size:.82rem;color:var(--text-muted);margin-bottom:12px">
        <span>📞 ${f.telefone}</span>
        <span>📧 ${f.email||'—'}</span>
        <span>🚚 Prazo: ${f.prazoEntrega}</span>
        <span>📍 ${f.endereco||'—'}</span>
      </div>
      <div class="flex justify-between items-center">
        <span style="color:var(--gold-500);font-size:.95rem" title="${f.avaliacao}/5 estrelas">${estrelas(f.avaliacao)}</span>
        <div class="flex gap-2">
          <button class="btn btn-outline btn-sm" onclick="novoPedido(${f.id})">📦 Novo Pedido</button>
          <button class="btn btn-ghost btn-sm btn-icon" title="Editar (UC9.2)" onclick="editarFornecedor(${f.id})">✏️</button>
          <button class="btn btn-ghost btn-sm btn-icon" title="${f.ativo?'Inativar':'Reativar'}" onclick="toggleAtivoFornecedor(${f.id})">${f.ativo?'🚫':'✅'}</button>
        </div>
      </div>
    </div>`).join('');
}

// ─── Formulário de cadastro de fornecedor (UC9.1) ─────────────
function novoFornecedor() {
  openModal('UC9.1 – Cadastrar Fornecedor',`
    <div class="form-grid form-grid-2" style="gap:14px">

      <div class="form-group" style="grid-column:1/-1">
        <label class="form-label">Razão social / Nome <span>*</span></label>
        <input id="fn-nome" class="form-control" placeholder="Ex: Frigorífico Norte Ltda">
      </div>

      <div class="form-group">
        <label class="form-label">CNPJ <span>*</span></label>
        <input id="fn-cnpj" class="form-control" placeholder="00.000.000/0001-00" maxlength="18"
          oninput="this.value=formatCNPJ(this.value)">
      </div>

      <div class="form-group">
        <label class="form-label">Categoria <span>*</span></label>
        <select id="fn-cat" class="form-control">
          <option value="">Selecione</option>
          <option>Carnes</option><option>Frutos do Mar</option><option>Bebidas</option>
          <option>Laticínios</option><option>Hortifrúti</option><option>Outros</option>
        </select>
      </div>

      <div class="form-group">
        <label class="form-label">Telefone / WhatsApp <span>*</span></label>
        <input id="fn-tel" class="form-control" placeholder="(61) 3000-0000">
      </div>

      <div class="form-group">
        <label class="form-label">E-mail comercial</label>
        <input id="fn-email" type="email" class="form-control" placeholder="vendas@fornecedor.com.br">
      </div>

      <div class="form-group" style="grid-column:1/-1">
        <label class="form-label">Endereço</label>
        <input id="fn-endereco" class="form-control" placeholder="Ex: SCIA Quadra 12, Galpão 3">
      </div>

      <div class="form-group">
        <label class="form-label">Prazo de entrega</label>
        <input id="fn-prazo" class="form-control" placeholder="Ex: 2 dias úteis">
      </div>

      <div class="form-group">
        <label class="form-label">Avaliação inicial</label>
        <select id="fn-aval" class="form-control">
          <option value="5">★★★★★ Excelente</option>
          <option value="4">★★★★☆ Bom</option>
          <option value="3">★★★☆☆ Regular</option>
          <option value="2">★★☆☆☆ Ruim</option>
          <option value="1">★☆☆☆☆ Péssimo</option>
        </select>
      </div>

    </div>`,
    `<button class="btn btn-outline" onclick="closeModal()">Cancelar</button>
     <button class="btn btn-primary" onclick="salvarFornecedor()">💾 Cadastrar Fornecedor</button>`
  );
}

function salvarFornecedor() {
  const nome      = document.getElementById('fn-nome')?.value.trim();
  const cnpj      = document.getElementById('fn-cnpj')?.value.trim();
  const categoria = document.getElementById('fn-cat')?.value;
  const telefone  = document.getElementById('fn-tel')?.value.trim();
  const email     = document.getElementById('fn-email')?.value.trim();
  const endereco  = document.getElementById('fn-endereco')?.value.trim();
  const prazoEntrega = document.getElementById('fn-prazo')?.value.trim()||'A combinar';
  const avaliacao = parseInt(document.getElementById('fn-aval')?.value)||5;

  if(!nome||!telefone||!categoria){
    showToast('Nome, telefone e categoria são obrigatórios.','error'); return;
  }
  STATE.fornecedores.push({id:nextId(STATE.fornecedores), nome, cnpj:cnpj||'—',
    categoria, telefone, email, endereco, prazoEntrega, avaliacao, ativo:true});
  closeModal(); renderFornecedores();
  showToast(`Fornecedor "${nome}" cadastrado!`);
}

function editarFornecedor(id) {
  const f=STATE.fornecedores.find(x=>x.id===id); if(!f) return;
  openModal(`UC9.2 – Alterar Fornecedor — ${f.nome}`,`
    <div class="form-grid form-grid-2" style="gap:14px">
      <div class="form-group" style="grid-column:1/-1">
        <label class="form-label">Razão social / Nome <span>*</span></label>
        <input id="fn-nome" class="form-control" value="${f.nome}">
      </div>
      <div class="form-group">
        <label class="form-label">CNPJ</label>
        <input id="fn-cnpj" class="form-control" value="${f.cnpj}" maxlength="18"
          oninput="this.value=formatCNPJ(this.value)">
      </div>
      <div class="form-group">
        <label class="form-label">Categoria</label>
        <select id="fn-cat" class="form-control">
          ${['Carnes','Frutos do Mar','Bebidas','Laticínios','Hortifrúti','Outros'].map(c=>
            `<option${c===f.categoria?' selected':''}>${c}</option>`).join('')}
        </select>
      </div>
      <div class="form-group">
        <label class="form-label">Telefone</label>
        <input id="fn-tel" class="form-control" value="${f.telefone}">
      </div>
      <div class="form-group">
        <label class="form-label">E-mail</label>
        <input id="fn-email" type="email" class="form-control" value="${f.email||''}">
      </div>
      <div class="form-group" style="grid-column:1/-1">
        <label class="form-label">Endereço</label>
        <input id="fn-endereco" class="form-control" value="${f.endereco||''}">
      </div>
      <div class="form-group">
        <label class="form-label">Prazo de entrega</label>
        <input id="fn-prazo" class="form-control" value="${f.prazoEntrega}">
      </div>
      <div class="form-group">
        <label class="form-label">Avaliação</label>
        <select id="fn-aval" class="form-control">
          ${[5,4,3,2,1].map(v=>`<option value="${v}"${v===f.avaliacao?' selected':''}>${'★'.repeat(v)+'☆'.repeat(5-v)}</option>`).join('')}
        </select>
      </div>
    </div>`,
    `<button class="btn btn-outline" onclick="closeModal()">Cancelar</button>
     <button class="btn btn-primary" onclick="confirmarEditFornecedor(${id})">💾 Salvar</button>`
  );
}
function confirmarEditFornecedor(id) {
  const f=STATE.fornecedores.find(x=>x.id===id); if(!f) return;
  f.nome         = document.getElementById('fn-nome')?.value.trim()||f.nome;
  f.cnpj         = document.getElementById('fn-cnpj')?.value.trim()||f.cnpj;
  f.categoria    = document.getElementById('fn-cat')?.value||f.categoria;
  f.telefone     = document.getElementById('fn-tel')?.value.trim()||f.telefone;
  f.email        = document.getElementById('fn-email')?.value.trim();
  f.endereco     = document.getElementById('fn-endereco')?.value.trim();
  f.prazoEntrega = document.getElementById('fn-prazo')?.value.trim()||f.prazoEntrega;
  f.avaliacao    = parseInt(document.getElementById('fn-aval')?.value)||f.avaliacao;
  closeModal(); renderFornecedores();
  showToast(`Fornecedor "${f.nome}" atualizado!`);
}
function toggleAtivoFornecedor(id) {
  const f=STATE.fornecedores.find(x=>x.id===id); if(!f) return;
  f.ativo=!f.ativo; renderFornecedores();
  showToast(`Fornecedor "${f.nome}" ${f.ativo?'reativado':'inativado'}.`);
}

// ─── Pedido ao fornecedor ──────────────────────────────────────
function novoPedido(id) {
  const f=STATE.fornecedores.find(x=>x.id===id); if(!f) return;
  const itens=STATE.estoque.filter(i=>i.fornecedor===f.nome);
  openModal(`📦 Novo Pedido — ${f.nome}`,`
    <div style="background:var(--bg);border-radius:8px;padding:12px;margin-bottom:14px;font-size:.85rem">
      <strong>${f.nome}</strong> · CNPJ: ${f.cnpj}<br>
      📞 ${f.telefone} · 🚚 Prazo: ${f.prazoEntrega}
    </div>
    <div class="form-group" style="margin-bottom:12px">
      <label class="form-label">Item do pedido <span>*</span></label>
      <select id="ped-item" class="form-control">
        ${itens.length
          ?itens.map(i=>`<option value="${i.id}">${i.ingrediente} (atual: ${i.quantidade} ${i.unidade})</option>`).join('')
          :'<option value="">— Nenhum item vinculado —</option>'}
      </select>
    </div>
    <div class="form-group" style="margin-bottom:12px">
      <label class="form-label">Quantidade <span>*</span></label>
      <input id="ped-qtd" type="number" class="form-control" min="1" placeholder="Ex: 20">
    </div>
    <div class="form-group">
      <label class="form-label">Observação</label>
      <input id="ped-obs" class="form-control" placeholder="Ex: Entrega urgente, embalagem a vácuo">
    </div>`,
    `<button class="btn btn-outline" onclick="closeModal()">Cancelar</button>
     <button class="btn btn-primary" onclick="confirmarPedido(${f.id})">📦 Fazer Pedido</button>`
  );
}
function confirmarPedido(fornId) {
  const f=STATE.fornecedores.find(x=>x.id===fornId);
  const qtd=parseFloat(document.getElementById('ped-qtd')?.value);
  if(!qtd||qtd<=0){ showToast('Informe a quantidade.','error'); return; }
  STATE.pedidos.push({id:nextId(STATE.pedidos), fornecedor:f?.nome, qtd, data:new Date().toLocaleDateString('pt-BR'), status:'enviado'});
  closeModal(); showToast(`Pedido enviado para ${f?.nome}! Previsão: ${f?.prazoEntrega}.`);
}

// ════════════════════════════════════════════════════════════
// UC10 – AGENDA (calendário dinâmico)
// ════════════════════════════════════════════════════════════
function renderCalendar() {
  const d=STATE.calendarDate;
  const ano=d.getFullYear(), mes=d.getMonth();
  const mesesPt=['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro'];
  const mesesCurtos=['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];

  const calTitle=document.getElementById('cal-title');
  if(calTitle) calTitle.textContent=`${mesesPt[mes]} ${ano}`;

  const evMes=STATE.eventos.filter(e=>{
    const ed=new Date(e.data+'T00:00:00');
    return ed.getFullYear()===ano&&ed.getMonth()===mes;
  });
  const diasEvento=new Set(evMes.map(e=>parseInt(e.data.split('-')[2])));

  const grid=document.getElementById('cal-grid'); if(!grid) return;
  const primDia=new Date(ano,mes,1).getDay();
  const totalDias=new Date(ano,mes+1,0).getDate();
  const prevDias=new Date(ano,mes,0).getDate();
  const hoje=new Date();

  let html='';
  for(let i=primDia-1;i>=0;i--) html+=`<div class="cal-day other-month">${prevDias-i}</div>`;
  for(let i=1;i<=totalDias;i++){
    const isHoje=i===hoje.getDate()&&mes===hoje.getMonth()&&ano===hoje.getFullYear();
    const temEv=diasEvento.has(i);
    html+=`<div class="cal-day${isHoje?' today':''}${temEv?' has-event':''}" onclick="calDayClick(${ano},${mes+1},${i})">${i}</div>`;
  }
  const rest=42-(primDia+totalDias);
  for(let i=1;i<=rest;i++) html+=`<div class="cal-day other-month">${i}</div>`;
  grid.innerHTML=html;

  const labelEl=document.getElementById('agenda-mes-label');
  if(labelEl) labelEl.textContent=`Eventos em ${mesesPt[mes]} ${ano}`;

  const lista=document.getElementById('agenda-lista-eventos'); if(!lista) return;
  if(!evMes.length){ lista.innerHTML='<p class="text-muted text-sm" style="padding:8px">Nenhum evento neste mês.</p>'; return; }
  const sorted=[...evMes].sort((a,b)=>a.data.localeCompare(b.data));
  lista.innerHTML=sorted.map(e=>{
    const [,m,dia]=e.data.split('-');
    return `<div class="event-card">
      <div class="event-date-box"><div class="event-date-day">${dia}</div><div class="event-date-month">${mesesCurtos[+m-1]}</div></div>
      <div class="event-info">
        <div class="event-name">${e.nome}</div>
        <div class="event-meta"><span>📍 ${e.local}</span><span>👥 ${e.nConvidados}</span><span>💰 ${fmtBRL(valorEvento(e))}</span></div>
        <div style="margin-top:6px">${statusBadge(e.status)}</div>
      </div>
      <div class="event-actions"><button class="btn btn-outline btn-sm" onclick="abrirOS(${e.id})">📋 OS</button></div>
    </div>`;
  }).join('');
}

function calNavegar(delta) {
  STATE.calendarDate.setMonth(STATE.calendarDate.getMonth()+delta);
  renderCalendar();
}

function calDayClick(ano,mes,dia) {
  const dataStr=`${ano}-${String(mes).padStart(2,'0')}-${String(dia).padStart(2,'0')}`;
  const evs=STATE.eventos.filter(e=>e.data===dataStr);
  if(evs.length){
    openModal(`📅 Eventos em ${String(dia).padStart(2,'0')}/${String(mes).padStart(2,'0')}/${ano}`,
      evs.map(e=>`<div style="padding:12px;background:var(--bg);border-radius:8px;margin-bottom:8px">
        <strong>${e.nome}</strong> ${statusBadge(e.status)}<br>
        <span class="text-sm text-muted">📍 ${e.local} · 👥 ${e.nConvidados} · 💰 ${fmtBRL(valorEvento(e))}</span>
      </div>`).join(''),
      `<button class="btn btn-outline" onclick="closeModal()">Fechar</button>`);
  } else {
    openModal(`Novo evento — ${String(dia).padStart(2,'0')}/${String(mes).padStart(2,'0')}/${ano}`,
      `<p>Deseja criar um evento para esta data?</p>`,
      `<button class="btn btn-outline" onclick="closeModal()">Cancelar</button>
       <button class="btn btn-primary" onclick="closeModal();novoEvento();setTimeout(()=>{const el=document.getElementById('ev-data');if(el)el.value='${dataStr}';},100)">+ Criar Evento</button>`
    );
  }
}

// ════════════════════════════════════════════════════════════
// UC11+UC12 – RELATÓRIOS
// ════════════════════════════════════════════════════════════
function renderRelatorios() {
  const ativos=STATE.eventos.filter(e=>e.status!=='cancelado');
  const total=ativos.reduce((s,e)=>s+valorEvento(e),0);
  const ticket=ativos.length?Math.round(total/ativos.length):0;

  const set=(id,v)=>{const el=document.getElementById(id);if(el)el.textContent=v;};
  set('rel-faturamento',fmtBRL(total));
  set('rel-ticket',fmtBRL(ticket));
  set('rel-margem',total>0?'35%':'0%');
  set('rel-qtdevs',ativos.length);

  // Barras por tipo
  const tipos=['Casamento','Formatura','Aniversário','Corporativo'];
  const totTipo={};
  tipos.forEach(t=>{ totTipo[t]=ativos.filter(e=>e.tipo===t).reduce((s,e)=>s+valorEvento(e),0); });
  const cores={'Casamento':'var(--green-500)','Formatura':'var(--gold-500)','Aniversário':'#3B6FCC','Corporativo':'var(--text-muted)'};
  const barrasEl=document.getElementById('rel-barras-tipo');
  if(barrasEl){
    barrasEl.innerHTML=tipos.map(t=>{
      const pct=total?Math.round((totTipo[t]/total)*100):0;
      return `<div>
        <div class="flex justify-between text-sm" style="margin-bottom:5px">
          <span>${t}</span><strong>${fmtBRL(totTipo[t])} (${pct}%)</strong>
        </div>
        <div class="progress-bar"><div class="progress-fill" style="width:${pct}%;background:${cores[t]}"></div></div>
      </div>`;
    }).join('');
  }
}

function renderRelatoriosOperacional() {
  const set=(id,v)=>{const el=document.getElementById(id);if(el)el.textContent=v;};
  set('rel-os',STATE.eventos.filter(e=>e.status!=='cancelado').length);
  set('rel-contratos',STATE.eventos.filter(e=>e.status==='aguardando').length);
  set('rel-estoque-alertas',STATE.estoque.filter(i=>estoqueStatus(i)!=='ok').length);
  set('rel-fornecedores',STATE.fornecedores.filter(f=>f.ativo).length);
}

// ════════════════════════════════════════════════════════════
// NOTIFICAÇÕES
// ════════════════════════════════════════════════════════════
function abrirNotificacoes() {
  const criticos=STATE.estoque.filter(i=>estoqueStatus(i)!=='ok');
  const pendentes=STATE.eventos.filter(e=>e.status==='aguardando');
  let html='';
  criticos.forEach(i=>{html+=`<div style="padding:12px;border-bottom:1px solid var(--border)">
    <strong>📦 Estoque ${estoqueStatus(i)}</strong><br>
    <span class="text-sm text-muted">${i.ingrediente}: ${i.quantidade} ${i.unidade} (mín. ${i.estoqueMinimo})</span></div>`;});
  pendentes.forEach(e=>{html+=`<div style="padding:12px;border-bottom:1px solid var(--border)">
    <strong>📄 Contrato aguardando</strong><br>
    <span class="text-sm text-muted">${e.nome} — ${formatDate(e.data)}</span></div>`;});
  if(!html) html='<div style="padding:20px;text-align:center;color:var(--text-muted)">✅ Nenhuma notificação pendente.</div>';
  openModal('🔔 Notificações', html,
    `<button class="btn btn-outline" onclick="closeModal()">Fechar</button>`);
}

// ════════════════════════════════════════════════════════════
// BUSCA GLOBAL
// ════════════════════════════════════════════════════════════
function buscaGlobal(q) {
  if(!q.trim()) return;
  const query=q.toLowerCase();
  const evs=STATE.eventos.filter(e=>e.nome.toLowerCase().includes(query)||e.tipo.toLowerCase().includes(query));
  const cls=STATE.clientes.filter(c=>c.nome.toLowerCase().includes(query)||c.cpf.includes(query));
  const fns=STATE.fornecedores.filter(f=>f.nome.toLowerCase().includes(query)||f.cnpj.includes(query));

  if(evs.length){
    navigate('eventos');
    setTimeout(()=>{const el=document.getElementById('search-eventos');if(el){el.value=q;renderEventos(q);}},80);
  } else if(cls.length){
    navigate('clientes');
    setTimeout(()=>{const el=document.getElementById('search-clientes');if(el){el.value=q;renderClientes(q);}},80);
  } else if(fns.length){
    navigate('fornecedores');
    setTimeout(()=>{const el=document.getElementById('search-fornecedores');if(el){el.value=q;renderFornecedores();}},80);
  } else {
    showToast(`Nenhum resultado para "${q}"`, 'error');
  }
}

// ════════════════════════════════════════════════════════════
// INIT
// ════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded',()=>{
  // Nav
  document.querySelectorAll('.nav-item[data-page]').forEach(el=>
    el.addEventListener('click',()=>navigate(el.dataset.page)));

  // Sidebar overlay
  document.querySelector('.sidebar-overlay')?.addEventListener('click',closeSidebar);

  // Modal fechar ao clicar fora
  document.getElementById('app-modal')?.addEventListener('click',e=>{
    if(e.target.id==='app-modal') closeModal();
  });

  // Busca global
  document.getElementById('global-search')?.addEventListener('keydown',e=>{
    if(e.key==='Enter') buscaGlobal(e.target.value);
  });

  // Buscas por página
  document.getElementById('search-eventos')?.addEventListener('input',e=>renderEventos(e.target.value));
  document.getElementById('search-clientes')?.addEventListener('input',e=>renderClientes(e.target.value));
  document.getElementById('search-estoque')?.addEventListener('input',e=>renderEstoque(e.target.value));
  document.getElementById('search-fornecedores')?.addEventListener('input',()=>renderFornecedores());
  document.getElementById('filter-cat-forn')?.addEventListener('change',()=>renderFornecedores());

  // Filtro status eventos
  document.getElementById('filter-status-eventos')?.addEventListener('change',e=>{
    STATE.filterEventoStatus=e.target.value;
    renderEventos(document.getElementById('search-eventos')?.value||'');
  });

  // Render inicial
  renderEventos();
  renderClientes();
  renderEstoque();
  renderFornecedores();
  navigate('dashboard');
});
