const students = [
  {
    id: "keidy-benitez",
    name: "Keidy B.",
    fullName: "Keidy Julieth B.",
    grade: "10E",
    attendance: 97,
    pendingTasks: 1,
    risk: "low",
    counselorFocus: "Mantener la participacion oral y reforzar acompanamiento en Fisica.",
    highlights: [
      "Buen ritmo academico general.",
      "Actitud positiva frente a las actividades.",
      "Fisica sigue en diagnostico."
    ],
    subjects: [
      { area: "Catedra y emprendimiento", teacher: "Maria Edith Molina", status: "ok", note: "Al dia con buena actitud." },
      { area: "Matematicas", teacher: "Ricardo Galvis", status: "ok", note: "Participa y mantiene el ritmo." },
      { area: "Fisica", teacher: "Cristian Monsalve", status: "watch", note: "Proceso de diagnostico academico." }
    ]
  },
  {
    id: "jarol-alvares",
    name: "Jarol A.",
    fullName: "Jarol Esteban A.",
    grade: "10E",
    attendance: 78,
    pendingTasks: 6,
    risk: "high",
    counselorFocus: "Requiere plan de disciplina, uso de celular y control de inasistencia.",
    highlights: [
      "Falta compromiso academico y disciplina.",
      "Se duerme en clase.",
      "Se reportan distractores frecuentes."
    ],
    subjects: [
      { area: "Matematicas", teacher: "Ricardo Galvis", status: "risk", note: "No hay notas suficientes; actitud relajada." },
      { area: "Sociales", teacher: "Luis Canaveral", status: "watch", note: "Habla mucho en clase." },
      { area: "Tecnologia", teacher: "Marlon Solano", status: "risk", note: "Llamados frecuentes por uso del celular." }
    ]
  },
  {
    id: "vivian-velez",
    name: "Vivian V.",
    fullName: "Vivian Estefany V.",
    grade: "10E",
    attendance: 74,
    pendingTasks: 5,
    risk: "high",
    counselorFocus: "Aumentar asistencia y cierre de pendientes del primer taller.",
    highlights: [
      "Alta inasistencia.",
      "Bajo compromiso academico inicial.",
      "Debe participar mas en clase."
    ],
    subjects: [
      { area: "Quimica", teacher: "Aris Andrade", status: "risk", note: "Pendiente quiz por ausencia." },
      { area: "Ingles", teacher: "Julian Ramirez", status: "watch", note: "Puede ser responsable, pero irregular." },
      { area: "Fisica", teacher: "Cristian Monsalve", status: "watch", note: "Diagnostico aun en curso." }
    ]
  },
  {
    id: "daniela-rico",
    name: "Daniela R.",
    fullName: "Daniela Rico R.",
    grade: "10E",
    attendance: 92,
    pendingTasks: 2,
    risk: "medium",
    counselorFocus: "Consolidar participacion y seguimiento en actividades faltantes.",
    highlights: [
      "Muy buen desempeno general.",
      "Asistencia favorable.",
      "Necesita mas presencia participativa."
    ],
    subjects: [
      { area: "Catedra y emprendimiento", teacher: "Maria Edith Molina", status: "ok", note: "Excelente en actividades." },
      { area: "Matematicas", teacher: "Ricardo Galvis", status: "watch", note: "No entrego el primer taller." },
      { area: "Sociales", teacher: "Luis Canaveral", status: "ok", note: "Trabaja en clase." }
    ]
  },
  {
    id: "maria-del-prado",
    name: "Maria D.",
    fullName: "Maria Jose D.",
    grade: "10E",
    attendance: 96,
    pendingTasks: 0,
    risk: "low",
    counselorFocus: "Mantener el impulso positivo y la actitud de cambio.",
    highlights: [
      "Al dia con todas las actividades.",
      "Mejoro la asistencia.",
      "Disposicion positiva sostenida."
    ],
    subjects: [
      { area: "Matematicas", teacher: "Ricardo Galvis", status: "ok", note: "Quiz diagnostico en nivel alto." },
      { area: "Quimica", teacher: "Aris Andrade", status: "ok", note: "Buen desarrollo de actividades." },
      { area: "Etica", teacher: "Cristian Garcia", status: "ok", note: "Cambio positivo en actitud." }
    ]
  },
  {
    id: "juan-gonzalez",
    name: "Juan G.",
    fullName: "Juan Sebastian G.",
    grade: "10E",
    attendance: 88,
    pendingTasks: 3,
    risk: "medium",
    counselorFocus: "Reducir distractores y mejorar entrega oportuna.",
    highlights: [
      "Se encuentra al dia en varias areas.",
      "Persisten distractores ocasionales.",
      "Cambio conductual favorable."
    ],
    subjects: [
      { area: "Matematicas", teacher: "Ricardo Galvis", status: "watch", note: "Falta mas compromiso academico." },
      { area: "Quimica", teacher: "Aris Andrade", status: "watch", note: "No entrega a tiempo algunas actividades." },
      { area: "Fisica", teacher: "Cristian Monsalve", status: "ok", note: "Buena actitud inicial." }
    ]
  },
  {
    id: "emanuel-cardona",
    name: "Emanuel C.",
    fullName: "Emanuel Cardona C.",
    grade: "10E",
    attendance: 81,
    pendingTasks: 5,
    risk: "high",
    counselorFocus: "Intervencion por comportamiento y cierre de trabajos no presentados.",
    highlights: [
      "Muchos llamados de atencion.",
      "Debe mejorar concentracion.",
      "Hay materias sin trabajos presentados."
    ],
    subjects: [
      { area: "Catedra y emprendimiento", teacher: "Maria Edith Molina", status: "watch", note: "Debe mejorar comportamiento." },
      { area: "Tecnologia", teacher: "Marlon Solano", status: "risk", note: "Trabajos no entregados." },
      { area: "Fisica", teacher: "Cristian Monsalve", status: "watch", note: "Diagnostico aun en curso." }
    ]
  },
  {
    id: "astrid-correa",
    name: "Astrid C.",
    fullName: "Astrid Juliana C.",
    grade: "10E",
    attendance: 95,
    pendingTasks: 1,
    risk: "low",
    counselorFocus: "Sostener el muy buen momento academico y de convivencia.",
    highlights: [
      "Excelente actitud y comportamiento.",
      "Cambio academico muy favorable.",
      "Cumple con actividades."
    ],
    subjects: [
      { area: "Matematicas", teacher: "Ricardo Galvis", status: "ok", note: "Notas al dia." },
      { area: "Biologia", teacher: "Patricia Chanci", status: "ok", note: "Escucha activa y buena disposicion." },
      { area: "Edu. Fisica", teacher: "Gustavo Rojas", status: "ok", note: "Cumple con sus actividades." }
    ]
  },
  {
    id: "jhojan-zapata",
    name: "Jhojan Z.",
    fullName: "Jhojan Estiben Z.",
    grade: "10E",
    attendance: 84,
    pendingTasks: 4,
    risk: "medium",
    counselorFocus: "Cierre de pendientes en catedra y fortalecimiento del compromiso.",
    highlights: [
      "Buena disposicion, pero con faltantes.",
      "Habla mucho en clase.",
      "Tiene areas en mejoria."
    ],
    subjects: [
      { area: "Catedra y emprendimiento", teacher: "Maria Edith Molina", status: "risk", note: "Debe ponerse al dia." },
      { area: "Matematicas", teacher: "Ricardo Galvis", status: "watch", note: "Compromiso academico irregular." },
      { area: "Tecnologia", teacher: "Marlon Solano", status: "watch", note: "Valoracion incompleta." }
    ]
  },
  {
    id: "maria-goez",
    name: "Maria G.",
    fullName: "Maria Isabel G.",
    grade: "10E",
    attendance: 86,
    pendingTasks: 3,
    risk: "medium",
    counselorFocus: "Mantener el interes logrado y atacar los incumplimientos persistentes.",
    highlights: [
      "Ha mejorado su responsabilidad.",
      "Se distrae por momentos.",
      "Aun hay materias sin actividades completas."
    ],
    subjects: [
      { area: "Matematicas", teacher: "Ricardo Galvis", status: "watch", note: "Quiz diagnostico bajo." },
      { area: "Ingles", teacher: "Julian Ramirez", status: "ok", note: "Presenta otra actitud." },
      { area: "Artistica", teacher: "Patricia Chancin", status: "risk", note: "No cumple con las actividades propuestas." }
    ]
  },
  {
    id: "jhony-gomez",
    name: "Jhony G.",
    fullName: "Jhony Alejandro G.",
    grade: "10E",
    attendance: 68,
    pendingTasks: 7,
    risk: "high",
    counselorFocus: "Caso prioritario por inasistencia y ausencias recurrentes.",
    highlights: [
      "Inasistencia alta y tardanzas.",
      "Problematicas familiares reportadas.",
      "Poca presencia en aula."
    ],
    subjects: [
      { area: "Matematicas", teacher: "Ricardo Galvis", status: "risk", note: "Pendiente quiz; falto varios dias." },
      { area: "Quimica", teacher: "Aris Andrade", status: "risk", note: "Debe esforzarse en rendimiento." },
      { area: "Sociales", teacher: "Luis Canaveral", status: "watch", note: "Mejorar concentracion." }
    ]
  },
  {
    id: "santiago-rico",
    name: "Santiago R.",
    fullName: "Santiago R.",
    grade: "10E",
    attendance: 79,
    pendingTasks: 6,
    risk: "high",
    counselorFocus: "Intervencion academica inmediata y ajuste de normas de presentacion.",
    highlights: [
      "Se duerme en clase.",
      "No presenta actividades.",
      "Trabajo en aula insuficiente."
    ],
    subjects: [
      { area: "Catedra y emprendimiento", teacher: "Maria Edith Molina", status: "watch", note: "Quiere mejorar, pero irregular." },
      { area: "Quimica", teacher: "Aris Andrade", status: "risk", note: "No presenta actividades." },
      { area: "Artistica", teacher: "Patricia Chancin", status: "risk", note: "No trabaja en clase." }
    ]
  },
  {
    id: "jhojan-londono",
    name: "Jhojan L.",
    fullName: "Jhojan Stiven L.",
    grade: "10E",
    attendance: 82,
    pendingTasks: 6,
    risk: "high",
    counselorFocus: "Necesita plan riguroso de recuperacion por acumulacion de notas bajas.",
    highlights: [
      "Asistencia aceptable, pero rendimiento bajo.",
      "Tiene varias notas en 1.0.",
      "Habla mucho y no trabaja en clase."
    ],
    subjects: [
      { area: "Catedra y emprendimiento", teacher: "Maria Edith Molina", status: "ok", note: "Al dia en algunas actividades." },
      { area: "Tecnologia", teacher: "Marlon Solano", status: "risk", note: "No presenta actividades; notas muy bajas." },
      { area: "Artistica", teacher: "Patricia Chancin", status: "risk", note: "No trabaja en clase." }
    ]
  },
  {
    id: "david-rico",
    name: "David R.",
    fullName: "David R.",
    grade: "10E",
    attendance: 90,
    pendingTasks: 1,
    risk: "low",
    counselorFocus: "Mantener constancia y documentar buenas practicas replicables.",
    highlights: [
      "Buena actitud y comportamiento.",
      "Trabaja en clase.",
      "Entrega trabajos."
    ],
    subjects: [
      { area: "Sociales", teacher: "Luis Canaveral", status: "ok", note: "Buen comportamiento." },
      { area: "Artistica", teacher: "Patricia Chancin", status: "ok", note: "Trabaja y presenta." },
      { area: "Fisica", teacher: "Cristian Monsalve", status: "watch", note: "Sin suficiente trazabilidad aun." }
    ]
  }
];

const riskOrder = ["high", "medium", "low"];
const riskLabels = {
  high: "Riesgo alto",
  medium: "Riesgo medio",
  low: "Riesgo bajo"
};

const subjectLabels = {
  ok: "Estable",
  watch: "Seguimiento",
  risk: "Alerta"
};

const studentList = document.querySelector("#studentList");
const studentDetail = document.querySelector("#studentDetail");
const searchInput = document.querySelector("#searchInput");
const riskFilter = document.querySelector("#riskFilter");

let selectedId = students[0].id;

function getFilteredStudents() {
  const search = searchInput.value.trim().toLowerCase();
  const risk = riskFilter.value;

  return students.filter((student) => {
    const matchesSearch =
      student.name.toLowerCase().includes(search) ||
      student.fullName.toLowerCase().includes(search);
    const matchesRisk = risk === "all" || student.risk === risk;
    return matchesSearch && matchesRisk;
  });
}

function summarizeData() {
  const total = students.length;
  const highRisk = students.filter((student) => student.risk === "high").length;
  const attendanceAverage = Math.round(
    students.reduce((sum, student) => sum + student.attendance, 0) / total
  );
  const subjectAlerts = students.reduce(
    (sum, student) => sum + student.subjects.filter((subject) => subject.status !== "ok").length,
    0
  );

  document.querySelector("#metricStudents").textContent = String(total);
  document.querySelector("#metricHighRisk").textContent = String(highRisk);
  document.querySelector("#metricAttendance").textContent = `${attendanceAverage}%`;
  document.querySelector("#metricSubjects").textContent = String(subjectAlerts);
  document.querySelector("#heroRiskCount").textContent = String(highRisk);
}

function renderHeroAlerts() {
  const urgent = students
    .filter((student) => student.risk === "high")
    .slice(0, 3)
    .map((student) => `<li><strong>${student.name}</strong> · ${student.counselorFocus}</li>`)
    .join("");

  document.querySelector("#heroAlerts").innerHTML = urgent;
}

function renderDistribution() {
  const total = students.length;
  const counts = riskOrder.map((risk) => ({
    risk,
    count: students.filter((student) => student.risk === risk).length
  }));

  document.querySelector("#riskDistribution").innerHTML = counts
    .map(({ risk, count }) => {
      const width = Math.max(8, Math.round((count / total) * 100));
      return `
        <div class="distribution__row">
          <span>${riskLabels[risk]}</span>
          <div class="distribution__track">
            <div class="distribution__bar distribution__bar--${risk}" style="width:${width}%"></div>
          </div>
          <strong>${count}</strong>
        </div>
      `;
    })
    .join("");
}

function renderAlerts() {
  const alerts = students
    .filter((student) => student.risk === "high")
    .sort((a, b) => b.pendingTasks - a.pendingTasks)
    .slice(0, 4);

  document.querySelector("#alertList").innerHTML = alerts
    .map(
      (student) => `
        <li>
          <strong>${student.fullName}</strong>
          <span>${student.pendingTasks} pendientes · ${student.attendance}% de asistencia</span>
          <span>${student.counselorFocus}</span>
        </li>
      `
    )
    .join("");
}

function renderSubjectHeatmap() {
  const subjectMap = new Map();

  students.forEach((student) => {
    student.subjects.forEach((subject) => {
      const current = subjectMap.get(subject.area) || { alerts: 0, tracking: 0, total: 0 };
      current.total += 1;
      if (subject.status === "risk") current.alerts += 1;
      if (subject.status === "watch") current.tracking += 1;
      subjectMap.set(subject.area, current);
    });
  });

  const sortedSubjects = [...subjectMap.entries()]
    .map(([area, info]) => ({
      area,
      pressure: info.alerts * 2 + info.tracking,
      ...info
    }))
    .sort((a, b) => b.pressure - a.pressure)
    .slice(0, 5);

  document.querySelector("#subjectHeatmap").innerHTML = sortedSubjects
    .map(
      (subject) => `
        <article class="subject-heatmap__item">
          <h3>${subject.area}</h3>
          <p>${subject.alerts} alertas directas · ${subject.tracking} seguimientos activos</p>
          <div class="subject-heatmap__scale"></div>
        </article>
      `
    )
    .join("");
}

function studentPill(risk) {
  return `<span class="pill pill--${risk}">${riskLabels[risk]}</span>`;
}

function renderStudentList() {
  const filtered = getFilteredStudents();

  if (!filtered.find((student) => student.id === selectedId)) {
    selectedId = filtered[0]?.id || "";
  }

  if (!filtered.length) {
    studentList.innerHTML = '<div class="empty-state">No hay resultados con ese filtro.</div>';
    studentDetail.innerHTML = '<p class="student-detail__empty">Ajusta la busqueda para continuar.</p>';
    return;
  }

  studentList.innerHTML = filtered
    .map(
      (student) => `
        <button class="student-card ${student.id === selectedId ? "is-active" : ""}" data-student-id="${student.id}">
          <div class="student-header">
            <div>
              <strong class="student-name">${student.fullName}</strong>
              <span>${student.grade} · ${student.attendance}% asistencia</span>
            </div>
            ${studentPill(student.risk)}
          </div>
          <p class="student-note">${student.counselorFocus}</p>
          <ul class="student-meta">
            <li>${student.pendingTasks} pendientes</li>
            <li>${student.subjects.filter((subject) => subject.status === "risk").length} areas criticas</li>
          </ul>
        </button>
      `
    )
    .join("");

  studentList.querySelectorAll("[data-student-id]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedId = button.getAttribute("data-student-id");
      renderStudentList();
      renderStudentDetail();
    });
  });

  renderStudentDetail();
}

function renderStudentDetail() {
  const student = students.find((item) => item.id === selectedId);

  if (!student) {
    studentDetail.innerHTML = '<p class="student-detail__empty">Selecciona un estudiante para ver su ficha consolidada.</p>';
    return;
  }

  studentDetail.innerHTML = `
    <div class="student-detail__headline">
      <div class="student-detail__summary">
        <div>
          <p class="eyebrow">Ficha consolidada</p>
          <h2 class="student-detail__title">${student.fullName}</h2>
          <p class="student-detail__description">${student.counselorFocus}</p>
        </div>
        ${studentPill(student.risk)}
      </div>
      <div class="detail-grid">
        <section class="detail-card">
          <h3>Lectura rapida</h3>
          <ul class="detail-list">
            <li><strong>Grado:</strong> ${student.grade}</li>
            <li><strong>Asistencia:</strong> ${student.attendance}%</li>
            <li><strong>Pendientes:</strong> ${student.pendingTasks}</li>
            <li><strong>Areas con alerta:</strong> ${student.subjects.filter((subject) => subject.status === "risk").length}</li>
          </ul>
        </section>
        <section class="detail-card">
          <h3>Hallazgos clave</h3>
          <ul class="detail-list">
            ${student.highlights.map((item) => `<li>${item}</li>`).join("")}
          </ul>
        </section>
        <section class="detail-card">
          <h3>Seguimiento por area</h3>
          <ul class="subject-list">
            ${student.subjects
              .map(
                (subject) => `
                  <li>
                    <strong>${subject.area} · ${subjectLabels[subject.status]}</strong>
                    <span>${subject.teacher}</span>
                    <span>${subject.note}</span>
                  </li>
                `
              )
              .join("")}
          </ul>
        </section>
        <section class="detail-card">
          <h3>Siguiente accion sugerida</h3>
          <ul class="detail-list">
            <li>Agendar seguimiento con director de grupo y docentes con materias en alerta.</li>
            <li>Priorizar cierre de pendientes antes del siguiente corte.</li>
            <li>Registrar novedades y acuerdos en una bitacora digital compartida.</li>
          </ul>
        </section>
      </div>
    </div>
  `;
}

function boot() {
  summarizeData();
  renderHeroAlerts();
  renderDistribution();
  renderAlerts();
  renderSubjectHeatmap();
  renderStudentList();

  searchInput.addEventListener("input", renderStudentList);
  riskFilter.addEventListener("change", renderStudentList);
}

boot();
