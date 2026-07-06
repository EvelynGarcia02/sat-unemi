/* SAT-UNEMI — Aplicacion principal con cross-filtering */

/* ============================================================
   UTILIDADES
   ============================================================ */
const $ = (sel, ctx) => (ctx || document).querySelector(sel);
const $$ = (sel, ctx) => [...(ctx || document).querySelectorAll(sel)];

function fmt(n, dec = 0) {
  if (n == null || isNaN(n)) return '-';
  return Number(n).toLocaleString('es-EC', { minimumFractionDigits: dec, maximumFractionDigits: dec });
}
function fmtPct(n, dec = 1) { return fmt(n, dec) + '%'; }
function zonaBadge(z) {
  const map = { A:'alto', M:'medio', B:'bajo' };
  const lbl = { A:'ALTO', M:'MEDIO', B:'BAJO' };
  return `<span class="badge badge-${map[z]||'bajo'}">${lbl[z]||z}</span>`;
}
function zoneColor(z) {
  return z==='A' ? 'var(--risk-high)' : z==='M' ? 'var(--risk-mid)' : 'var(--risk-low)';
}
function modLabel(m) { return m==='P'?'Presencial': m==='L'?'En linea':'Semipresencial'; }
function sexLabel(s) { return s==='F'?'Mujer':'Hombre'; }
function gratLabel(g) { return g==='GC'?'Gratuidad Completa': g==='PG'?'Perdida de Gratuidad':'Sin Registro'; }
function eciLabel(e) { return e==='S'?'Sin pareja':'Con pareja'; }
const MOD_FULL = { L:'EN LINEA', P:'PRESENCIAL', S:'SEMIPRESENCIAL' };

/* ============================================================
   ESTADO GLOBAL
   ============================================================ */
const State = {
  page: 'dashboard',
  filters: { facultad:'', modalidad:'', cohorte:'', zona:'' },
  table: { page:1, pageSize:20, sort:'sc', dir:'desc', search:'' },
  students: [],
  filteredStudents: [],
  charts: {}
};

/* ============================================================
   CROSS-FILTER  (como PowerBI / Tableau)
   ============================================================ */
const CF = {
  active: null,   // {type, value, label}

  set(type, value, label) {
    if (this.active && this.active.type===type && this.active.value===value) {
      this.active = null;       // toggle off al hacer clic de nuevo
    } else {
      this.active = { type, value, label };
    }
    applyFilters();
    renderDashboardCharts();
    renderCFChip();
    if (State.page==='alertas') renderTable();
  },

  clear() {
    this.active = null;
    applyFilters();
    renderDashboardCharts();
    renderCFChip();
    if (State.page==='alertas') renderTable();
  },

  apply(sts) {
    if (!this.active) return sts;
    const { type, value } = this.active;
    if (type==='zona')      return sts.filter(s => s.z === value);
    if (type==='cohorte')   return sts.filter(s => s.coh === value);
    if (type==='facultad')  return sts.filter(s => s.fac === value);
    if (type==='carrera')   return sts.filter(s => s.car === value);
    if (type==='modalidad') return sts.filter(s => MOD_FULL[s.mod] === value);
    return sts;
  },

  isActive(type, value) {
    return this.active && this.active.type===type && this.active.value===value;
  }
};

function renderCFChip() {
  // Mostrar chip en dashboard Y en alertas
  $$('#cf-chip-area, #cf-chip-alertas').forEach(el => {
    if (!el) return;
    if (!CF.active) { el.innerHTML = ''; el.style.display = 'none'; return; }
    el.style.display = 'flex';
    el.innerHTML = `
      <div style="display:flex;align-items:center;gap:8px;padding:8px 14px;background:#fff;border-radius:8px;box-shadow:0 1px 6px rgba(0,0,0,0.1);border:1.5px solid var(--unemi-blue3);font-size:13px;margin-bottom:4px">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--unemi-blue3)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="flex-shrink:0"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>
        <span style="color:#64748b">Filtro activo:</span>
        <strong style="color:var(--unemi-navy)">${CF.active.label}</strong>
        <button onclick="CF.clear()" style="margin-left:8px;background:var(--risk-high-bg);border:1px solid var(--risk-high-bd);border-radius:6px;cursor:pointer;color:var(--risk-high);font-size:12px;font-weight:700;padding:2px 10px" title="Quitar filtro">Quitar &#215;</button>
      </div>
    `;
  });
}

/* ============================================================
   NAVEGACION
   ============================================================ */
function navigate(page) {
  State.page = page;
  $$('.page').forEach(p => p.classList.remove('active'));
  $$('.nav-item').forEach(n => n.classList.remove('active'));
  const pg = $(`#page-${page}`);
  if (pg) pg.classList.add('active');
  const nav = $(`[data-page="${page}"]`);
  if (nav) nav.classList.add('active');
  const titles = {
    dashboard:    'Panel de Control',
    alertas:      'Sistema de Alertas',
    factores:     'Factores de Riesgo',
    calculadora:  'Calculadora de Riesgo',
    modelo:       'Rendimiento del Modelo',
    permanencia:  'Permanencia'
  };
  $('#topbar-title').textContent = titles[page] || page;

  if (page==='dashboard')   { applyFilters(); renderDashboard(); }
  if (page==='alertas')     { applyFilters(); renderTable(); }
  if (page==='factores')    renderFactores();
  if (page==='modelo')      renderModelo();
  if (page==='permanencia') renderAcreditacion();
}

/* ============================================================
   INIT
   ============================================================ */
function init() {
  State.students = STUDENTS;
  applyFilters();
  setupNav();
  setupSidebarFilters();
  setupSearch();
  setupDetail();
  setupAcreditacion();
  navigate('dashboard');
  hideLoading();
}
function showLoading() { const e=$('#loading'); if(e) e.style.display='flex'; }
function hideLoading()  { const e=$('#loading'); if(e) e.style.display='none'; }

/* ============================================================
   SETUP
   ============================================================ */
function setupNav() {
  $$('.nav-item[data-page]').forEach(el => {
    el.addEventListener('click', () => navigate(el.dataset.page));
  });
}

function setupSidebarFilters() {
  ['#filt-facultad','#filt-modalidad','#filt-cohorte','#filt-zona'].forEach(sel => {
    const el = $(sel);
    if (!el) return;
    el.addEventListener('change', () => {
      State.filters.facultad  = $('#filt-facultad')?.value  || '';
      State.filters.modalidad = $('#filt-modalidad')?.value || '';
      State.filters.cohorte   = $('#filt-cohorte')?.value   || '';
      State.filters.zona      = $('#filt-zona')?.value      || '';
      State.table.page = 1;
      CF.clear();
      applyFilters();
      if (State.page==='dashboard') renderDashboard();
      if (State.page==='alertas')   renderTable();
    });
  });

  $('#btn-reset-filters')?.addEventListener('click', () => {
    ['#filt-facultad','#filt-modalidad','#filt-cohorte','#filt-zona'].forEach(s => {
      const el=$(s); if(el) el.value='';
    });
    State.filters = { facultad:'', modalidad:'', cohorte:'', zona:'' };
    State.table.page = 1;
    CF.clear();
    applyFilters();
    if (State.page==='dashboard') renderDashboard();
    if (State.page==='alertas')   renderTable();
  });
}

function setupSearch() {
  const s = $('#search-input');
  if (!s) return;
  let timer;
  s.addEventListener('input', () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      State.table.search = s.value.trim().toLowerCase();
      State.table.page = 1;
      applyFilters();
      renderTable();
    }, 250);
  });
}

function setupDetail() {
  $('#overlay-backdrop')?.addEventListener('click', closeDetail);
  $('#detail-close')?.addEventListener('click', closeDetail);
}

/* ============================================================
   FILTROS BASE (barra lateral)
   ============================================================ */
function applyFilters() {
  const f = State.filters;
  const q = State.table.search;
  State.filteredStudents = State.students.filter(s => {
    if (f.facultad  && s.fac !== f.facultad) return false;
    if (f.modalidad && MOD_FULL[s.mod] !== f.modalidad) return false;
    if (f.cohorte   && String(s.coh) !== f.cohorte) return false;
    if (f.zona      && s.z !== f.zona) return false;
    if (q) {
      const hay = (s.car+' '+s.fac+' '+s.id+' '+s.per).toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

function baseStudents() {
  const hasSideFilter = State.filters.facultad || State.filters.modalidad || State.filters.cohorte || State.filters.zona || State.table.search;
  return hasSideFilter ? State.filteredStudents : State.students;
}

/* ============================================================
   DASHBOARD
   ============================================================ */
function renderDashboard() {
  renderDashboardCharts();
  renderCFChip();
}

/*
  Regla de cross-filtering (igual que PowerBI / Tableau):
  - El grafico "fuente" (dimension == CF.active.type) muestra TODOS sus datos
    con resaltado del elemento seleccionado y dimming de los demas.
  - Los graficos "destino" (dimension != CF.active.type) filtran sus datos
    realmente con CF.apply() y muestran solo lo que corresponde al filtro.
*/
function cfDataFor(base, ownDimension) {
  if (!CF.active || CF.active.type === ownDimension) return base;
  return CF.apply(base);
}

function renderDashboardCharts() {
  const base = baseStudents();
  // KPIs siempre reflejan el filtro completo (CF + sidebar)
  const sts = CF.apply(base);

  const total = sts.length;
  const alto  = sts.filter(s => s.z==='A').length;
  const medio = sts.filter(s => s.z==='M').length;
  const bajo  = sts.filter(s => s.z==='B').length;
  const deser = sts.filter(s => s.y===1).length;

  $('#kpi-total').textContent = fmt(total);
  $('#kpi-alto').textContent  = total ? fmtPct(alto/total*100) : '—';
  $('#kpi-medio').textContent = total ? fmtPct(medio/total*100) : '—';
  $('#kpi-bajo').textContent  = total ? fmtPct(bajo/total*100) : '—';
  $('#kpi-auc').textContent   = '0.8461';
  $('#kpi-alto-n').textContent  = `${fmt(alto)} estudiantes`;
  $('#kpi-medio-n').textContent = `${fmt(medio)} estudiantes`;
  $('#kpi-bajo-n').textContent  = `${fmt(bajo)} estudiantes`;
  $('#kpi-deser').textContent   = total ? `${fmtPct(deser/total*100)} desercion real` : '';

  renderDonut(base);
  renderCohorteChart(base);
  renderCarreraChart(base);
  renderInsights(alto, medio, bajo, total, sts);
}

/* ============================================================
   CHART: DONUT con cross-filter
   - Si CF es de otra dimension: muestra distribucion de zonas
     SOLO para los datos filtrados por CF (cross-filter real).
   - Si CF es de zona: muestra todos los datos con resaltado
     del segmento seleccionado (el grafico "fuente").
   ============================================================ */
function renderDonut(base) {
  destroyChart('donut');
  const ctx = $('#chart-donut');
  if (!ctx) return;

  const zones      = ['A','M','B'];
  const labels     = ['Riesgo Alto','Riesgo Medio','Riesgo Bajo'];
  const baseColors = ['#dc2626','#d97706','#16a34a'];

  // Si CF es de otra dimension: filtrar datos realmente
  const sts = cfDataFor(base, 'zona');
  const data = zones.map(z => sts.filter(s => s.z===z).length);

  // Si CF es de zona: resaltar seleccionado, atenuar resto
  const bgColors = baseColors.map((c, i) => {
    if (!CF.active || CF.active.type !== 'zona') return c;
    return CF.isActive('zona', zones[i]) ? c : c + '40';
  });
  const borderW = zones.map(z => CF.isActive('zona', z) ? 5 : 2);

  State.charts.donut = new Chart(ctx, {
    type: 'doughnut',
    data: {
      labels,
      datasets: [{ data, backgroundColor: bgColors, borderColor:'#fff', borderWidth: borderW, hoverOffset: 8 }]
    },
    options: {
      responsive: true, cutout:'68%',
      plugins: {
        legend: { position:'bottom', labels:{padding:14,font:{size:12},usePointStyle:true,pointStyleWidth:10} },
        tooltip: { callbacks: { label: c => {
          const tot = c.dataset.data.reduce((a,b)=>a+b,0);
          const pct = tot ? (c.parsed/tot*100).toFixed(1) : 0;
          return ` ${c.label}: ${fmt(c.parsed)} (${pct}%)`;
        }}}
      },
      onClick(e, els) {
        if (!els.length) return;
        const z   = zones[els[0].index];
        const lbl = labels[els[0].index];
        setTimeout(() => CF.set('zona', z, lbl), 0);
      }
    }
  });
  ctx.style.cursor = 'pointer';
}

/* ============================================================
   CHART: COHORTES con cross-filter
   - Si CF es de otra dimension: filtra datos realmente.
   - Si CF es de cohorte: muestra todas con resaltado.
   ============================================================ */
function renderCohorteChart(base) {
  destroyChart('cohorte');
  const ctx = $('#chart-cohorte');
  if (!ctx) return;

  const cohs   = [8, 9, 10];
  const labels = cohs.map(c => DATOS_COHORTE.find(d => d.coh===c)?.per || `C${c}`);

  // Si CF es de otra dimension: usar datos filtrados
  const sts = cfDataFor(base, 'cohorte');

  // Si CF es de cohorte: resaltar la seleccionada, atenuar resto
  const mkColor = (hex, coh) => {
    if (!CF.active || CF.active.type !== 'cohorte') return hex;
    return CF.isActive('cohorte', coh) ? hex : hex + '40';
  };

  State.charts.cohorte = new Chart(ctx, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        { label:'Riesgo Alto',  data: cohs.map(c => sts.filter(s=>s.coh===c&&s.z==='A').length), backgroundColor: cohs.map(c=>mkColor('#dc2626',c)), stack:'z' },
        { label:'Riesgo Medio', data: cohs.map(c => sts.filter(s=>s.coh===c&&s.z==='M').length), backgroundColor: cohs.map(c=>mkColor('#d97706',c)), stack:'z' },
        { label:'Riesgo Bajo',  data: cohs.map(c => sts.filter(s=>s.coh===c&&s.z==='B').length), backgroundColor: cohs.map(c=>mkColor('#16a34a',c)), stack:'z' }
      ]
    },
    options: {
      responsive:true,
      scales: { x:{stacked:true,grid:{display:false}}, y:{stacked:true,ticks:{font:{size:11}}} },
      plugins: {
        legend:{ position:'bottom', labels:{padding:12,font:{size:11},usePointStyle:true} },
        tooltip:{ callbacks:{ footer: items => {
          const c  = cohs[items[0].dataIndex];
          const n  = sts.filter(s=>s.coh===c).length;
          const dr = sts.filter(s=>s.coh===c&&s.y===1).length;
          return `Total: ${fmt(n)} | Deser. real: ${n?fmtPct(dr/n*100):'—'}`;
        }}}
      },
      onClick(e, els) {
        if (!els.length) return;
        const c   = cohs[els[0].dataIndex];
        const per = DATOS_COHORTE.find(d=>d.coh===c)?.per || '';
        setTimeout(() => CF.set('cohorte', c, `Cohorte ${c} — ${per}`), 0);
      }
    }
  });
  ctx.style.cursor = 'pointer';
}

/* ============================================================
   CHART: CARRERAS con cross-filter
   - Si CF es de otra dimension: filtra datos realmente y
     recalcula el ranking de carreras con esos datos.
   - Si CF es de carrera: muestra todas con resaltado.
   ============================================================ */
function renderCarreraChart(base) {
  destroyChart('carrera');
  const ctx = $('#chart-carrera');
  if (!ctx) return;

  // Si CF es de otra dimension: usar datos filtrados
  const sts = cfDataFor(base, 'carrera');

  const byCarrera = {};
  sts.forEach(s => {
    if (!byCarrera[s.car]) byCarrera[s.car] = {alto:0, medio:0, bajo:0, n:0, fac:s.fac};
    byCarrera[s.car][s.z==='A'?'alto': s.z==='M'?'medio':'bajo']++;
    byCarrera[s.car].n++;
  });

  // Cuando CF es de carrera, usamos base completo para calcular el orden
  // pero mostramos todos con resaltado
  const sortSource = byCarrera;
  const sorted = Object.entries(sortSource)
    .map(([car, d]) => ({car, pctAlto: d.n ? d.alto/d.n*100 : 0, ...d}))
    .sort((a, b) => b.pctAlto - a.pctAlto)
    .slice(0, 15);

  // Si CF es de carrera: resaltar seleccionada, atenuar resto
  const mkColor = (hex, car) => {
    if (!CF.active || CF.active.type !== 'carrera') return hex;
    return CF.isActive('carrera', car) ? hex : hex + '35';
  };

  State.charts.carrera = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: sorted.map(d => d.car.length>38 ? d.car.slice(0,38)+'…' : d.car),
      datasets: [
        { label:'Alto',  data: sorted.map(d=>d.alto),  backgroundColor: sorted.map(d=>mkColor('#dc2626',d.car)) },
        { label:'Medio', data: sorted.map(d=>d.medio), backgroundColor: sorted.map(d=>mkColor('#d97706',d.car)) },
        { label:'Bajo',  data: sorted.map(d=>d.bajo),  backgroundColor: sorted.map(d=>mkColor('#16a34a',d.car)) }
      ]
    },
    options: {
      indexAxis:'y', responsive:true,
      scales: {
        x:{stacked:true, ticks:{font:{size:10}}},
        y:{stacked:true, ticks:{font:{size:10}}}
      },
      plugins: {
        legend:{position:'top', labels:{font:{size:11},usePointStyle:true}},
        tooltip:{ callbacks:{
          label: c => {
            const d = sorted[c.dataIndex];
            const pct = d.n ? (c.parsed.x/d.n*100).toFixed(1)+'%' : '—';
            return ` ${c.dataset.label}: ${fmt(c.parsed.x)} (${pct})`;
          },
          footer: items => `Total carrera: ${fmt(sorted[items[0].dataIndex].n)}`
        }}
      },
      onClick(e, els) {
        if (!els.length) return;
        const car = sorted[els[0].index].car;
        setTimeout(() => CF.set('carrera', car, car), 0);
      }
    }
  });
  ctx.style.cursor = 'pointer';
}

/* ============================================================
   INSIGHTS
   ============================================================ */
function renderInsights(alto, medio, bajo, total, base) {
  const topCar = DATOS_CARRERA[0];
  const pctAlto = total ? (alto/total*100).toFixed(1) : 0;
  const pctDeser = total ? (base.filter(s=>s.y===1).length/total*100).toFixed(1) : 0;

  const el = $('#insights-container');
  if (!el) return;
  el.innerHTML = `
    <div class="insight-card danger">
      <div class="insight-icon"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg></div>
      <div class="insight-content">
        <h4>${pctAlto}% en Riesgo Alto</h4>
        <p>${fmt(alto)} estudiantes con score &ge; 50%. Desercion real en este grupo: <strong>66%</strong> (1 de cada 2 deserta confirmado).</p>
      </div>
    </div>
    <div class="insight-card warn">
      <div class="insight-icon"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg></div>
      <div class="insight-content">
        <h4>Carrera con mayor riesgo</h4>
        <p><strong>${topCar.car}</strong>: ${topCar.pctA}% en riesgo alto. Desercion real: ${topCar.dr}%. Requiere intervencion institucional urgente.</p>
      </div>
    </div>
    <div class="insight-card info">
      <div class="insight-icon"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg></div>
      <div class="insight-content">
        <h4>Factor protector dominante</h4>
        <p>El <strong>promedio del 1er periodo</strong> es mas de 8 veces mas importante que el siguiente predictor. Cada 10 puntos adicionales reducen 6.4 pp la desercion.</p>
      </div>
    </div>
    <div class="insight-card success">
      <div class="insight-icon"><svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg></div>
      <div class="insight-content">
        <h4>Modelo Ensemble: AUC 0.8461</h4>
        <p>Combinacion LR+RF+XGBoost. Identifica correctamente al <strong>68.7% de los desertores</strong>. Brier=0.164. Entrenado en 41,334 est., evaluado en 28,375.</p>
      </div>
    </div>
  `;
}

/* ============================================================
   TABLA DE ALERTAS
   ============================================================ */
function renderTable() {
  const base = baseStudents();
  const withCF = CF.apply(base);

  let data = [...withCF];
  const { sort, dir } = State.table;
  data.sort((a,b) => {
    let va=a[sort], vb=b[sort];
    if (typeof va==='string') { va=va.toLowerCase(); vb=vb.toLowerCase(); }
    if (va<vb) return dir==='asc'?-1:1;
    if (va>vb) return dir==='asc'?1:-1;
    return 0;
  });

  const total = data.length;
  const totalPages = Math.ceil(total/State.table.pageSize) || 1;
  const start = (State.table.page-1)*State.table.pageSize;
  const slice = data.slice(start, start+State.table.pageSize);

  const info = $('#table-info');
  if (info) info.innerHTML = `Mostrando <strong>${fmt(start+1)}–${fmt(Math.min(start+State.table.pageSize,total))}</strong> de <strong>${fmt(total)}</strong> estudiantes`;

  const tbody = $('#students-tbody');
  if (!tbody) return;

  if (!slice.length) {
    tbody.innerHTML = `<tr><td colspan="9"><div class="empty-state"><div class="icon"><svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg></div><p>Sin resultados con los filtros actuales.</p></div></td></tr>`;
    renderPagination(totalPages, total);
    return;
  }

  tbody.innerHTML = slice.map(s => {
    const scoreBar = `<div class="score-bar-wrap">
      <span class="td-score" style="color:${zoneColor(s.z)}">${(s.sc*100).toFixed(1)}%</span>
      <div class="score-bar"><div class="score-bar-fill" style="width:${(s.sc*100).toFixed(0)}%;background:${zoneColor(s.z)}"></div></div>
    </div>`;
    const prom = s.prom!=null ? `<span style="font-weight:600;color:${s.prom<7?'var(--risk-high)':'var(--risk-low)'}">${s.prom.toFixed(1)}</span>` : '-';
    const yBadge = s.y===1
      ? '<span style="color:var(--risk-high);font-size:11px;font-weight:700;">Desertor</span>'
      : s.y===0
        ? '<span style="color:var(--risk-low);font-size:11px;">Permanente</span>'
        : '<span style="color:#94a3b8;font-size:11px;">Activo</span>';
    return `<tr style="cursor:pointer" onclick="openDetail(${s.id})">
      <td class="td-id">${s.id}</td>
      <td style="max-width:190px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;font-size:12px" title="${s.car}">${s.car}</td>
      <td><span style="font-size:11px;padding:2px 6px;background:#f1f5f9;border-radius:4px">${s.fac}</span></td>
      <td style="font-size:12px">${modLabel(s.mod)}</td>
      <td style="font-size:12px;white-space:nowrap">C-${s.coh}</td>
      <td>${prom}</td>
      <td>${scoreBar}</td>
      <td>${zonaBadge(s.z)}</td>
      <td>${yBadge}</td>
    </tr>`;
  }).join('');

  renderPagination(totalPages, total);

  $$('th[data-sort]').forEach(th => {
    th.onclick = () => {
      const key = th.dataset.sort;
      if (State.table.sort===key) State.table.dir = State.table.dir==='asc'?'desc':'asc';
      else { State.table.sort=key; State.table.dir='desc'; }
      State.table.page = 1;
      renderTable();
      $$('th[data-sort]').forEach(t => { t.classList.remove('sorted'); t.querySelector('.sort-icon').textContent='↕'; });
      th.classList.add('sorted');
      th.querySelector('.sort-icon').textContent = State.table.dir==='asc'?'↑':'↓';
    };
  });
}

function renderPagination(totalPages, total) {
  const { page } = State.table;
  const el = $('#pagination');
  if (!el) return;
  $('#page-current').textContent = page;

  const range = [], delta = 2;
  for (let i=1; i<=totalPages; i++) {
    if (i===1 || i===totalPages || (i>=page-delta && i<=page+delta)) range.push(i);
    else if (range[range.length-1]!=='…') range.push('…');
  }

  el.innerHTML = `
    <button class="page-btn" onclick="goPage(${page-1})" ${page<=1?'disabled':''}>&#8249;</button>
    ${range.map(p => p==='…' ? `<span style="padding:5px 4px;color:#94a3b8">…</span>`
      : `<button class="page-btn ${p===page?'active':''}" onclick="goPage(${p})">${p}</button>`).join('')}
    <button class="page-btn" onclick="goPage(${page+1})" ${page>=totalPages?'disabled':''}>&#8250;</button>
  `;
}

function goPage(p) {
  const max = Math.ceil(State.filteredStudents.length/State.table.pageSize) || 1;
  State.table.page = Math.max(1, Math.min(p, max));
  renderTable();
}

/* ============================================================
   DETAIL PANEL
   ============================================================ */
function openDetail(id) {
  const s = State.students.find(st => st.id==id);
  if (!s) return;
  const zc = ZONAS_CONFIG[s.z];
  const ac = ACCIONES_ZONA[s.z];
  const zClass = s.z==='A'?'alto': s.z==='M'?'medio':'bajo';

  const rows = [
    ['ID Inscripcion', s.id], ['Carrera', s.car], ['Facultad', s.fac],
    ['Modalidad', modLabel(s.mod)], ['Cohorte', `Cohorte ${s.coh} (${s.per})`],
    ['Sexo', sexLabel(s.sex)], ['Edad al ingreso', `${s.edad} anos`],
    ['Promedio 1er periodo', s.prom!=null ? s.prom.toFixed(2)+' / 10' : '-'],
    ['Tutorias en t1', s.tut], ['Estado de gratuidad', gratLabel(s.grat)],
    ['Estado civil', eciLabel(s.eciv)],
    ['Duracion carrera', s.off===4?'8 semestres':'10 semestres'],
    ['Resultado real', s.y===1 ? 'Desertor (confirmado)' : s.y===0 ? 'Permanente (confirmado)' : 'Activo (cohorte en curso)']
  ];

  const body = $('#detail-body');
  if (!body) return;
  body.innerHTML = `
    <div style="text-align:center;padding:20px 0 16px">
      <div class="result-circle" style="border-color:${zc.color};background:${zc.bg}">
        <span class="result-pct" style="color:${zc.color}">${(s.sc*100).toFixed(1)}%</span>
        <span class="result-pct-label" style="color:${zc.color}">score</span>
      </div>
      <div class="result-zone-label" style="color:${zc.color}">RIESGO ${zc.label}</div>
      <div class="result-zone-desc">${zc.umbral} &bull; Tasa real grupo: ${zc.tasa_real}</div>
    </div>
    <div style="margin:0 0 16px">
      ${rows.map(([k,v]) => `<div class="detail-row"><span class="detail-key">${k}</span><span class="detail-val">${v}</span></div>`).join('')}
    </div>
    <div style="background:${zc.bg};border-radius:8px;padding:14px;border:1px solid ${zc.border}">
      <div style="font-size:12px;font-weight:700;color:${zc.color};margin-bottom:8px">Acciones recomendadas</div>
      <ul class="action-list actions-${zClass}">
        ${ac.map(a => `<li class="action-item">${a}</li>`).join('')}
      </ul>
    </div>
  `;
  $('#detail-zone').textContent = `Riesgo ${zc.label}`;
  $('#detail-zone').style.color = zc.color;
  $('#detail-name').textContent = `ID: ${s.id}`;
  $('#detail-panel').classList.add('open');
  $('#overlay-backdrop').classList.add('open');
}

function closeDetail() {
  $('#detail-panel').classList.remove('open');
  $('#overlay-backdrop').classList.remove('open');
}

/* ============================================================
   FACTORES
   ============================================================ */
function renderFactores() {
  renderForestPlot();
  renderAMETable();
  renderImportanciaChart();
}

function renderForestPlot() {
  const el = $('#forest-container');
  if (!el) return;
  const minHR=0.60, maxHR=1.40, rng=maxHR-minHR;
  const sorted = [...DATOS_HR].sort((a,b) => b.hr-a.hr);

  el.innerHTML = sorted.map(d => {
    const pc  = (d.hr  - minHR)/rng*100;
    const plb = (d.lb  - minHR)/rng*100;
    const pub = (d.ub  - minHR)/rng*100;
    const col = d.dir==='riesgo' ? '#dc2626' : '#16a34a';
    const op  = d.sig ? 1 : 0.4;
    return `<div class="factor-row">
      <div class="factor-name">${d.v}${!d.sig?'<br><span class="sig">(no sig.)</span>':''}</div>
      <div class="factor-bar-area">
        <div class="null-line"></div>
        <div class="hr-ci-line" style="left:${plb}%;width:${pub-plb}%;background:${col};opacity:${op};top:50%;transform:translateY(-50%)"></div>
        <div class="hr-dot" style="left:${pc}%;background:${col};opacity:${op}"></div>
      </div>
      <div class="factor-hr-val" style="color:${col};opacity:${op}">HR=${d.hr.toFixed(2)}</div>
      <div class="factor-dir">${d.dir==='riesgo'
        ? '<span class="badge badge-alto" style="font-size:10px">Riesgo</span>'
        : '<span class="badge badge-bajo" style="font-size:10px">Protector</span>'}</div>
    </div>`;
  }).join('');
}

function renderAMETable() {
  const tbody = $('#ame-tbody');
  if (!tbody) return;
  tbody.innerHTML = DATOS_AME.map(d => {
    const cls = d.ame>0 ? 'ame-pos' : 'ame-neg';
    const arrow = d.ame>0
      ? '<svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle"><line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/></svg>'
      : '<svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle"><line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/></svg>';
    return `<tr>
      <td>${d.v}</td>
      <td class="${cls}" style="text-align:center">${arrow} ${d.ame>0?'+':''}${d.ame.toFixed(1)} pp</td>
      <td style="text-align:center"><span style="background:#f0fdf4;color:#16a34a;padding:2px 8px;border-radius:4px;font-size:11px;font-weight:700">${d.p}</span></td>
      <td style="font-size:12px;color:#64748b">${d.nota}</td>
    </tr>`;
  }).join('');
}

function renderImportanciaChart() {
  destroyChart('importancia');
  const ctx = $('#chart-importancia');
  if (!ctx) return;
  const colores = { Academico:'#1c3247', Institucional:'#3c7aa0', Sociodemografico:'#ea7d06', 'Personal-Social':'#16A085' };
  State.charts.importancia = new Chart(ctx, {
    type:'bar',
    data: {
      labels: IMPORTANCIA_VARS.map(d=>d.v),
      datasets:[{ label:'Importancia relativa (Ensemble, %)', data:IMPORTANCIA_VARS.map(d=>d.imp),
        backgroundColor:IMPORTANCIA_VARS.map(d=>colores[d.tipo]||'#94a3b8'), borderRadius:4 }]
    },
    options:{
      indexAxis:'y', responsive:true,
      scales:{ x:{max:105,ticks:{callback:v=>v+'%'}}, y:{ticks:{font:{size:11}}} },
      plugins:{ legend:{display:false}, tooltip:{callbacks:{
        label: ctx => ` ${ctx.parsed.x.toFixed(1)}% | Tipo: ${IMPORTANCIA_VARS[ctx.dataIndex].tipo}`
      }}}
    }
  });
}

/* ============================================================
   MODELO
   ============================================================ */
function renderModelo() {
  const tbody = $('#metrics-tbody');
  if (!tbody) return;

  const bests = {};
  ['auc','prauc','sens','espec','ppv','npv','f1'].forEach(k => bests[k] = Math.max(...METRICAS_MODELOS.map(m=>m[k])));
  bests.brier = Math.min(...METRICAS_MODELOS.map(m=>m.brier));

  tbody.innerHTML = METRICAS_MODELOS.map(m => {
    const champ = m.campeon ? '<span class="champion-badge"><svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:middle;margin-right:3px"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89 17 22l-5-3-5 3 1.523-9.11"/></svg>Campeon</span>' : '';
    const rowCls = m.campeon ? 'champion-row' : '';
    const cell = (k, val, higher=true, dec=3) => {
      const isBest = Math.abs(val - bests[k]) < 0.0001;
      return `<td style="text-align:center;${isBest?'font-weight:800;color:var(--unemi-blue2)':''}">${val.toFixed(dec)}</td>`;
    };
    return `<tr class="${rowCls}">
      <td>${m.modelo} ${champ}</td>
      ${cell('auc',m.auc)}${cell('prauc',m.prauc)}${cell('sens',m.sens)}
      ${cell('espec',m.espec)}${cell('ppv',m.ppv)}${cell('npv',m.npv)}
      ${cell('f1',m.f1)}${cell('brier',m.brier,false)}
    </tr>`;
  }).join('');

  renderROCChart();
}

function renderROCChart() {
  destroyChart('roc');
  const ctx = $('#chart-roc');
  if (!ctx) return;
  const pts = n => Array.from({length:n+1},(_,i)=>i/n);
  const rocCurve = (auc,n=60) => {
    const x=pts(n), t=2*auc-1;
    return { x, y: x.map(xi => t>=0 ? Math.pow(xi,1-t) : Math.pow(xi,1+Math.abs(t))) };
  };
  const colors=['#335f7f','#fc7e00','#16a34a','#9333ea'];
  const dashes=[[],[5,3],[2,2],[4,2,1,2]];

  const datasets = METRICAS_MODELOS.map((m,i) => {
    const {x,y} = rocCurve(m.auc);
    return {
      label: `${m.modelo} (AUC = ${m.auc})`,
      data: x.map((xi,j) => ({x:xi, y:y[j]})),
      showLine: true,
      borderColor: colors[i],
      borderWidth: m.campeon ? 3 : 1.5,
      borderDash: dashes[i],
      backgroundColor: colors[i] + '20',
      fill: false,
      pointRadius: 0,
      pointHoverRadius: 4,
      tension: 0.3
    };
  });
  datasets.push({
    label: 'Clasificador aleatorio (AUC = 0.50)',
    data: [{x:0,y:0},{x:1,y:1}],
    showLine: true,
    borderColor: '#cbd5e1',
    borderWidth: 1.5,
    borderDash: [6,4],
    fill: false,
    pointRadius: 0
  });

  State.charts.roc = new Chart(ctx, {
    type: 'scatter',
    data: { datasets },
    options: {
      responsive: true,
      maintainAspectRatio: true,
      scales: {
        x: {
          min: 0, max: 1,
          title: { display: true, text: '1 - Especificidad  (Tasa de Falsos Positivos)', font:{size:11} },
          ticks: { stepSize: 0.2, callback: v => (v*100).toFixed(0)+'%' },
          grid: { color: '#f1f5f9' }
        },
        y: {
          min: 0, max: 1,
          title: { display: true, text: 'Sensibilidad  (Tasa de Verdaderos Positivos)', font:{size:11} },
          ticks: { stepSize: 0.2, callback: v => (v*100).toFixed(0)+'%' },
          grid: { color: '#f1f5f9' }
        }
      },
      plugins: {
        legend: {
          position: 'bottom',
          labels: { font:{size:11}, usePointStyle:true, padding:14 }
        },
        tooltip: {
          callbacks: {
            label: ctx => {
              const x = (ctx.parsed.x*100).toFixed(1);
              const y = (ctx.parsed.y*100).toFixed(1);
              return ` ${ctx.dataset.label}  |  FPR: ${x}%  TPR: ${y}%`;
            }
          }
        }
      }
    }
  });
}

/* ============================================================
   CALCULADORA (usa umbrales del Ensemble)
   ============================================================ */
function calcScore() {
  // Aproximacion lineal: score mediano de la carrera (Ensemble) + ajustes AME
  // del modelo cloglog (Tabla 6, horizonte completo). Solo factores con efecto
  // significativo: promedio t1, modalidad, sexo, estado civil y cohorte.
  // Constantes = AME/100 (promedio: AME por 10 pts de 0-100 = 1 pt de 0-10).
  const car   = $('#calc-carrera')?.value || '';
  const mod   = /semipr/i.test(car) ? 'SEMIPRESENCIAL' : /presencial|pres\./i.test(car) ? 'PRESENCIAL' : 'EN LINEA';
  const coh   = parseInt($('#calc-cohorte')?.value || '10');
  const prom  = parseFloat($('#calc-prom')?.value);
  const sex   = $('#calc-sexo')?.value || 'F';
  const eciv  = $('#calc-eciv')?.value || 'S';

  if (isNaN(prom) || prom < 0 || prom > 10) {
    alert('Ingrese un promedio valido entre 0 y 10.');
    return;
  }

  let score = SCORING_CARRERA[car] ?? 0.38;

  score += -(prom - 7) * 0.060;      // AME promedio: -6.0 pp por 10 pts (0-100)

  if (mod==='PRESENCIAL')     score -= 0.030;  // AME -3.0 pp
  if (mod==='SEMIPRESENCIAL') score -= 0.053;  // AME -5.3 pp
  if (sex==='F')  score -= 0.034;              // AME -3.4 pp
  if (eciv==='S') score += 0.037;              // AME +3.7 pp

  score += (coh - 10) * 0.017;                 // AME +1.65 pp por cohorte

  score = Math.max(0.02, Math.min(0.97, score));

  const zona = score>=0.50 ? 'A' : score>=0.25 ? 'M' : 'B';
  const zc = ZONAS_CONFIG[zona];
  const ac = ACCIONES_ZONA[zona];
  const zClass = zona==='A'?'alto':zona==='M'?'medio':'bajo';

  $('#result-score').textContent = (score*100).toFixed(1)+'%';
  $('#result-score').style.color = zc.color;
  $('#result-pct-label').style.color = zc.color;
  const circle = $('#result-circle');
  circle.style.borderColor = zc.color;
  circle.style.background  = zc.bg;
  $('#result-zone-label').textContent = 'Riesgo '+zc.label;
  $('#result-zone-label').style.color = zc.color;
  $('#result-zone-desc').textContent  = zc.umbral+' • Tasa real en grupo: '+zc.tasa_real;

  const needle = $('#gauge-needle');
  if (needle) needle.style.left = (score*100)+'%';

  const actEl = $('#calc-actions');
  if (actEl) {
    actEl.className = `action-list actions-${zClass}`;
    actEl.innerHTML = ac.map(a=>`<li class="action-item">${a}</li>`).join('');
  }

  $('#calc-result-panel').style.display = 'block';
  $('#calc-actions-container').style.display = 'block';
}

function resetCalc() {
  $('#calc-form').reset();
  $('#calc-result-panel').style.display = 'none';
  $('#calc-actions-container').style.display = 'none';
}

/* ============================================================
   EXPORT CSV
   ============================================================ */
function exportCSV() {
  const data = CF.apply(baseStudents());
  if (!data.length) { alert('No hay datos para exportar.'); return; }
  const headers = ['ID','Carrera','Facultad','Modalidad','Cohorte','Periodo','Sexo','Edad','Promedio_t1','Gratuidad','Estado_civil','Score_riesgo','Zona_riesgo','Desertor_real'];
  const rows = data.map(s => [
    s.id, `"${s.car}"`, s.fac, modLabel(s.mod), s.coh, `"${s.per}"`,
    sexLabel(s.sex), s.edad, s.prom, gratLabel(s.grat), eciLabel(s.eciv),
    s.sc.toFixed(4), ZONAS_CONFIG[s.z].label, s.y===1?'Si':'No'
  ]);
  const csv = [headers.join(','), ...rows.map(r=>r.join(','))].join('\r\n');
  const blob = new Blob(['﻿'+csv], {type:'text/csv;charset=utf-8'});
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url; a.download = `alertas_sat_unemi_${new Date().toISOString().slice(0,10)}.csv`;
  a.click(); URL.revokeObjectURL(url);
}

/* ============================================================
   PERMANENCIA (Acreditacion)
   ============================================================ */
function setupAcreditacion() {
  const facultades = [...new Set(PERMANENCIA_DATA.map(d => d.fac))].sort();

  const selFac = $('#perm-filtro-facultad');
  const selCoh = $('#perm-filtro-cohorte');
  const selCar = $('#perm-filtro-carrera');
  if (!selFac || !selCoh || !selCar) return;

  facultades.forEach(f => selFac.add(new Option(f, f)));
  actualizarCarrerasCohortes();

  selFac.addEventListener('change', () => {
    selCar.value = '';
    selCoh.value = '';
    actualizarCarrerasCohortes();
    renderAcreditacion();
  });
  selCar.addEventListener('change', () => {
    actualizarCohortes();
    renderAcreditacion();
  });
  selCoh.addEventListener('change', renderAcreditacion);
  $('#perm-export-btn')?.addEventListener('click', exportAcreditacionCSV);
}

function actualizarCarrerasCohortes() {
  const selFac = $('#perm-filtro-facultad');
  const selCar = $('#perm-filtro-carrera');
  const fac = selFac?.value || '';

  const carrerasValidas = [...new Set(
    PERMANENCIA_DATA.filter(d => !fac || d.fac === fac).map(d => d.car)
  )].sort();

  const carActual = selCar.value;
  selCar.innerHTML = '<option value="">Todas las carreras</option>';
  carrerasValidas.forEach(c => selCar.add(new Option(c, c)));
  selCar.value = carrerasValidas.includes(carActual) ? carActual : '';

  actualizarCohortes();
}

function actualizarCohortes() {
  const selFac = $('#perm-filtro-facultad');
  const selCar = $('#perm-filtro-carrera');
  const selCoh = $('#perm-filtro-cohorte');
  const fac = selFac?.value || '';
  const car = selCar?.value || '';

  const cohortesValidas = [...new Set(
    PERMANENCIA_DATA
      .filter(d => (!fac || d.fac === fac) && (!car || d.car === car))
      .map(d => d.coh)
  )].sort((a,b) => a-b);

  const cohActual = selCoh.value;
  selCoh.innerHTML = '<option value="">Todas las cohortes</option>';
  cohortesValidas.forEach(c => selCoh.add(new Option('Cohorte ' + c, c)));
  selCoh.value = cohortesValidas.map(String).includes(cohActual) ? cohActual : '';
}

function getAcreditacionFiltrado() {
  const fac = $('#perm-filtro-facultad')?.value || '';
  const coh = $('#perm-filtro-cohorte')?.value  || '';
  const car = $('#perm-filtro-carrera')?.value  || '';

  return PERMANENCIA_DATA.filter(d =>
    (!fac || d.fac === fac) &&
    (!coh || String(d.coh) === coh) &&
    (!car || d.car === car)
  );
}

function renderAcreditacion() {
  const datos = getAcreditacionFiltrado();

  const totalN    = datos.reduce((s,d) => s + d.n, 0);
  const totalDeser = datos.reduce((s,d) => s + d.deser, 0);
  const totalPerm  = datos.reduce((s,d) => s + d.perm, 0);
  const tasaDeser  = totalN > 0 ? (totalDeser / totalN * 100).toFixed(1) : '0.0';
  const tasaPerm   = totalN > 0 ? (totalPerm  / totalN * 100).toFixed(1) : '0.0';

  const kpisEl = $('#perm-kpis');
  if (kpisEl) kpisEl.innerHTML = `
    <div class="kpi-card kpi-total">
      <div class="kpi-label">Inscripciones</div>
      <div class="kpi-value">${fmt(totalN)}</div>
    </div>
    <div class="kpi-card kpi-bajo">
      <div class="kpi-label">Permanentes</div>
      <div class="kpi-value">${fmt(totalPerm)}</div>
      <div class="kpi-detail">${tasaPerm}% del total</div>
    </div>
    <div class="kpi-card kpi-alto">
      <div class="kpi-label">Desertores</div>
      <div class="kpi-value">${fmt(totalDeser)}</div>
      <div class="kpi-detail">${tasaDeser}% del total</div>
    </div>
  `;

  const tbody = $('#perm-tbody');
  if (!tbody) return;

  if (!datos.length) {
    tbody.innerHTML = `<tr><td colspan="9"><div class="empty-state"><p>Sin resultados con los filtros actuales.</p></div></td></tr>`;
    return;
  }

  tbody.innerHTML = datos.map(d => {
    const tpColor = d.tp >= 70 ? 'var(--risk-low)' : d.tp >= 50 ? 'var(--risk-mid)' : 'var(--risk-high)';
    return `<tr>
      <td style="font-size:12px;max-width:200px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap" title="${d.car}">${d.car}</td>
      <td><span style="font-size:11px;padding:2px 6px;background:#f1f5f9;border-radius:4px">${d.fac}</span></td>
      <td style="font-size:12px">${modLabel(d.mod)}</td>
      <td style="font-size:12px;white-space:nowrap">C-${d.coh} (${d.per})</td>
      <td style="text-align:right">${fmt(d.n)}</td>
      <td style="text-align:right;color:var(--risk-low);font-weight:600">${fmt(d.perm)}</td>
      <td style="text-align:right;color:var(--risk-high)">${fmt(d.deser)}</td>
      <td style="text-align:right;font-weight:700;color:${tpColor}">${d.tp}%</td>
      <td style="text-align:right;color:var(--risk-high)">${d.td}%</td>
    </tr>`;
  }).join('');
}

function exportAcreditacionCSV() {
  const datos = getAcreditacionFiltrado();
  if (!datos.length) { alert('No hay datos para exportar.'); return; }
  const header = 'Carrera,Facultad,Modalidad,Cohorte,Periodo,Inscritos,Permanentes,Desertores,Tasa_Desercion,Tasa_Permanencia\n';
  const rows = datos.map(d =>
    `"${d.car}","${d.fac}","${modLabel(d.mod)}",${d.coh},"${d.per}",${d.n},${d.perm},${d.deser},${d.td},${d.tp}`
  ).join('\n');
  const blob = new Blob(['﻿' + header + rows], { type: 'text/csv;charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url;
  a.download = `permanencia_unemi_${new Date().toISOString().slice(0,10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

/* ============================================================
   HELPERS
   ============================================================ */
function destroyChart(key) {
  if (State.charts[key]) { State.charts[key].destroy(); delete State.charts[key]; }
}

/* ============================================================
   START
   ============================================================ */
window.addEventListener('DOMContentLoaded', () => { init(); });
