(function () {
  'use strict';
  const engine = TrellisCore.createEngine();
  const $ = id => document.getElementById(id);
  const arrow = '<svg class="inline-arrow" viewBox="0 0 16 16" aria-hidden="true"><path d="M3 13 13 3M4 3h9v9" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>';
  const esc = value => String(value).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
  let audience = 'General audience', toastTimer, highlightTimer;
  const featureContent = {
    governance: { icon: '◇', title: 'Control, by design', body: 'Permissions and review trails for every agent action.', tag: 'GOVERNANCE' },
    routing: { icon: '⇄', title: 'Work that flows', body: 'Route tasks between your agents, tools, and people.', tag: 'ORCHESTRATION' },
    developer: { icon: '⌘', title: 'Your stack, connected', body: 'A developer toolkit that fits the way you build.', tag: 'DEVELOPER TOOLS' }
  };
  function renderSection(section) {
    const p = section.props, id = section.id;
    if (section.type === 'hero') return '<section id="' + id + '" class="relay-hero"><div class="eyebrow">' + esc(p.eyebrow) + '</div><div class="hero-layout"><div><h2>' + esc(p.headline).replace(/\n/g, '<br>') + '</h2><p class="hero-description">' + esc(p.description) + '</p><a class="relay-cta" href="' + esc(p.ctaUrl) + '">' + esc(p.ctaText) + '<span>↗</span></a><div class="hero-note"><span>✦</span> ' + esc(p.note) + '</div></div><div class="workflow-art" aria-label="Illustration of coordinated agent workflows"><div class="art-top"><span><i></i> WORKSPACE</span><span>•••</span></div><div class="art-node source-node"><span class="node-icon">✳</span><div><strong>Your team</strong><small>One shared direction</small></div></div><div class="connector"><i></i><span>COORDINATE</span><i></i></div><div class="art-branches"><span>⌘<small>Build</small></span><span>✧<small>Agents</small></span><span>⇄<small>Tools</small></span></div><div class="art-result"><span>✓</span> Everything in sync <i></i></div><div class="floating-label">A little more flow. ↗</div></div></div></section>';
    if (section.type === 'features') return '<section id="' + id + '" class="relay-features"><div class="relay-section-heading"><h3>' + esc(p.title) + '</h3><p>' + esc(p.subtitle) + '</p></div><div class="feature-grid">' + p.priorities.map((key, i) => { const f = featureContent[key]; return '<article class="feature-card ' + (i === 0 ? 'priority-card' : '') + '"><div><span class="feature-icon">' + f.icon + '</span><span class="feature-index">0' + (i + 1) + '</span></div><span class="feature-tag">' + f.tag + '</span><h4>' + f.title + '</h4><p>' + f.body + '</p></article>'; }).join('') + '</div></section>';
    if (section.type === 'assurance') return '<section id="' + id + '" class="relay-assurance"><span class="assurance-icon">◇</span><div><h3>' + esc(p.title) + '</h3><p>' + esc(p.description) + '</p><details class="terms"><summary>Service & security notes</summary><p>' + esc(p.legalClaims) + '</p><p>' + esc(p.guarantees) + '</p></details></div><span class="assurance-arrow">↗</span></section>';
    if (section.type === 'pricing') return '<section id="' + id + '" class="relay-pricing"><div><span class="eyebrow">' + esc(p.label) + '</span><h3>' + esc(p.title) + '</h3><p>' + esc(p.description) + '</p></div><div class="price-block"><div class="price"><span>$</span><strong id="live-price">' + esc(p.amount) + '</strong><small> ' + esc(p.currency) + '</small></div><p>' + esc(p.billingTerms) + '</p><a href="' + esc(p.ctaUrl) + '">' + esc(p.ctaText) + ' ↗</a></div></section>';
    return '';
  }
  function format(value) {
    if (value === null) return 'Section removed';
    if (Array.isArray(value)) return value.join(' → ');
    if (typeof value === 'object') return JSON.stringify(value, null, 2);
    return String(value);
  }
  function fieldLabel(path) { return path === 'order' ? 'Section order' : path.replace(/^sections\./, '').replace('.props.', ' / '); }
  function renderDiff(changes) {
    return changes.map(change => {
      const gated = TrellisCore.evaluatePolicy([change]).status === 'HOLD';
      return '<div class="diff-row"><div class="diff-field"><code>' + esc(fieldLabel(change.path)) + '</code>' + (gated ? '<span class="protected-tag">PROTECTED</span>' : '') + '</div><div class="comparison"><div class="before"><span>BEFORE</span><p>' + esc(format(change.before)) + '</p></div><div class="after"><span>PROPOSED / AFTER</span><p>' + esc(format(change.after)) + '</p></div></div></div>';
    }).join('');
  }
  function time(iso) { return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }); }
  function update(event) {
    const state = engine.getState(), page = state.page;
    const pageChanged = !event || event.fromVersion !== event.toVersion;
    if (pageChanged) {
      $('website').innerHTML = page.order.map(id => renderSection(page.sections[id]).replaceAll('↗', arrow)).join('');
      if (event && event.scenario !== 'Rollback') audience = event.scenario === 'Discount Campaign' ? audience : event.scenario;
      if (event && event.action === 'rollback') audience = 'Restored approved state';
      $('audience-label').textContent = audience;
      $('page-version').textContent = 'PAGESPEC v' + page.version;
      if (event) {
        clearTimeout(highlightTimer);
        const ids = new Set(event.changes.filter(c => c.path.startsWith('sections.')).map(c => c.path.split('.')[1]));
        if (event.changes.some(c => c.path === 'order')) page.order.forEach(id => ids.add(id));
        ids.forEach(id => { const el = $(id); if (el) el.classList.add('changed-section'); });
        highlightTimer = setTimeout(() => document.querySelectorAll('.changed-section').forEach(el => el.classList.remove('changed-section')), 1500);
      }
    }
    $('metric-version').textContent = 'v' + page.version;
    $('metric-events').textContent = state.ledger.length;
    $('metric-pending').textContent = Object.keys(state.pending).length;
    $('rollback').disabled = state.history.length < 2;
    document.querySelectorAll('[data-scenario]').forEach(button => button.classList.toggle('selected', button.dataset.scenario === (event && ({ 'Enterprise Buyer': 'enterprise', 'Indie Developer': 'indie', 'Discount Campaign': 'discount' })[event.scenario])));
    $('pending-review').innerHTML = Object.values(state.pending).map(p => {
      const stale = p.baseVersion !== page.version;
      return '<section class="review-card"><div class="review-top"><span class="status-badge hold">HOLD</span><span>APPROVAL REQUIRED · BASE v' + p.baseVersion + '</span></div><h3>' + esc(p.scenario) + '</h3><p>' + (stale ? 'Version changed. This approval will be rejected as stale. Reject or replay the scenario.' : 'Protected pricing detected. The entire proposal is held; the live website is unchanged.') + '</p>' + renderDiff(p.changes) + '<div class="review-actions"><button class="approve-button" data-approve="' + p.id + '">✓ Approve proposal</button><button class="reject-button" data-reject="' + p.id + '">Reject</button></div></section>';
    }).join('');
    $('ledger').innerHTML = state.ledger.length ? state.ledger.slice().reverse().map((item, index) => {
      const resolved = item.status === 'HOLD' && !state.pending[item.id];
      const title = item.action === 'rollback' ? 'Previous state restored' : item.scenario;
      const subtitle = item.noOp ? 'No changes · version retained' : item.status === 'HOLD' ? (resolved ? 'Held proposal · review completed' : 'Held at the policy gate') : item.status === 'REJECTED' ? 'Page unchanged' : item.action === 'rollback' ? 'New version · history preserved' : item.changes.length + ' fields ' + (item.status === 'APPROVED' ? 'approved' : 'adapted automatically');
      return '<details class="ledger-event ' + item.status.toLowerCase() + '" ' + (index === 0 ? 'open' : '') + '><summary><span class="event-dot"></span><div class="event-title"><strong>' + esc(title) + '</strong><span>' + esc(subtitle) + '</span></div><div class="event-meta"><span class="status-badge ' + item.status.toLowerCase() + '">' + item.status + '</span><small>' + time(item.timestamp) + '</small></div><span class="expand-chevron">⌄</span></summary><div class="event-body"><div class="version-line"><span>v' + item.fromVersion + (item.toVersion !== item.fromVersion ? ' → v' + item.toVersion : ' · unchanged') + '</span><span>' + esc(item.id) + '</span></div><p class="event-reason">' + esc(item.reason) + '</p>' + (item.proposalReason ? '<p class="proposal-reason">Intent: ' + esc(item.proposalReason) + '</p>' : '') + renderDiff(item.changes) + '</div></details>';
    }).join('') : '<div class="ledger-empty"><div class="empty-illustration"><span>≡</span><i>✓</i></div><h3>A living page. A clear record.</h3><p>Choose a visitor above to watch the website adapt.<br>Every real modification will appear here.</p><div><span>01 Adapt</span><b>→</b><span>02 Hold</span><b>→</b><span>03 Approve</span><b>→</b><span>04 Rollback</span></div></div>';
    $('agent-json').textContent = JSON.stringify({ disclosure: 'Machine-readable preview. No live agent API.', version: page.version, pageSpec: page, propertyTypes: TrellisCore.schema, policy: { mode: 'deterministic', safe: 'Validated presentation-only changes auto-apply', protected: ['pricing amounts and currency', 'billing terms', 'legal claims', 'guarantees', 'CTA destination URLs', 'section deletion'], mixedProposal: 'held in entirety', invalid: 'rejected', approvals: 'must match current version' } }, null, 2);
    if (event) {
      const message = event.noOp ? 'Already up to date. No new version.' : event.status === 'HOLD' ? 'Proposal held. The live page has not changed.' : event.status === 'REJECTED' ? event.reason : event.action === 'rollback' ? 'Restored as v' + page.version + '. Full history retained.' : 'Published v' + page.version + ' · ' + event.changes.length + ' fields updated.';
      $('announcement').textContent = message; $('announcement').classList.add('visible');
      clearTimeout(toastTimer); toastTimer = setTimeout(() => $('announcement').classList.remove('visible'), 4200);
    }
  }
  document.querySelectorAll('[data-scenario]').forEach(button => button.addEventListener('click', () => update(engine.propose(button.dataset.scenario))));
  $('pending-review').addEventListener('click', event => {
    const approve = event.target.closest('[data-approve]'), reject = event.target.closest('[data-reject]');
    if (approve) update(engine.approve(approve.dataset.approve));
    if (reject) update(engine.reject(reject.dataset.reject));
  });
  $('rollback').addEventListener('click', () => update(engine.rollback()));
  $('reset-demo').addEventListener('click', () => $('reset-dialog').showModal());
  $('reset-dialog').addEventListener('close', () => { if ($('reset-dialog').returnValue === 'reset') { engine.reset(); audience = 'General audience'; update(); $('announcement').classList.remove('visible'); } });
  function showTab(agent) {
    $('agent-view').hidden = !agent; $('supervision-view').hidden = agent;
    $('agent-tab').classList.toggle('active', agent); $('ledger-tab').classList.toggle('active', !agent);
    $('agent-tab').setAttribute('aria-selected', agent); $('ledger-tab').setAttribute('aria-selected', !agent);
  }
  $('agent-tab').addEventListener('click', () => showTab(true));
  $('ledger-tab').addEventListener('click', () => showTab(false));
  document.querySelector('.dashboard-tabs').addEventListener('keydown', event => { if (event.key === 'ArrowRight' || event.key === 'ArrowLeft') { const agent = $('agent-view').hidden; showTab(agent); $(agent ? 'agent-tab' : 'ledger-tab').focus(); event.preventDefault(); } });
  $('download-json').addEventListener('click', () => { const url = URL.createObjectURL(new Blob([$('agent-json').textContent], { type: 'application/json' })); const link = document.createElement('a'); link.href = url; link.download = 'trellis-pagespec-v' + engine.getState().page.version + '.json'; link.click(); setTimeout(() => URL.revokeObjectURL(url), 1000); });
  document.querySelector('.relay-logo').innerHTML = arrow;
  document.querySelectorAll('.scenario-buttons b').forEach(el => { el.innerHTML = arrow; });
  update();
}());
