const PALETTE = [
  "#4f8ef7",
  "#9b6ef7",
  "#2ecc8a",
  "#f5c842",
  "#56c7d9",
  "#f97393",
  "#a3d65f",
  "#f28b50"
];

const SIGNAL_ORDER = ["VERDE", "AMARILLO", "ROJO", "GRIS"];
const SIGNAL_TEXT = {
  VERDE: "🟢 FAVORABLE",
  AMARILLO: "🟡 ATENCIÓN MODERADA",
  ROJO: "🔴 ALERTA ALTA",
  GRIS: "⚪ INFORMACIÓN INSUFICIENTE"
};

let REPORTS = null;
let activeStudentId = null;
let activeChart = null;

function escapeHtml(value) {
  return String(value ?? "NO ESPECIFICADO")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function initials(name) {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function semaforoClass(label) {
  if (label === "VERDE") return "badge-verde";
  if (label === "AMARILLO") return "badge-amarillo";
  if (label === "ROJO") return "badge-rojo";
  return "badge-gris";
}

function dotClass(label) {
  if (label === "VERDE") return "dot-verde";
  if (label === "AMARILLO") return "dot-amarillo";
  if (label === "ROJO") return "dot-rojo";
  return "dot-gris";
}

function studentColor(index) {
  return PALETTE[index % PALETTE.length];
}

function enrichStudents(students) {
  return students.map((student, index) => ({
    ...student,
    initials: initials(student.name),
    color: studentColor(index)
  }));
}

function filteredStudents() {
  const query = document.querySelector("#searchInput").value.trim().toLowerCase();
  const filter = document.querySelector("#signalFilter").value;

  return REPORTS.students.filter((student) => {
    const matchesSearch = student.name.toLowerCase().includes(query);
    const matchesSignal = filter === "TODOS" || student.globalSignal.label === filter;
    return matchesSearch && matchesSignal;
  });
}

function renderSidebar() {
  const list = document.querySelector("#student-list");
  const students = filteredStudents();

  if (!students.length) {
    list.innerHTML = '<div class="welcome" style="height:auto; padding: 24px 8px;"><p>No hay coincidencias con el filtro actual.</p></div>';
    document.querySelector("#main-content").innerHTML = '<div class="welcome"><div class="icon">🔎</div><h2>Sin coincidencias</h2><p>Ajusta la búsqueda o el filtro de semáforo.</p></div>';
    return;
  }

  if (!students.some((student) => student.id === activeStudentId)) {
    activeStudentId = students[0].id;
  }

  list.innerHTML = students.map((student) => {
    const isActive = student.id === activeStudentId ? "active" : "";
    const color = student.color;
    const global = student.globalSignal.label;
    const semColor =
      global === "VERDE" ? "var(--green)" :
      global === "AMARILLO" ? "var(--yellow)" :
      global === "ROJO" ? "var(--red)" :
      "#9aa3bd";

    return `
      <button class="student-btn ${isActive}" id="btn-${student.id}" data-student-id="${student.id}">
        <div class="avatar" style="background: linear-gradient(135deg, ${color}33, ${color}55); color: ${color};">${student.initials}</div>
        <div class="student-info-sidebar">
          <div class="student-name-short">${escapeHtml(student.name)}</div>
          <div class="semaforo-mini" style="color: ${semColor}">● ${escapeHtml(global)}</div>
        </div>
      </button>
    `;
  }).join("");

  list.querySelectorAll("[data-student-id]").forEach((button) => {
    button.addEventListener("click", () => {
      activeStudentId = button.getAttribute("data-student-id");
      renderSidebar();
      showStudent(activeStudentId);
    });
  });

  showStudent(activeStudentId);
}

function renderAreasRows(student) {
  return student.areaSignals.map((area) => `
    <tr>
      <td class="area-cell"><span class="dot ${dotClass(area.signal)}"></span>${escapeHtml(area.area)}</td>
      <td class="docente-cell">${escapeHtml(area.teacher)}</td>
      <td class="estado-cell">${escapeHtml(area.status)}</td>
    </tr>
  `).join("");
}

function renderSignals(items, icon = "⚠️") {
  return (items.length ? items : ["NO ESPECIFICADO"]).map((item) => `
    <div class="risk-item">
      <span class="risk-icon">${icon}</span>
      <span class="risk-text">${escapeHtml(item)}</span>
    </div>
  `).join("");
}

function renderDimensions(student) {
  return student.dimensions.map((dimension) => `
    <div class="dim-item">
      <div class="dim-text">
        <div class="dim-name">${escapeHtml(dimension.name)}</div>
        <div class="dim-level">${escapeHtml(dimension.level)}</div>
        <div>${escapeHtml(dimension.summary)}</div>
      </div>
    </div>
  `).join("");
}

function renderRecommendations(student) {
  return student.recommendations.map((item, index) => `
    <div class="rec-item">
      <span class="rec-num">${index + 1}</span>
      <span class="risk-text">${escapeHtml(item)}</span>
    </div>
  `).join("");
}

function renderObservations() {
  return REPORTS.document.observations.map((item) => `
    <div class="obs-item">
      <span class="obs-icon">🛈</span>
      <span class="risk-text">${escapeHtml(item)}</span>
    </div>
  `).join("");
}

function chartDataForStudent(student) {
  return {
    labels: SIGNAL_ORDER,
    values: SIGNAL_ORDER.map((signal) => student.derived.areaColorCounts[signal] || 0),
    colors: ["#2ecc8a", "#f5c842", "#f25c5c", "#4a5168"]
  };
}

function drawChart(student) {
  const canvas = document.querySelector("#studentChart");
  if (!canvas) return;

  if (activeChart) {
    activeChart.destroy();
  }

  const data = chartDataForStudent(student);
  activeChart = new Chart(canvas, {
    type: "doughnut",
    data: {
      labels: data.labels,
      datasets: [
        {
          data: data.values,
          backgroundColor: data.colors,
          borderColor: "#181c27",
          borderWidth: 3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: "bottom",
          labels: {
            color: "#8892b0",
            font: {
              family: "Sora",
              size: 11
            },
            boxWidth: 12
          }
        }
      }
    }
  });
}

function showStudent(id) {
  const student = REPORTS.students.find((item) => item.id === id);
  if (!student) return;

  const verdeCount = student.derived.areaColorCounts.VERDE || 0;
  const amarilloCount = student.derived.areaColorCounts.AMARILLO || 0;
  const rojoCount = student.derived.areaColorCounts.ROJO || 0;
  const grisCount = student.derived.areaColorCounts.GRIS || 0;
  const badgeClass = semaforoClass(student.globalSignal.label);

  document.querySelector("#main-content").innerHTML = `
    <div class="profile-header">
      <div class="profile-avatar" style="background: linear-gradient(135deg, ${student.color}33, ${student.color}55); color: ${student.color};">${student.initials}</div>
      <div>
        <div class="profile-name">${escapeHtml(student.name)}</div>
        <div class="profile-meta">Grado ${escapeHtml(student.grade)} · Período ${escapeHtml(student.period)} · Fuente Markdown validada</div>
      </div>
      <div class="global-badge ${badgeClass}">
        Semáforo Global<br>${escapeHtml(SIGNAL_TEXT[student.globalSignal.label] || student.globalSignal.label)}
      </div>
    </div>

    <div class="grid-4">
      <div class="card" style="border-top: 3px solid var(--green)">
        <div class="card-title">🟢 Áreas en Verde</div>
        <div class="metric-value" style="color: var(--green)">${verdeCount}</div>
        <div class="metric-note">Áreas con señal favorable.</div>
      </div>
      <div class="card" style="border-top: 3px solid var(--yellow)">
        <div class="card-title">🟡 Áreas en Amarillo</div>
        <div class="metric-value" style="color: var(--yellow)">${amarilloCount}</div>
        <div class="metric-note">Áreas que requieren atención.</div>
      </div>
      <div class="card" style="border-top: 3px solid var(--red)">
        <div class="card-title">🔴 Áreas en Rojo</div>
        <div class="metric-value" style="color: var(--red)">${rojoCount}</div>
        <div class="metric-note">Áreas de riesgo inmediato.</div>
      </div>
      <div class="card" style="border-top: 3px solid var(--gray)">
        <div class="card-title">⚪ Áreas en Gris</div>
        <div class="metric-value" style="color: #a9b3d1">${grisCount}</div>
        <div class="metric-note">Sin evidencia suficiente.</div>
      </div>
    </div>

    <div class="grid-2">
      <div class="card">
        <div class="card-title">📊 Distribución del semáforo por área</div>
        <div class="chart-container">
          <canvas id="studentChart"></canvas>
        </div>
      </div>
      <div class="card">
        <div class="card-title">⚠️ Señales tempranas de riesgo</div>
        ${renderSignals(student.earlyRiskSignals, "⚠️")}
      </div>
    </div>

    <div class="card" style="margin-bottom: 20px">
      <div class="card-title">📋 Estado por área y docente</div>
      <table class="areas-table">
        <thead>
          <tr>
            <th>Área</th>
            <th>Docente</th>
            <th>Estado académico</th>
          </tr>
        </thead>
        <tbody>${renderAreasRows(student)}</tbody>
      </table>
    </div>

    <div class="grid-2">
      <div class="card">
        <div class="card-title">💬 Realimentación general</div>
        ${student.feedbackParagraphs.map((paragraph) => `<p class="feedback-text" style="margin-bottom: 14px;">${escapeHtml(paragraph)}</p>`).join("")}
        <div class="card-title" style="margin-top: 18px;">🧭 Dimensiones de análisis</div>
        ${renderDimensions(student)}
      </div>
      <div class="card">
        <div class="card-title">🔁 Hábitos y patrones</div>
        <div style="margin-bottom: 16px;">
          ${(student.behaviorPatterns.length ? student.behaviorPatterns : ["NO ESPECIFICADO"]).map((item) => `<span class="habit-tag">${escapeHtml(item)}</span>`).join("")}
        </div>
        <div class="card-title" style="margin-top:16px">✅ Recomendaciones pedagógicas</div>
        ${renderRecommendations(student)}
      </div>
    </div>

    <div class="grid-2">
      <div class="card">
        <div class="card-title">🧾 Trazabilidad del informe</div>
        <p class="source-text"><strong>Archivo fuente:</strong> ${escapeHtml(student.source.file)}</p>
        <p class="source-text" style="margin-top: 10px;"><strong>Encabezado fuente:</strong> ${escapeHtml(student.source.heading)}</p>
        <p class="source-text" style="margin-top: 10px;"><strong>Dato derivado mostrado:</strong> conteo de semáforos por área y distribución del estudiante.</p>
      </div>
      <div class="card">
        <div class="card-title">🗂 Observaciones generales del documento</div>
        ${renderObservations()}
      </div>
    </div>

    <div class="warning-card">
      <span style="font-size:20px">⚠️</span>
      <div><strong>Alcance de la fuente:</strong> este portal solo refleja el contenido presente en el Markdown validado. La institución permanece como ${escapeHtml(REPORTS.document.institution)} y no se muestran métricas no derivables del archivo fuente.</div>
    </div>
  `;

  setTimeout(() => drawChart(student), 50);
}

async function init() {
  const response = await fetch("./data/reports.json", { cache: "no-store" });
  const data = await response.json();
  REPORTS = {
    ...data,
    students: enrichStudents(data.students)
  };

  document.querySelector("#headerTitle").textContent = REPORTS.document.title;
  document.querySelector("#headerSubtitle").textContent = `Portal derivado de ${REPORTS.source.markdownFiles.length} Markdown válido(s) · ${REPORTS.derived.totalStudents} estudiantes estructurados`;
  document.querySelector("#headerPeriod").textContent = REPORTS.document.period;

  document.querySelector("#searchInput").addEventListener("input", renderSidebar);
  document.querySelector("#signalFilter").addEventListener("change", renderSidebar);

  activeStudentId = null;
  renderSidebar();
}

init().catch((error) => {
  document.querySelector("#main-content").innerHTML = `
    <div class="welcome">
      <div class="icon">⚠️</div>
      <h2>Error cargando el portal</h2>
      <p>${escapeHtml(error.message)}</p>
    </div>
  `;
});
