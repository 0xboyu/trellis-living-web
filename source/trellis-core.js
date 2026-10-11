(function (root, factory) {
  'use strict';
  var api = factory();
  if (typeof module === 'object' && module.exports) module.exports = api;
  else root.TrellisCore = api;
}(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  'use strict';
  const clone = value => JSON.parse(JSON.stringify(value));
  const equal = (a, b) => JSON.stringify(a) === JSON.stringify(b);
  const own = (obj, key) => Object.prototype.hasOwnProperty.call(obj, key);
  const featureIDs = ['governance', 'routing', 'developer'];
  const schema = {
    hero: { eyebrow: 'string', headline: 'string', description: 'string', ctaText: 'string', ctaUrl: 'url', note: 'string' },
    features: { title: 'string', subtitle: 'string', priorities: 'priorities' },
    assurance: { title: 'string', description: 'string', legalClaims: 'string', guarantees: 'string' },
    pricing: { title: 'string', description: 'string', amount: 'amount', currency: 'currency', billingTerms: 'string', ctaText: 'string', ctaUrl: 'url', label: 'string' }
  };
  const initialPage = {
    schemaVersion: 1, version: 1,
    order: ['hero', 'features', 'assurance', 'pricing'],
    sections: {
      hero: { id: 'hero', type: 'hero', props: { eyebrow: 'THE OPERATING SYSTEM FOR AI WORK', headline: 'Less busywork.\nMore momentum.', description: 'Bring your agents, tools, and team into one calm workspace. RelayOps turns scattered workflows into coordinated action.', ctaText: 'Start building', ctaUrl: '#pricing', note: 'Your workflows. Finally in sync.' } },
      features: { id: 'features', type: 'features', props: { title: 'One workspace. Every moving part.', subtitle: 'From your first workflow to your next big launch.', priorities: ['routing', 'developer', 'governance'] } },
      assurance: { id: 'assurance', type: 'assurance', props: { title: 'Move fast. Stay in control.', description: 'Give every workflow an owner, a clear permission boundary, and a trail you can follow.', legalClaims: 'Security documentation available on request.', guarantees: 'Service commitments are defined in your agreement.' } },
      pricing: { id: 'pricing', type: 'pricing', props: { title: 'A little structure. A lot of possibility.', description: 'The Team plan · one shared workspace', amount: 49, currency: 'USD', billingTerms: 'per workspace / month · billed monthly', ctaText: 'Explore the Team plan', ctaUrl: '#pricing', label: 'SIMPLE, PREDICTABLE PRICING' } }
    }
  };
  // AI-authored during development. No runtime inference or remote requests.
  const scenarios = {
    enterprise: { scenario: 'Enterprise Buyer', reason: 'Prioritize governance and coordinated operations for a larger team.', operations: [
      { op: 'set', path: 'sections.hero.props.eyebrow', value: 'BUILT FOR COMPLEXITY. DESIGNED FOR CONTROL.' },
      { op: 'set', path: 'sections.hero.props.headline', value: 'Your agents.\nUnder control.' },
      { op: 'set', path: 'sections.hero.props.description', value: 'Coordinate AI work across your organization with permission boundaries, reviewable actions, and a shared operational view.' },
      { op: 'set', path: 'sections.hero.props.ctaText', value: 'Explore enterprise' },
      { op: 'set', path: 'sections.hero.props.note', value: 'Built for teams with more at stake.' },
      { op: 'set', path: 'sections.features.props.title', value: 'Control comes first.' },
      { op: 'set', path: 'sections.features.props.subtitle', value: 'Governance, coordination, and developer tools. In that order.' },
      { op: 'set', path: 'sections.features.props.priorities', value: ['governance', 'routing', 'developer'] },
      { op: 'set', path: 'sections.assurance.props.title', value: 'A clear boundary for every agent.' },
      { op: 'set', path: 'sections.assurance.props.description', value: 'Review sensitive actions, assign accountable owners, and trace decisions across your organization.' },
      { op: 'set', path: 'order', value: ['hero', 'assurance', 'features', 'pricing'] }
    ] },
    indie: { scenario: 'Indie Developer', reason: 'Prioritize fast integration and a lightweight workflow for an independent builder.', operations: [
      { op: 'set', path: 'sections.hero.props.eyebrow', value: 'FOR THE TEAM OF ONE WITH A THOUSAND IDEAS' },
      { op: 'set', path: 'sections.hero.props.headline', value: 'Small team.\nBig shipping energy.' },
      { op: 'set', path: 'sections.hero.props.description', value: 'Connect your tools, route the repetitive work, and get back to what you love building. Your next launch starts here.' },
      { op: 'set', path: 'sections.hero.props.ctaText', value: 'Build your first workflow' },
      { op: 'set', path: 'sections.hero.props.note', value: 'Less configuration. More creation.' },
      { op: 'set', path: 'sections.features.props.title', value: 'Made for your next side project.' },
      { op: 'set', path: 'sections.features.props.subtitle', value: 'Start with developer tools. Grow at your own pace.' },
      { op: 'set', path: 'sections.features.props.priorities', value: ['developer', 'routing', 'governance'] },
      { op: 'set', path: 'sections.assurance.props.title', value: 'You build. You stay in charge.' },
      { op: 'set', path: 'sections.assurance.props.description', value: 'Keep ownership of every workflow, with clear permissions and a review trail from day one.' },
      { op: 'set', path: 'order', value: ['hero', 'features', 'pricing', 'assurance'] }
    ] },
    discount: { scenario: 'Discount Campaign', reason: 'Propose a launch promotion: reduce the Team plan from $49 to $29 and update its campaign copy.', operations: [
      { op: 'set', path: 'sections.pricing.props.amount', value: 29 },
      { op: 'set', path: 'sections.pricing.props.label', value: 'BUILD DAY SPECIAL' },
      { op: 'set', path: 'sections.pricing.props.title', value: 'Your next chapter starts here.' }
    ] }
  };
  function keysExactly(obj, keys) {
    return obj && typeof obj === 'object' && !Array.isArray(obj) && equal(Object.keys(obj).sort(), keys.slice().sort());
  }
  function validValue(value, type) {
    if (type === 'string') return typeof value === 'string' && value.length > 0 && value.length <= 2000;
    if (type === 'url') return typeof value === 'string' && (/^#[a-z][a-z0-9-]*$/i.test(value) || /^https:\/\/[^\s]+$/i.test(value));
    if (type === 'amount') return typeof value === 'number' && Number.isFinite(value) && value >= 0 && value <= 1000000;
    if (type === 'currency') return value === 'USD';
    if (type === 'priorities') return Array.isArray(value) && equal(value.slice().sort(), featureIDs.slice().sort());
    return false;
  }
  function validatePage(page) {
    if (!keysExactly(page, ['schemaVersion', 'version', 'order', 'sections']) || page.schemaVersion !== 1 || !Number.isSafeInteger(page.version) || page.version < 1) throw new Error('Invalid PageSpec metadata.');
    if (!page.sections || typeof page.sections !== 'object' || Array.isArray(page.sections)) throw new Error('Invalid sections.');
    const ids = Object.keys(page.sections);
    if (!ids.length || !Array.isArray(page.order) || !equal(page.order.slice().sort(), ids.slice().sort())) throw new Error('Section order must contain every section exactly once.');
    ids.forEach(id => {
      const section = page.sections[id];
      if (!own(schema, id) || !keysExactly(section, ['id', 'type', 'props']) || section.id !== id || section.type !== id) throw new Error('Unknown section ID or type.');
      if (!keysExactly(section.props, Object.keys(schema[id]))) throw new Error('Unknown or missing property.');
      Object.keys(schema[id]).forEach(key => { if (!validValue(section.props[key], schema[id][key])) throw new Error('Invalid typed property: ' + id + '.' + key); });
    });
    return true;
  }
  function computeDiff(before, after, path) {
    path = path || '';
    if (equal(before, after)) return [];
    if (before && after && typeof before === 'object' && typeof after === 'object' && !Array.isArray(before) && !Array.isArray(after)) {
      return Array.from(new Set(Object.keys(before).concat(Object.keys(after)))).flatMap(key => computeDiff(before[key], after[key], path ? path + '.' + key : key));
    }
    return [{ path: path, before: before === undefined ? null : clone(before), after: after === undefined ? null : clone(after), kind: after === undefined ? 'remove' : before === undefined ? 'add' : 'change' }];
  }
  function protectedField(change) {
    if (change.kind === 'remove' && /^sections\.[^.]+$/.test(change.path)) return 'Section deletion';
    const field = change.path.split('.').pop();
    return ({ amount: 'Pricing amount', currency: 'Pricing currency', billingTerms: 'Billing terms', legalClaims: 'Legal claim', guarantees: 'Guarantee', ctaUrl: 'CTA destination URL' })[field] || null;
  }
  function evaluatePolicy(changes) {
    const protectedChanges = changes.filter(protectedField);
    return { status: protectedChanges.length ? 'HOLD' : 'AUTO', protectedFields: protectedChanges.map(c => c.path), reason: protectedChanges.length ? protectedChanges.map(c => protectedField(c) + ' is protected (' + c.path + ').').join(' ') + ' The entire proposal requires approval.' : changes.length ? 'Only validated presentation fields changed. Safe to auto-apply.' : 'No changes. The current version is already up to date.' };
  }
  function applyOperations(page, operations) {
    if (!Array.isArray(operations) || operations.length > 100) throw new Error('Invalid operations list.');
    const next = clone(page);
    const touched = new Set();
    operations.forEach(operation => {
      if (!operation || !['set', 'remove'].includes(operation.op) || typeof operation.path !== 'string' || !keysExactly(operation, operation.op === 'set' ? ['op', 'path', 'value'] : ['op', 'path'])) throw new Error('Unknown or invalid operation.');
      const path = operation.path;
      if (touched.has(path)) throw new Error('Duplicate operation path.');
      touched.add(path);
      if (path === 'order' && operation.op === 'set') { next.order = clone(operation.value); return; }
      const parts = path.split('.');
      if (parts[0] !== 'sections' || !own(next.sections, parts[1])) throw new Error('Unknown modification path: ' + path);
      if (operation.op === 'remove' && parts.length === 2) { delete next.sections[parts[1]]; next.order = next.order.filter(id => id !== parts[1]); return; }
      if (operation.op !== 'set' || parts.length !== 4 || parts[2] !== 'props' || !own(schema[parts[1]], parts[3])) throw new Error('Unknown modification path: ' + path);
      next.sections[parts[1]].props[parts[3]] = clone(operation.value);
    });
    validatePage(next);
    return next;
  }
  function createEngine(options) {
    options = options || {};
    let page = clone(initialPage), ledger = [], pending = {}, history = [clone(page)], counter = 0;
    const clock = options.clock || (() => new Date().toISOString());
    function append(data) {
      const event = Object.assign({ id: 'event-' + (++counter), timestamp: clock(), changes: [], fromVersion: page.version, toVersion: page.version, approvalRequired: false }, data);
      ledger.push(clone(event)); return clone(event);
    }
    function commit(candidate) { page = clone(candidate); page.version = history[history.length - 1].version + 1; history.push(clone(page)); }
    function submit(proposal) {
      let candidate, changes;
      const scenario = proposal && typeof proposal.scenario === 'string' ? proposal.scenario : 'Unknown proposal';
      try {
        if (!keysExactly(proposal, ['scenario', 'reason', 'baseVersion', 'operations']) || typeof proposal.reason !== 'string' || !proposal.reason || typeof proposal.scenario !== 'string' || !proposal.scenario) throw new Error('Invalid proposal envelope.');
        if (proposal.baseVersion !== page.version) throw new Error('Stale proposal: expected v' + page.version + ', received v' + proposal.baseVersion + '.');
        candidate = applyOperations(page, proposal.operations);
        changes = computeDiff(page, candidate);
      } catch (error) { return append({ scenario: scenario, status: 'REJECTED', reason: error.message, proposalReason: proposal && typeof proposal.reason === 'string' ? proposal.reason : '' }); }
      const policy = evaluatePolicy(changes), fromVersion = page.version;
      if (policy.status === 'HOLD') {
        const duplicate = Object.values(pending).find(p => p.baseVersion === fromVersion && equal(p.candidate, candidate));
        if (duplicate) return clone(ledger.find(e => e.id === duplicate.id));
        const event = append({ scenario: scenario, status: 'HOLD', changes: changes, reason: policy.reason, proposalReason: proposal.reason, protectedFields: policy.protectedFields, approvalRequired: true });
        pending[event.id] = { id: event.id, scenario: scenario, baseVersion: fromVersion, candidate: clone(candidate), changes: clone(changes) };
        return event;
      }
      if (changes.length) commit(candidate);
      return append({ scenario: scenario, status: 'AUTO', changes: changes, fromVersion: fromVersion, toVersion: page.version, reason: policy.reason, proposalReason: proposal.reason, noOp: !changes.length });
    }
    function decide(id, approved) {
      const item = pending[id];
      if (!item) return append({ scenario: 'Review', status: 'REJECTED', reason: 'Proposal is no longer pending.', proposalId: id });
      delete pending[id];
      if (!approved) return append({ scenario: item.scenario, status: 'REJECTED', changes: item.changes, reason: 'Rejected by supervisor. No page changes were applied.', proposalId: id });
      if (page.version !== item.baseVersion) return append({ scenario: item.scenario, status: 'REJECTED', changes: item.changes, reason: 'Stale approval blocked: proposal was based on v' + item.baseVersion + '; the page is now v' + page.version + '. Replay the scenario to review a fresh proposal.', proposalId: id });
      // Revalidate the stored candidate and inspect its actual diff at approval time.
      validatePage(item.candidate);
      const changes = computeDiff(page, item.candidate), fromVersion = page.version;
      if (changes.length) commit(item.candidate);
      return append({ scenario: item.scenario, status: 'APPROVED', changes: changes, fromVersion: fromVersion, toVersion: page.version, reason: 'Explicit supervisor approval. All proposed changes applied together.', proposalId: id });
    }
    function rollback() {
      if (history.length < 2) return append({ scenario: 'Rollback', status: 'AUTO', noOp: true, reason: 'No previous approved state to restore.' });
      const target = history[history.length - 2], fromVersion = page.version;
      const changes = computeDiff(page, Object.assign(clone(target), { version: page.version }));
      commit(target);
      return append({ scenario: 'Rollback', action: 'rollback', status: 'APPROVED', changes: changes, fromVersion: fromVersion, toVersion: page.version, restoredVersion: target.version, reason: 'Supervisor restored the approved contents of v' + target.version + ' as new version v' + page.version + '. Full ledger retained.' });
    }
    return {
      getState: () => clone({ page: page, ledger: ledger, pending: pending, history: history }),
      propose: key => { if (!own(scenarios, key)) return append({ scenario: 'Unknown scenario', status: 'REJECTED', reason: 'Unknown scenario.' }); return submit(Object.assign(clone(scenarios[key]), { baseVersion: page.version })); },
      submit: submit, approve: id => decide(id, true), reject: id => decide(id, false), rollback: rollback,
      reset: () => { page = clone(initialPage); ledger = []; pending = {}; history = [clone(page)]; counter = 0; }
    };
  }
  return { createEngine: createEngine, initialPage: clone(initialPage), scenarios: clone(scenarios), schema: clone(schema), computeDiff: computeDiff, evaluatePolicy: evaluatePolicy, validatePage: validatePage };
}));
