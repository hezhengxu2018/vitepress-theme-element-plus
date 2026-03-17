<script setup lang="ts">
import { ElButton, ElDialog, ElSwitch } from 'element-plus'
import { ref } from 'vue'

const darkCard = ref(false)
const dialogVisible = ref(false)
</script>

<template>
  <div class="mobile-preview-demo" :class="{ 'is-dark-card': darkCard }">
    <header class="hero">
      <p class="eyebrow">
        Mobile Sandbox
      </p>
      <h1>Theme Preview</h1>
      <p class="summary">
        Use the floating preview to verify teleports, fixed footers, and narrow-screen spacing.
      </p>
    </header>

    <section class="card">
      <div class="card__header">
        <div>
          <h2>Order Summary</h2>
          <p>Element Plus components mounted inside the iframe.</p>
        </div>
        <ElSwitch v-model="darkCard" />
      </div>

      <ul class="card__list">
        <li>
          <span>Cloud storage</span>
          <strong>$12</strong>
        </li>
        <li>
          <span>Support plan</span>
          <strong>$8</strong>
        </li>
        <li>
          <span>Tax</span>
          <strong>$2</strong>
        </li>
      </ul>
    </section>

    <section class="timeline">
      <h2>Why this preview exists</h2>
      <p>Rendering the demo in an iframe keeps overlays, body scroll, and viewport units isolated from the doc page.</p>
      <p>That matches the approach used by mobile component library sites more closely than a plain inline demo box.</p>
    </section>

    <footer class="action-bar">
      <div>
        <small>Total</small>
        <strong>$22 / month</strong>
      </div>
      <ElButton type="primary" round @click="dialogVisible = true">
        Open Teleported Dialog
      </ElButton>
    </footer>

    <ElDialog v-model="dialogVisible" title="Inside the iframe" width="88%">
      <p>This dialog is rendered inside the mobile preview document, not over the VitePress page.</p>
    </ElDialog>
  </div>
</template>

<style scoped lang="scss">
.mobile-preview-demo {
  min-height: 100vh;
  padding: 24px 18px 108px;
  color: #18212f;
  background:
    radial-gradient(circle at top, rgba(59, 130, 246, 0.22), transparent 36%),
    linear-gradient(180deg, #f8fbff, #eef4ff 45%, #f7f9fc);
  box-sizing: border-box;
}

.hero h1,
.card h2,
.timeline h2,
.action-bar strong {
  margin: 0;
}

.eyebrow {
  margin: 0 0 10px;
  color: #3b82f6;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.summary,
.card p,
.timeline p,
.action-bar small {
  margin: 0;
  color: #5b6577;
}

.hero {
  margin-bottom: 18px;
}

.hero h1 {
  font-size: 32px;
  line-height: 1.05;
}

.summary {
  margin-top: 10px;
  font-size: 14px;
  line-height: 1.6;
}

.card,
.timeline {
  padding: 18px;
  background: rgba(255, 255, 255, 0.78);
  border: 1px solid rgba(148, 163, 184, 0.22);
  border-radius: 24px;
  box-shadow: 0 18px 48px rgba(15, 23, 42, 0.08);
  backdrop-filter: blur(12px);
}

.card {
  margin-bottom: 16px;
}

.card__header {
  display: flex;
  gap: 16px;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 18px;
}

.card__list {
  display: grid;
  gap: 12px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.card__list li {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 14px;
  background: rgba(248, 250, 252, 0.9);
  border-radius: 16px;
}

.timeline {
  display: grid;
  gap: 12px;
}

.action-bar {
  position: fixed;
  right: 18px;
  bottom: 18px;
  left: 18px;
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: space-between;
  padding: 14px 16px;
  background: rgba(255, 255, 255, 0.92);
  border: 1px solid rgba(148, 163, 184, 0.18);
  border-radius: 22px;
  box-shadow: 0 18px 48px rgba(15, 23, 42, 0.12);
  backdrop-filter: blur(16px);
}

.action-bar small {
  display: block;
  font-size: 12px;
}

.action-bar strong {
  display: block;
  margin-top: 2px;
  font-size: 18px;
}

.is-dark-card .card,
.is-dark-card .timeline,
.is-dark-card .action-bar {
  color: #f8fafc;
  background: rgba(15, 23, 42, 0.84);
  border-color: rgba(148, 163, 184, 0.16);
}

.is-dark-card .summary,
.is-dark-card .card p,
.is-dark-card .timeline p,
.is-dark-card .action-bar small {
  color: rgba(226, 232, 240, 0.78);
}

.is-dark-card .card__list li {
  background: rgba(30, 41, 59, 0.78);
}
</style>
