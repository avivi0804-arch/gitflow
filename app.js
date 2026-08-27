/**
 * Dashboard Application Logic
 * Interactive Charts, Theme Switcher, Data Filtering & CRUD Simulation
 */

// Initial Data & State
let currentTheme = localStorage.getItem('theme') || 'dark';
let activeRange = 'month';

// Transactions Mock Data
let transactions = [
  {
    id: "TX-9021",
    customer: "Elena Rostova",
    email: "elena.r@techcorp.io",
    avatar: "ER",
    avatarBg: "#8b5cf6",
    product: "Enterprise Plan",
    amount: "$2,450.00",
    date: "Hoy, 14:32",
    status: "completed"
  },
  {
    id: "TX-9020",
    customer: "Carlos Mendoza",
    email: "carlos.m@finovate.com",
    avatar: "CM",
    avatarBg: "#06b6d4",
    product: "Pro Subscription",
    amount: "$890.00",
    date: "Hoy, 11:15",
    status: "completed"
  },
  {
    id: "TX-9019",
    customer: "Sophia Vance",
    email: "sophia@designify.studio",
    avatar: "SV",
    avatarBg: "#ec4899",
    product: "Custom Integration",
    amount: "$1,200.00",
    date: "Ayer, 18:40",
    status: "pending"
  },
  {
    id: "TX-9018",
    customer: "Mateo Silva",
    email: "mateo@silvaventures.co",
    avatar: "MS",
    avatarBg: "#10b981",
    product: "Basic Tier",
    amount: "$299.00",
    date: "Ayer, 09:20",
    status: "completed"
  },
  {
    id: "TX-9017",
    customer: "Aria Takahashi",
    email: "aria@tokyocreative.jp",
    avatar: "AT",
    avatarBg: "#f59e0b",
    product: "API Add-on",
    amount: "$450.00",
    date: "25 Ago, 16:10",
    status: "cancelled"
  }
];

// Chart Instances
let revenueChart = null;
let trafficChart = null;

// Initialize on DOM Ready
document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initCharts();
  renderTransactionsTable();
  setupEventListeners();
});

/* ==========================================================================
   Theme Management
   ========================================================================== */
function initTheme() {
  document.documentElement.setAttribute('data-theme', currentTheme);
  updateThemeIcon();
}

function toggleTheme() {
  currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', currentTheme);
  localStorage.setItem('theme', currentTheme);
  updateThemeIcon();
  updateChartThemes();
  showToast(`Modo ${currentTheme === 'dark' ? 'Oscuro' : 'Claro'} activado`);
}

function updateThemeIcon() {
  const themeBtn = document.getElementById('theme-toggle');
  if (!themeBtn) return;
  const icon = themeBtn.querySelector('i');
  if (currentTheme === 'dark') {
    icon.className = 'fas fa-sun';
  } else {
    icon.className = 'fas fa-moon';
  }
}

/* ==========================================================================
   Charts Configuration (Chart.js)
   ========================================================================== */
function getChartColors() {
  const isDark = currentTheme === 'dark';
  return {
    text: isDark ? '#94a3b8' : '#64748b',
    grid: isDark ? 'rgba(255, 255, 255, 0.06)' : 'rgba(0, 0, 0, 0.05)',
    primary: isDark ? '#6366f1' : '#4f46e5',
    primaryLight: isDark ? 'rgba(99, 102, 241, 0.25)' : 'rgba(79, 70, 229, 0.15)',
    secondary: isDark ? '#06b6d4' : '#0284c7',
    secondaryLight: isDark ? 'rgba(6, 182, 212, 0.2)' : 'rgba(2, 132, 199, 0.15)',
    palette: ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ec4899']
  };
}

function initCharts() {
  const colors = getChartColors();

  // 1. Revenue & Sales Area Chart
  const ctxRevenue = document.getElementById('revenueChart');
  if (ctxRevenue) {
    const gradient1 = ctxRevenue.getContext('2d').createLinearGradient(0, 0, 0, 300);
    gradient1.addColorStop(0, colors.primaryLight);
    gradient1.addColorStop(1, 'rgba(99, 102, 241, 0)');

    const gradient2 = ctxRevenue.getContext('2d').createLinearGradient(0, 0, 0, 300);
    gradient2.addColorStop(0, colors.secondaryLight);
    gradient2.addColorStop(1, 'rgba(6, 182, 212, 0)');

    revenueChart = new Chart(ctxRevenue, {
      type: 'line',
      data: {
        labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'],
        datasets: [
          {
            label: 'Ingresos 2026 ($)',
            data: [32000, 41000, 39000, 52000, 61000, 58000, 74000, 89450, 92000, 87000, 98000, 115000],
            borderColor: colors.primary,
            backgroundColor: gradient1,
            fill: true,
            tension: 0.4,
            borderWidth: 3,
            pointBackgroundColor: colors.primary,
            pointBorderColor: '#ffffff',
            pointRadius: 4,
            pointHoverRadius: 7
          },
          {
            label: 'Objetivo Proyectado ($)',
            data: [28000, 35000, 42000, 48000, 55000, 62000, 70000, 78000, 85000, 92000, 100000, 110000],
            borderColor: colors.secondary,
            backgroundColor: gradient2,
            borderDash: [5, 5],
            fill: false,
            tension: 0.4,
            borderWidth: 2,
            pointRadius: 0
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false,
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: colors.text,
              usePointStyle: true,
              boxWidth: 8,
              font: { family: 'Plus Jakarta Sans', size: 12, weight: '600' }
            }
          },
          tooltip: {
            backgroundColor: currentTheme === 'dark' ? '#1e293b' : '#0f172a',
            titleColor: '#ffffff',
            bodyColor: '#e2e8f0',
            padding: 12,
            cornerRadius: 8,
            boxPadding: 6,
            callbacks: {
              label: (context) => ` ${context.dataset.label}: $${context.raw.toLocaleString()}`
            }
          }
        },
        scales: {
          x: {
            grid: { color: colors.grid, drawBorder: false },
            ticks: { color: colors.text, font: { family: 'Plus Jakarta Sans', size: 11 } }
          },
          y: {
            grid: { color: colors.grid, drawBorder: false },
            ticks: {
              color: colors.text,
              font: { family: 'Plus Jakarta Sans', size: 11 },
              callback: (value) => `$${value / 1000}k`
            }
          }
        }
      }
    });
  }

  // 2. Traffic Sources Doughnut Chart
  const ctxTraffic = document.getElementById('trafficChart');
  if (ctxTraffic) {
    trafficChart = new Chart(ctxTraffic, {
      type: 'doughnut',
      data: {
        labels: ['Directo', 'Orgánico', 'Redes Sociales', 'Referidos', 'Campañas'],
        datasets: [{
          data: [38, 27, 18, 11, 6],
          backgroundColor: colors.palette,
          borderWidth: 0,
          hoverOffset: 8
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        cutout: '72%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: {
              color: colors.text,
              usePointStyle: true,
              boxWidth: 8,
              padding: 16,
              font: { family: 'Plus Jakarta Sans', size: 11, weight: '500' }
            }
          },
          tooltip: {
            callbacks: {
              label: (context) => ` ${context.label}: ${context.raw}%`
            }
          }
        }
      }
    });
  }
}

function updateChartThemes() {
  const colors = getChartColors();
  if (revenueChart) {
    revenueChart.options.plugins.legend.labels.color = colors.text;
    revenueChart.options.scales.x.grid.color = colors.grid;
    revenueChart.options.scales.x.ticks.color = colors.text;
    revenueChart.options.scales.y.grid.color = colors.grid;
    revenueChart.options.scales.y.ticks.color = colors.text;
    revenueChart.update();
  }
  if (trafficChart) {
    trafficChart.options.plugins.legend.labels.color = colors.text;
    trafficChart.update();
  }
}

/* ==========================================================================
   Interactive Chart Filters (Day / Week / Month / Year)
   ========================================================================== */
function filterChartData(range) {
  activeRange = range;
  
  // Update UI Pills
  document.querySelectorAll('.pill-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.range === range);
  });

  if (!revenueChart) return;

  if (range === 'day') {
    revenueChart.data.labels = ['00:00', '04:00', '08:00', '12:00', '16:00', '20:00'];
    revenueChart.data.datasets[0].data = [1200, 800, 3400, 5800, 7200, 4600];
    revenueChart.data.datasets[1].data = [1000, 1000, 3000, 5000, 6500, 4000];
  } else if (range === 'week') {
    revenueChart.data.labels = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];
    revenueChart.data.datasets[0].data = [14200, 18500, 16900, 22400, 28900, 19500, 15300];
    revenueChart.data.datasets[1].data = [13000, 16000, 18000, 20000, 25000, 18000, 14000];
  } else if (range === 'month') {
    revenueChart.data.labels = ['Sem 1', 'Sem 2', 'Sem 3', 'Sem 4'];
    revenueChart.data.datasets[0].data = [21400, 24800, 19200, 28950];
    revenueChart.data.datasets[1].data = [20000, 22000, 23000, 26000];
  } else if (range === 'year') {
    revenueChart.data.labels = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    revenueChart.data.datasets[0].data = [32000, 41000, 39000, 52000, 61000, 58000, 74000, 89450, 92000, 87000, 98000, 115000];
    revenueChart.data.datasets[1].data = [28000, 35000, 42000, 48000, 55000, 62000, 70000, 78000, 85000, 92000, 100000, 110000];
  }

  revenueChart.update();
  showToast(`Visualizando métricas por: ${range.toUpperCase()}`);
}

/* ==========================================================================
   Transactions Table Rendering & Filtering
   ========================================================================== */
function renderTransactionsTable(filteredList = transactions) {
  const tbody = document.getElementById('transactions-body');
  if (!tbody) return;

  if (filteredList.length === 0) {
    tbody.innerHTML = `
      <tr>
        <td colspan="5" style="text-align: center; padding: 2rem; color: var(--text-muted);">
          No se encontraron transacciones coincidentes.
        </td>
      </tr>
    `;
    return;
  }

  tbody.innerHTML = filteredList.map(tx => {
    let badgeText = tx.status === 'completed' ? 'Completado' : tx.status === 'pending' ? 'Pendiente' : 'Cancelado';
    return `
      <tr>
        <td>
          <div class="customer-cell">
            <div class="customer-avatar" style="background-color: ${tx.avatarBg};">
              ${tx.avatar}
            </div>
            <div>
              <div style="font-weight: 600;">${tx.customer}</div>
              <div style="font-size: 0.75rem; color: var(--text-muted);">${tx.email}</div>
            </div>
          </div>
        </td>
        <td><span style="font-weight: 500;">${tx.product}</span></td>
        <td><span style="font-weight: 700;">${tx.amount}</span></td>
        <td><span style="color: var(--text-muted); font-size: 0.8rem;">${tx.date}</span></td>
        <td><span class="status-badge ${tx.status}">${badgeText}</span></td>
      </tr>
    `;
  }).join('');
}

function filterTransactions() {
  const query = document.getElementById('tableSearchInput')?.value.toLowerCase() || '';
  const filtered = transactions.filter(tx => 
    tx.customer.toLowerCase().includes(query) ||
    tx.email.toLowerCase().includes(query) ||
    tx.product.toLowerCase().includes(query) ||
    tx.id.toLowerCase().includes(query)
  );
  renderTransactionsTable(filtered);
}

/* ==========================================================================
   Modal & Event Listeners
   ========================================================================== */
function setupEventListeners() {
  // Theme Toggle Button
  document.getElementById('theme-toggle')?.addEventListener('click', toggleTheme);

  // Mobile Menu Toggle
  document.getElementById('menu-toggle')?.addEventListener('click', () => {
    document.querySelector('.sidebar')?.classList.toggle('open');
  });

  // Table Search Filter
  document.getElementById('tableSearchInput')?.addEventListener('input', filterTransactions);

  // Chart Pills
  document.querySelectorAll('.pill-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      filterChartData(btn.dataset.range);
    });
  });

  // Modal Open/Close
  const modal = document.getElementById('newTransactionModal');
  document.getElementById('btnNewTransaction')?.addEventListener('click', () => {
    modal.classList.add('active');
  });

  document.getElementById('closeModalBtn')?.addEventListener('click', () => {
    modal.classList.remove('active');
  });

  document.getElementById('cancelModalBtn')?.addEventListener('click', () => {
    modal.classList.remove('active');
  });

  // New Transaction Form Submission
  document.getElementById('newTransactionForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const customer = document.getElementById('custName').value;
    const email = document.getElementById('custEmail').value;
    const product = document.getElementById('productSelect').value;
    const amountVal = parseFloat(document.getElementById('amountInput').value) || 0;
    const status = document.getElementById('statusSelect').value;

    const initials = customer.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'TX';
    const colors = ['#6366f1', '#06b6d4', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newTx = {
      id: `TX-${Math.floor(1000 + Math.random() * 9000)}`,
      customer,
      email,
      avatar: initials,
      avatarBg: randomColor,
      product,
      amount: `$${amountVal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`,
      date: 'Ahora mismo',
      status
    };

    transactions.unshift(newTx);
    renderTransactionsTable();
    modal.classList.remove('active');
    document.getElementById('newTransactionForm').reset();
    showToast(`Transacción de ${customer} registrada con éxito`);
  });

  // Live Refresh Button
  document.getElementById('refreshBtn')?.addEventListener('click', () => {
    showToast('Actualizando datos en tiempo real...');
    setTimeout(() => {
      // Simulate live update
      const kpiRev = document.getElementById('kpi-revenue');
      if (kpiRev) {
        kpiRev.textContent = `$${(89450 + Math.floor(Math.random() * 500)).toLocaleString()}`;
      }
      showToast('Dashboard actualizado.');
    }, 600);
  });
}

/* ==========================================================================
   Toast Notification System
   ========================================================================== */
function showToast(message) {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <i class="fas fa-check-circle" style="color: var(--primary);"></i>
    <span style="font-size: 0.875rem; font-weight: 500;">${message}</span>
  `;

  container.appendChild(toast);

  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}
