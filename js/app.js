/* ============================================================
   BuffetAuto – app.js
   Navegação SPA entre páginas do protótipo
   ============================================================ */

// ─── Dados fictícios ─────────────────────────────────────────
const DATA = {
  eventos: [
    { id:1, nome:'Casamento Silva & Costa', tipo:'Casamento', data:'2026-06-14', local:'Espaço Villa Bella', convidados:180, status:'confirmado', valor:'R$ 28.400', responsavel:'Carla Mendes' },
    { id:2, nome:'Formatura Medicina UFDF', tipo:'Formatura', data:'2026-06-22', local:'Hotel Nobile',       convidados:320, status:'aguardando', valor:'R$ 52.000', responsavel:'Pedro Alves' },
    { id:3, nome:'Aniversário 50 anos Dr. Paulo', tipo:'Aniversário', data:'2026-07-05', local:'Chácara das Flores', convidados:90,  status:'confirmado', valor:'R$ 14.800', responsavel:'Carla Mendes' },
    { id:4, nome:'Confraternização Tech Corp', tipo:'Corporativo', data:'2026-07-18', local:'Centro de Convenções', convidados:200, status:'proposta',   valor:'R$ 31.500', responsavel:'João Souza' },
    { id:5, nome:'Bodas de Ouro Família Ramos', tipo:'Casamento', data:'2026-08-02', local:'Quinta dos Sonhos', convidados:120, status:'cancelado',  valor:'R$ 19.200', responsavel:'Pedro Alves' },
  ],
  clientes: [
    { id:1, nome:'Ana Silva',      telefone:'(61) 99821-3344', tipo:'Casamento',   historico:3, ultimoEvento:'Mar/2026' },
    { id:2, nome:'Dr. Paulo Ramos',telefone:'(61) 98765-2211', tipo:'Aniversário', historico:1, ultimoEvento:'Jul/2025' },
    { id:3, nome:'Tech Corp Ltda', telefone:'(61) 3344-5500',  tipo:'Corporativo', historico:5, ultimoEvento:'Jan/2026' },
    { id:4, nome:'Família Costa',  telefone:'(61) 99234-7788', tipo:'Casamento',   historico:2, ultimoEvento:'Nov/2025' },
  ],
  estoque: [
    { id:1, ingrediente:'Filé Mignon',   unidade:'kg',  quantidade:45,  minimo:20, fornecedor:'Frigorífico Sul',  status:'ok' },
    { id:2, ingrediente:'Camarão GG',     unidade:'kg',  quantidade:12,  minimo:15, fornecedor:'Pesqueiro Mar',    status:'baixo' },
    { id:3, ingrediente:'Champagne Brut', unidade:'un',  quantidade:80,  minimo:50, fornecedor:'Vinhos & Bebidas', status:'ok' },
    { id:4, ingrediente:'Salmão',         unidade:'kg',  quantidade:8,   minimo:20, fornecedor:'Pesqueiro Mar',    status:'crítico' },
    { id:5, ingrediente:'Creme de Leite', unidade:'cx',  quantidade:120, minimo:60, fornecedor:'Laticínios Belo',  status:'ok' },
  ],
  fornecedores: [
    { id:1, nome:'Frigorífico Sul',   categoria:'Carnes',   contato:'(61) 3211-4400', prazo:'3 dias', avaliacao:5 },
    { id:2, nome:'Pesqueiro Mar',     categoria:'Frutos do Mar', contato:'(61) 3344-6600', prazo:'1 dia',  avaliacao:4 },
    { id:3, nome:'Vinhos & Bebidas',  categoria:'Bebidas',  contato:'(61) 3500-1122', prazo:'5 dias', avaliacao:5 },
    { id:4, nome:'Laticínios Belo',   categoria:'Laticínios',contato:'(61) 3211-8800', prazo:'2 dias', avaliacao:4 },
  ],
};

// ─── Navegação ────────────────────────────────────────────────
function navigate(pageId) {
  // Atualiza nav items
  document.querySelectorAll('.nav-item').forEach(el => {
    el.classList.toggle('active', el.dataset.page === pageId);
  });

  // Esconde todas as páginas
  document.querySelectorAll('.page').forEach(p => p.style.display = 'none');

  // Mostra a página alvo
  const target = document.getElementById('page-' + pageId);
  if (target) {
    target.style.display = 'block';
    // Re-anima
    target.querySelectorAll('.fade-up, .fade-up-2, .fade-up-3, .fade-up-4').forEach(el => {
      el.style.animation = 'none';
      el.offsetHeight;
      el.style.animation = '';
    });
  }

  // Fecha sidebar mobile
  closeSidebar();

  // Atualiza título da topbar
  const titles = {
    dashboard: 'Dashboard',
    eventos: 'Gestão de Eventos',
    clientes: 'Clientes',
    orcamento: 'Novo Orçamento',
    estoque: 'Controle de Estoque',
    fornecedores: 'Fornecedores',
    agenda: 'Agenda de Eventos',
    relatorios: 'Relatórios',
  };
  const topbarTitle = document.querySelector('.topbar-title');
  if (topbarTitle) topbarTitle.textContent = titles[pageId] || 'BuffetAuto';
}

// ─── Sidebar mobile ───────────────────────────────────────────
function toggleSidebar() {
  document.querySelector('.sidebar').classList.toggle('open');
  document.querySelector('.sidebar-overlay').classList.toggle('open');
}
function closeSidebar() {
  document.querySelector('.sidebar')?.classList.remove('open');
  document.querySelector('.sidebar-overlay')?.classList.remove('open');
}

// ─── Render helpers ───────────────────────────────────────────
function statusBadge(status) {
  const map = {
    confirmado: '<span class="badge badge-success">Confirmado</span>',
    aguardando:  '<span class="badge badge-warning">Aguardando</span>',
    proposta:    '<span class="badge badge-info">Proposta</span>',
    cancelado:   '<span class="badge badge-danger">Cancelado</span>',
    ok:          '<span class="badge badge-success">OK</span>',
    baixo:       '<span class="badge badge-warning">Baixo</span>',
    crítico:     '<span class="badge badge-danger">Crítico</span>',
  };
  return map[status] || `<span class="badge badge-muted">${status}</span>`;
}

function estrelas(n) {
  return '★'.repeat(n) + '☆'.repeat(5-n);
}

function formatDate(iso) {
  const [y,m,d] = iso.split('-');
  const meses = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];
  return `${d}/${meses[+m-1]}/${y}`;
}

// ─── Renderizar tabelas ───────────────────────────────────────
function renderEventos(filter = '') {
  const tbody = document.querySelector('#eventos-tbody');
  if (!tbody) return;
  const filtered = DATA.eventos.filter(e =>
    e.nome.toLowerCase().includes(filter.toLowerCase()) ||
    e.tipo.toLowerCase().includes(filter.toLowerCase())
  );
  tbody.innerHTML = filtered.map(e => `
    <tr>
      <td><strong>${e.nome}</strong><br><span class="text-sm text-muted">${e.tipo}</span></td>
      <td>${formatDate(e.data)}</td>
      <td>${e.local}</td>
      <td>${e.convidados}</td>
      <td>${e.valor}</td>
      <td>${statusBadge(e.status)}</td>
      <td>
        <div class="flex gap-2">
          <button class="btn btn-ghost btn-sm btn-icon" title="Editar" onclick="showToast('Editando evento…')">✏️</button>
          <button class="btn btn-ghost btn-sm btn-icon" title="Gerar OS" onclick="showToast('Ordem de serviço gerada!')">📋</button>
          <button class="btn btn-ghost btn-sm btn-icon" title="Gerar Contrato" onclick="showToast('Contrato gerado!')">📄</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function renderClientes(filter = '') {
  const tbody = document.querySelector('#clientes-tbody');
  if (!tbody) return;
  const filtered = DATA.clientes.filter(c =>
    c.nome.toLowerCase().includes(filter.toLowerCase())
  );
  tbody.innerHTML = filtered.map(c => `
    <tr>
      <td>
        <div class="flex items-center gap-2">
          <div class="sidebar-avatar" style="width:32px;height:32px;font-size:.75rem">${c.nome.split(' ').map(n=>n[0]).slice(0,2).join('')}</div>
          <strong>${c.nome}</strong>
        </div>
      </td>
      <td>${c.telefone}</td>
      <td>${c.tipo}</td>
      <td>${c.historico} evento${c.historico>1?'s':''}</td>
      <td>${c.ultimoEvento}</td>
      <td>
        <div class="flex gap-2">
          <button class="btn btn-outline btn-sm" onclick="showToast('Abrindo ficha do cliente…')">Ver ficha</button>
          <button class="btn btn-ghost btn-sm btn-icon" onclick="showToast('Novo orçamento iniciado!')">💰</button>
        </div>
      </td>
    </tr>
  `).join('');
}

function renderEstoque(filter = '') {
  const tbody = document.querySelector('#estoque-tbody');
  if (!tbody) return;
  const filtered = DATA.estoque.filter(i =>
    i.ingrediente.toLowerCase().includes(filter.toLowerCase())
  );
  tbody.innerHTML = filtered.map(i => {
    const pct = Math.min(100, Math.round((i.quantidade / (i.minimo * 2)) * 100));
    return `
    <tr>
      <td><strong>${i.ingrediente}</strong></td>
      <td>${i.quantidade} ${i.unidade}</td>
      <td>${i.minimo} ${i.unidade}</td>
      <td>
        <div style="display:flex;align-items:center;gap:8px;">
          <div class="progress-bar" style="width:80px">
            <div class="progress-fill ${i.status==='ok'?'':'gold'}" style="width:${pct}%"></div>
          </div>
          <span class="text-sm text-muted">${pct}%</span>
        </div>
      </td>
      <td>${i.fornecedor}</td>
      <td>${statusBadge(i.status)}</td>
      <td>
        <div class="flex gap-2">
          <button class="btn btn-outline btn-sm" onclick="showToast('Entrada registrada!')">+ Entrada</button>
          <button class="btn btn-ghost btn-sm" onclick="showToast('Saída registrada!')">- Saída</button>
        </div>
      </td>
    </tr>
  `}).join('');
}

function renderFornecedores() {
  const container = document.querySelector('#fornecedores-container');
  if (!container) return;
  container.innerHTML = DATA.fornecedores.map(f => `
    <div class="card" style="padding:20px">
      <div class="flex justify-between items-center mb-4">
        <div>
          <div style="font-weight:600;font-size:1rem">${f.nome}</div>
          <div class="text-sm text-muted">${f.categoria}</div>
        </div>
        <span class="badge badge-info">${f.categoria}</span>
      </div>
      <div class="flex gap-4 text-sm text-muted mb-4">
        <span>📞 ${f.contato}</span>
        <span>🚚 Prazo: ${f.prazo}</span>
      </div>
      <div class="flex justify-between items-center">
        <span style="color:var(--gold-500);font-size:.95rem">${estrelas(f.avaliacao)}</span>
        <div class="flex gap-2">
          <button class="btn btn-outline btn-sm" onclick="showToast('Pedido criado!')">Novo Pedido</button>
          <button class="btn btn-ghost btn-sm btn-icon" onclick="showToast('Editando…')">✏️</button>
        </div>
      </div>
    </div>
  `).join('');
}

// ─── Toast notification ───────────────────────────────────────
function showToast(msg, type = 'success') {
  const existing = document.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.style.cssText = `
    position:fixed; bottom:24px; right:24px; z-index:9999;
    background:${type==='success' ? 'var(--green-900)' : '#C0392B'};
    color:#fff; padding:12px 20px; border-radius:10px;
    font-size:.87rem; box-shadow:var(--shadow-lg);
    display:flex; align-items:center; gap:10px;
    animation: fadeUp .3s ease;
    max-width:320px;
  `;
  toast.innerHTML = `<span>${type==='success'?'✅':'❌'}</span><span>${msg}</span>`;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
}

// ─── Geração de orçamento ─────────────────────────────────────
function calcularOrcamento() {
  const nome       = document.getElementById('orc-nome')?.value || '';
  const convidados = parseInt(document.getElementById('orc-convidados')?.value) || 0;
  const cardapio   = document.getElementById('orc-cardapio')?.value || '';
  const extra      = document.getElementById('orc-extra')?.checked;

  if (!nome || !convidados || !cardapio) {
    showToast('Preencha todos os campos obrigatórios.', 'error'); return;
  }

  const precos = { basico: 180, standard: 260, premium: 380, gourmet: 520 };
  const base = precos[cardapio] || 260;
  const subtotal = convidados * base;
  const extras  = extra ? subtotal * .15 : 0;
  const total   = subtotal + extras;
  const margem  = total * .35;

  const resultDiv = document.getElementById('orc-result');
  if (!resultDiv) return;
  resultDiv.style.display = 'block';
  resultDiv.innerHTML = `
    <div class="alert alert-success" style="margin-bottom:16px">
      ✅ Orçamento gerado com sucesso para <strong>${nome}</strong>
    </div>
    <div class="card">
      <div class="card-header"><span class="card-title">💰 Resumo do Orçamento</span></div>
      <div class="card-body">
        <div style="display:grid;gap:10px">
          <div class="flex justify-between"><span class="text-muted">Convidados:</span><strong>${convidados} pessoas</strong></div>
          <div class="flex justify-between"><span class="text-muted">Cardápio:</span><strong>${cardapio.charAt(0).toUpperCase()+cardapio.slice(1)}</strong></div>
          <div class="flex justify-between"><span class="text-muted">Valor por pessoa:</span><strong>R$ ${base.toFixed(2).replace('.',',')}</strong></div>
          <div class="flex justify-between"><span class="text-muted">Subtotal:</span><strong>R$ ${subtotal.toLocaleString('pt-BR')}</strong></div>
          ${extra ? `<div class="flex justify-between"><span class="text-muted">Extras (15%):</span><strong>R$ ${extras.toLocaleString('pt-BR')}</strong></div>` : ''}
          <hr class="divider">
          <div class="flex justify-between"><span style="font-weight:600;font-size:1.05rem">Total</span><strong style="font-family:'Cormorant Garamond',serif;font-size:1.5rem;color:var(--green-700)">R$ ${total.toLocaleString('pt-BR')}</strong></div>
          <div class="flex justify-between"><span class="text-muted">Margem estimada:</span><strong class="text-green">R$ ${margem.toLocaleString('pt-BR')} (35%)</strong></div>
        </div>
        <div class="flex gap-3 mt-2" style="margin-top:16px">
          <button class="btn btn-primary" onclick="showToast('Proposta enviada por e-mail!')">📧 Enviar Proposta</button>
          <button class="btn btn-gold" onclick="showToast('Contrato gerado!')">📄 Gerar Contrato</button>
          <button class="btn btn-outline" onclick="showToast('PDF salvo!')">⬇️ Baixar PDF</button>
        </div>
      </div>
    </div>
  `;
  resultDiv.scrollIntoView({ behavior: 'smooth' });
}

// ─── Init ─────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  // Evento click nas nav items
  document.querySelectorAll('.nav-item[data-page]').forEach(el => {
    el.addEventListener('click', () => navigate(el.dataset.page));
  });

  // Sidebar overlay click
  document.querySelector('.sidebar-overlay')?.addEventListener('click', closeSidebar);

  // Inicializa tabelas
  renderEventos();
  renderClientes();
  renderEstoque();
  renderFornecedores();

  // Busca
  document.getElementById('search-eventos')?.addEventListener('input', e => renderEventos(e.target.value));
  document.getElementById('search-clientes')?.addEventListener('input', e => renderClientes(e.target.value));
  document.getElementById('search-estoque')?.addEventListener('input', e => renderEstoque(e.target.value));

  // Página inicial
  navigate('dashboard');
});