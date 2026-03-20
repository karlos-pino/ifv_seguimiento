const SIGNALS = ["ROJO", "AMARILLO", "VERDE", "GRIS"];
const SIGNAL_CLASS = {
  ROJO: "pill--ROJO",
  AMARILLO: "pill--AMARILLO",
  VERDE: "pill--VERDE",
  GRIS: "pill--GRIS",
  NO_ESPECIFICADO: "pill--NO_ESPECIFICADO"
};

let reportData = null;
let activeStudentId = null;

function pill(label) {
  const normalized = label || "NO ESPECIFICADO";
  return `<span class="pill ${SIGNAL_CLASS[normalized] || SIGNAL_CLASS.NO_ESPECIFICADO}">${normalized}</span>`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function setDocumentMeta(data) {
  document.querySelector("#docTitle").textContent = data.document.title;
  document.querySelector("#docSummary").textContent =
    "Consulta maestra-detalle basada en Markdown validado. Todo indicador cuantitativo visible se deriva de ese contenido.";
  document.querySelector("#docMeta").innerHTML = [
    `<span class="tag">${escapeHtml(data.document.period)}</span>`,
    `<span class="tag">Institución: ${escapeHtml(data.document.institution)}</span>`,
    `<span class="tag">${data.source.markdownFiles.length} Markdown válidos</span>`
  ].join("");

  document.querySelector("#totalStudents").textContent = String(data.derived.totalStudents);
  document.querySelector("#sourceFiles").textContent = `${data.source.markdownFiles.length} archivos Markdown válidos`;
  document.querySelector("#ignoredFiles").textContent = `${data.source.ignoredFiles.length} archivos ignorados`;
  document.querySelector("#globalRedCount").textContent = String(data.derived.globalSignalCounts.ROJO || 0);
  document.querySelector("#grayAreaCount").textContent = String(data.derived.areaSignalTotals.GRIS || 0);
  document.querySelector("#criticalAreasCount").textContent = String(data.derived.criticalAreas.length);
}

function renderSignalChart(data) {
  const total = data.derived.totalStudents || 1;
  document.querySelector("#globalSignalChart").innerHTML = SIGNALS.map((signal) => {
    const count = data.derived.globalSignalCounts[signal] || 0;
    const width = Math.max(6, Math.round((count / total) * 100));
    return `
      <div class="bar-row">
        <span>${signal}</span>
        <div class="bar-track">
          <div class="bar-fill ${SIGNAL_CLASS[signal]}" style="width:${width}%"></div>
        </div>
        <strong>${count}</strong>
      </div>
    `;
  }).join("");
}

function renderCriticalAreas(data) {
  const list = data.derived.criticalAreas.slice(0, 6);
  document.querySelector("#criticalAreasList").innerHTML = list.map((item) => {
    const total = item.total || 1;
    const redWidth = Math.round((item.red / total) * 100);
    const yellowWidth = Math.round((item.yellow / total) * 100);
    return `
      <div class="stack-row">
        <div class="stack-row__label">
          <strong>${escapeHtml(item.area)}</strong>
          <span>${item.total} casos</span>
        </div>
        <div class="stack-track">
          <div class="stack-red" style="width:${redWidth}%"></div>
          <div class="stack-yellow" style="width:${yellowWidth}%"></div>
        </div>
      </div>
    `;
  }).join("");
}

function getFilteredStudents() {
  const search = document.querySelector("#searchInput").value.trim().toLowerCase();
  const signal = document.querySelector("#signalFilter").value;

  return reportData.students.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(search);
    const matchesSignal = signal === "TODOS" || student.globalSignal.label === signal;
    return matchesSearch && matchesSignal;
  });
}

function renderStudentList() {
  const filtered = getFilteredStudents();
  const list = document.querySelector("#studentList");

  if (!filtered.length) {
    list.innerHTML = '<p class="empty-state">No hay estudiantes que coincidan con el filtro actual.</p>';
    document.querySelector("#studentDetail").innerHTML = '<p class="empty-state">Ajusta los filtros para revisar una ficha.</p>';
    return;
  }

  if (!filtered.some((student) => student.id === activeStudentId)) {
    activeStudentId = filtered[0].id;
  }

  list.innerHTML = filtered.map((student) => `
    <button class="student-card ${student.id === activeStudentId ? "is-active" : ""}" data-student-id="${student.id}">
      <div class="section-head section-head--tight">
        <div>
          <h3>${escapeHtml(student.name)}</h3>
          <span class="student-card__meta">${escapeHtml(student.grade)} · ${escapeHtml(student.period)}</span>
        </div>
        ${pill(student.globalSignal.label)}
      </div>
      <span class="student-card__note">${escapeHtml(student.globalSignal.summary)}</span>
    </button>
  `).join("");

  list.querySelectorAll("[data-student-id]").forEach((button) => {
    button.addEventListener("click", () => {
      activeStudentId = button.getAttribute("data-student-id");
      renderStudentList();
      renderStudentDetail();
    });
  });

  renderStudentDetail();
}

function renderAreaRows(student) {
  return student.areaSignals.map((area) => `
    <tr>
      <td>${escapeHtml(area.area)}</td>
      <td>${escapeHtml(area.teacher)}</td>
      <td>${pill(area.signal)}</td>
      <td>${escapeHtml(area.status)}</td>
    </tr>
  `).join("");
}

function renderMetricTiles(student) {
  return `
    <div class="metrics-grid">
      <div class="metric-tile">
        <strong>${student.areaSignals.length}</strong>
        <span>Áreas registradas</span>
      </div>
      <div class="metric-tile">
        <strong>${student.derived.criticalAreas}</strong>
        <span>Áreas en rojo</span>
      </div>
      <div class="metric-tile">
        <strong>${student.derived.grayAreas}</strong>
        <span>Áreas en gris</span>
      </div>
      <div class="metric-tile">
        <strong>${student.derived.areasWithEvidence}</strong>
        <span>Áreas con evidencia</span>
      </div>
    </div>
  `;
}

function renderDimensionCards(student) {
  return student.dimensions.map((dimension) => `
    <article class="dimension-card">
      <h3>${escapeHtml(dimension.name)}</h3>
      <div class="dimension-card__level">${escapeHtml(dimension.level)}</div>
      <p>${escapeHtml(dimension.summary)}</p>
    </article>
  `).join("");
}

function renderListCard(title, items) {
  const listItems = items.length
    ? items.map((item) => `<li>${escapeHtml(item)}</li>`).join("")
    : "<li>NO ESPECIFICADO</li>";

  return `
    <article class="list-card">
      <h3>${escapeHtml(title)}</h3>
      <ul>${listItems}</ul>
    </article>
  `;
}

function renderFeedback(student) {
  return `
    <article class="feedback-card">
      <h3>Realimentación general</h3>
      ${student.feedbackParagraphs.map((paragraph) => `<p>${escapeHtml(paragraph)}</p>`).join("")}
    </article>
  `;
}

function renderSourceCard(student) {
  return `
    <article class="source-card">
      <h3>Trazabilidad</h3>
      <p><strong>Archivo fuente:</strong> ${escapeHtml(student.source.file)}</p>
      <p><strong>Encabezado fuente:</strong> ${escapeHtml(student.source.heading)}</p>
      <p><strong>Dato derivado:</strong> conteo de semáforos por área y agregados globales.</p>
    </article>
  `;
}

function renderStudentDetail() {
  const student = reportData.students.find((item) => item.id === activeStudentId);
  const container = document.querySelector("#studentDetail");

  if (!student) {
    container.innerHTML = '<p class="empty-state">NO ESPECIFICADO</p>';
    return;
  }

  container.innerHTML = `
    <div class="detail-head">
      <div class="section-head section-head--tight">
        <div>
          <p class="eyebrow">Ficha individual</p>
          <h2>${escapeHtml(student.name)}</h2>
        </div>
        ${pill(student.globalSignal.label)}
      </div>
      <p class="data-note">${escapeHtml(student.globalSignal.summary)}</p>
      ${renderMetricTiles(student)}
    </div>

    <h3 class="detail-section-title">Dimensiones de análisis</h3>
    <div class="detail-grid">${renderDimensionCards(student)}</div>

    <h3 class="detail-section-title">Semáforo por área</h3>
    <article class="table-card">
      <h3>Matriz de áreas</h3>
      <table>
        <thead>
          <tr>
            <th>Área</th>
            <th>Docente</th>
            <th>Semáforo</th>
            <th>Estado</th>
          </tr>
        </thead>
        <tbody>${renderAreaRows(student)}</tbody>
      </table>
    </article>

    <h3 class="detail-section-title">Análisis completo</h3>
    <div class="detail-grid">
      ${renderFeedback(student)}
      ${renderListCard("Señales tempranas de riesgo", student.earlyRiskSignals)}
      ${renderListCard("Hábitos y patrones de comportamiento", student.behaviorPatterns)}
      ${renderListCard("Recomendaciones pedagógicas", student.recommendations)}
      ${renderSourceCard(student)}
      <article class="source-card">
        <h3>Observaciones generales del documento</h3>
        ${reportData.document.observations.map((item) => `<p>${escapeHtml(item)}</p>`).join("")}
      </article>
    </div>
  `;
}

async function boot() {
  const response = await fetch("./data/reports.json", { cache: "no-store" });
  reportData = await response.json();
  activeStudentId = reportData.students[0]?.id || null;

  setDocumentMeta(reportData);
  renderSignalChart(reportData);
  renderCriticalAreas(reportData);
  renderStudentList();

  document.querySelector("#searchInput").addEventListener("input", renderStudentList);
  document.querySelector("#signalFilter").addEventListener("change", renderStudentList);
}

boot().catch((error) => {
  document.querySelector("#studentDetail").innerHTML = `<p class="empty-state">Error cargando datos: ${escapeHtml(error.message)}</p>`;
});
