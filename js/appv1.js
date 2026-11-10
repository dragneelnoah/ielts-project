const exerciseManifest = {
    line: [
        'line-global-carbon-emissions.json',
        'line-urban-population-growth.json',
        'line-e-commerce-sales-trends.json',
        'line-international-tourist-arrivals.json',
        'line-household-energy-bills.json',
        'line-smartphone-adoption-rates.json',
        'line-renewable-power-generation.json',
        'line-unemployment-rate-comparison.json',
        'line-public-library-visits.json',
        'line-freshwater-consumption.json'
    ],
    bar: [
        'bar-internet-penetration-rates.json',
        'bar-university-subject-enrollment.json',
        'bar-plastic-waste-recycling.json',
        'bar-household-expenditure-categories.json',
        'bar-global-coffee-production.json',
        'bar-electric-vehicle-market-share.json',
        'bar-air-travel-passenger-volume.json',
        'bar-fast-food-brand-revenue.json',
        'bar-working-hours-by-country.json',
        'bar-higher-education-graduates.json'
    ],
    pie: [
        'pie-eu-energy-sources-breakdown.json',
        'pie-household-water-usage.json',
        'pie-smartphone-operating-systems.json',
        'pie-land-use-distribution.json',
        'pie-student-commute-methods.json',
        'pie-online-streaming-market.json',
        'pie-global-e-waste-generation.json',
        'pie-municipal-waste-composition.json',
        'pie-tourist-spending-categories.json',
        'pie-renewable-energy-investment.json'
    ],
    table: [
        'table-monthly-city-weather.json',
        'table-employment-sectors-by-gender.json',
        'table-railway-passenger-statistics.json',
        'table-hotel-occupancy-and-room-rates.json',
        'table-agricultural-crop-yields.json',
        'table-university-ranking-metrics.json',
        'table-vehicle-fuel-efficiency.json',
        'table-commercial-shipping-fleet.json',
        'table-broadband-internet-costs.json',
        'table-public-transit-ridership.json'
    ]
};

class IELTSApp {
    constructor() {
        this.currentType = 'line';
        this.currentData = null;
        this.chartInstance = null;
        this.activeTab = 'form';
        this.initListeners();
    }

    initListeners() {
        const toggleBtn = document.getElementById('toggle-drawer-btn');
        const exerciseBtn = document.getElementById('exercise-btn');
        const mobileToggleBtn = document.getElementById('mobile-toggle-drawer-btn');
        const mobileExerciseBtn = document.getElementById('mobile-exercise-btn');
        const mobileMenuBtn = document.getElementById('mobile-menu-btn');
        const mobileDropdown = document.getElementById('mobile-dropdown');

        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggleDrawer());
        }
        if (exerciseBtn) {
            exerciseBtn.addEventListener('click', () => this.loadRandomExercise());
        }
        if (mobileToggleBtn) {
            mobileToggleBtn.addEventListener('click', () => {
                this.toggleDrawer();
                if (mobileDropdown) {
                    mobileDropdown.classList.add('hidden');
                    mobileDropdown.classList.remove('flex');
                }
            });
        }
        if (mobileExerciseBtn) {
            mobileExerciseBtn.addEventListener('click', () => {
                this.loadRandomExercise();
                if (mobileDropdown) {
                    mobileDropdown.classList.add('hidden');
                    mobileDropdown.classList.remove('flex');
                }
            });
        }

        if (mobileMenuBtn && mobileDropdown) {
            mobileMenuBtn.addEventListener('click', (e) => {
                e.stopPropagation();
                mobileDropdown.classList.toggle('hidden');
                mobileDropdown.classList.toggle('flex');
            });
            document.addEventListener('click', () => {
                mobileDropdown.classList.add('hidden');
                mobileDropdown.classList.remove('flex');
            });
        }
    }

    async selectGraphType(type) {
        this.currentType = type;
        document.getElementById('landing-view').classList.add('hidden');
        document.getElementById('workspace-view').classList.remove('hidden');

        // Hide footer on workspace to preserve vertical screen real estate
        const footer = document.getElementById('app-footer');
        if (footer) footer.classList.add('hidden');

        // Switch header layout from centered to space-between and show action container
        const header = document.getElementById('app-header');
        header.className = "bg-slate-800 border-b border-slate-700 px-6 py-3 flex items-center justify-between flex-shrink-0 z-30 shadow-md transition-all";
        const headerActions = document.getElementById('header-actions');
        headerActions.classList.remove('hidden');
        headerActions.classList.add('flex');

        document.getElementById('current-type-badge').innerText = type.toUpperCase() + ' GRAPH';

        await this.loadRandomExercise();
    }

    async loadRandomExercise() {
        const files = exerciseManifest[this.currentType];
        if (!files || files.length === 0) return;

        const randomIndex = Math.floor(Math.random() * files.length);
        const targetFile = files[randomIndex];
        const fetchUrl = `js/sample-questions/${this.currentType}/${targetFile}`;

        try {
            const res = await fetch(fetchUrl);
            if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
            const data = await res.json();
            this.currentData = data;
            this.renderWorkspace();
        } catch (err) {
            console.error('Failed to load JSON exercise:', err);
            alert('Failed to fetch exercise file. Ensure you are running this project on a local server or GitHub Pages.');
        }
    }

    returnToHome() {
        document.getElementById('workspace-view').classList.add('hidden');
        document.getElementById('landing-view').classList.remove('hidden');

        // Show footer again on landing
        const footer = document.getElementById('app-footer');
        if (footer) footer.classList.remove('hidden');

        // Switch header layout back to centered and hide action container
        const header = document.getElementById('app-header');
        header.className = "bg-slate-800 border-b border-slate-700 px-6 py-3 flex items-center justify-center flex-shrink-0 z-30 shadow-md transition-all";
        const headerActions = document.getElementById('header-actions');
        headerActions.classList.add('hidden');
        headerActions.classList.remove('flex');

        if (this.chartInstance) {
            this.chartInstance.destroy();
            this.chartInstance = null;
        }
    }

    toggleDrawer() {
        const drawer = document.getElementById('editor-drawer');
        drawer.classList.toggle('translate-x-full');
    }

    switchTab(tab) {
        this.activeTab = tab;
        const tabForm = document.getElementById('tab-form');
        const tabJson = document.getElementById('tab-json');
        const panelForm = document.getElementById('panel-form');
        const panelJson = document.getElementById('panel-json');

        if (tab === 'form') {
            tabForm.className = "flex-1 py-2.5 text-xs font-bold uppercase tracking-wider text-blue-400 border-b-2 border-blue-500 transition";
            tabJson.className = "flex-1 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-200 transition";
            panelForm.classList.remove('hidden');
            panelJson.classList.add('hidden');
        } else {
            tabJson.className = "flex-1 py-2.5 text-xs font-bold uppercase tracking-wider text-blue-400 border-b-2 border-blue-500 transition";
            tabForm.className = "flex-1 py-2.5 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-200 transition";
            panelJson.classList.remove('hidden');
            panelForm.classList.add('hidden');

            document.getElementById('input-json-raw').value = JSON.stringify(this.currentData, null, 2);
        }
    }

    renderWorkspace() {
        if (!this.currentData) return;

        document.getElementById('task-prompt-title').innerText = this.currentData.title;
        document.getElementById('task-prompt-desc').innerText = this.currentData.desc;

        const chartWrapper = document.getElementById('chart-container-wrapper');
        const tableWrapper = document.getElementById('table-container-wrapper');

        if (this.currentType === 'table') {
            chartWrapper.classList.add('hidden');
            tableWrapper.classList.remove('hidden');
            this.renderTableContent();
        } else {
            tableWrapper.classList.add('hidden');
            chartWrapper.classList.remove('hidden');
            this.renderChartContent();
        }

        this.populateFormFields();
    }

    renderChartContent() {
        const ctx = document.getElementById('ieltsChart').getContext('2d');
        if (this.chartInstance) {
            this.chartInstance.destroy();
        }

        let chartConfigType = this.currentType;
        if (chartConfigType === 'pie') chartConfigType = 'pie';
        else if (chartConfigType === 'bar') chartConfigType = 'bar';
        else chartConfigType = 'line';

        this.chartInstance = new Chart(ctx, {
            type: chartConfigType,
            data: {
                labels: this.currentData.labels,
                datasets: this.currentData.datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: { color: '#cbd5e1', font: { family: 'system-ui', size: 11 } }
                    }
                },
                scales: chartConfigType !== 'pie' ? {
                    x: { ticks: { color: '#94a3b8' }, grid: { color: '#334155' } },
                    y: { ticks: { color: '#94a3b8' }, grid: { color: '#334155' } }
                } : {}
            }
        });
    }

    renderTableContent() {
        const table = document.getElementById('ieltsTable');
        let html = `<thead><tr class="border-b border-slate-700 bg-slate-850">`;
        this.currentData.headers.forEach(h => {
            html += `<th class="p-2.5 text-xs font-bold uppercase tracking-wider text-slate-300">${h}</th>`;
        });
        html += `</tr></thead><tbody>`;

        this.currentData.rows.forEach((row) => {
            html += `<tr class="border-b border-slate-750 hover:bg-slate-750 transition">`;
            row.forEach((cell) => {
                html += `<td class="p-2.5 text-sm text-slate-300">${cell}</td>`;
            });
            html += `</tr>`;
        });
        html += `</tbody>`;
        table.innerHTML = html;
    }

    populateFormFields() {
        document.getElementById('input-title').value = this.currentData.title;
        document.getElementById('input-desc').value = this.currentData.desc;

        const container = document.getElementById('data-inputs-container');
        container.innerHTML = '';

        if (this.currentType === 'table') {
            container.innerHTML = `<p class="text-xs text-amber-400">Table data editing is best handled in JSON mode for rows & columns.</p>`;
            return;
        }

        let html = `<div class="mb-3"><label class="block text-xs text-slate-400 mb-1 font-semibold">Labels (Comma separated)</label>`;
        html += `<input type="text" id="form-labels" value="${this.currentData.labels.join(', ')}" class="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-1.5 text-sm text-white"></div>`;

        this.currentData.datasets.forEach((ds, dIdx) => {
            html += `<div class="bg-slate-900/60 p-2.5 rounded-xl border border-slate-700 space-y-1.5">`;
            html += `<div class="flex justify-between items-center"><span class="text-xs font-bold text-blue-400">Series: ${ds.label || 'Data Points'}</span></div>`;
            html += `<input type="text" data-dataset-index="${dIdx}" class="dataset-data-input w-full bg-slate-950 border border-slate-700 rounded px-2 py-1 text-xs text-emerald-400" value="${ds.data.join(', ')}">`;
            html += `</div>`;
        });

        container.innerHTML = html;
    }

    updateChartFromForm() {
        this.currentData.title = document.getElementById('input-title').value;
        this.currentData.desc = document.getElementById('input-desc').value;

        if (this.currentType !== 'table') {
            const labelsInput = document.getElementById('form-labels');
            if (labelsInput) {
                this.currentData.labels = labelsInput.value.split(',').map(s => s.trim());
            }

            const dsInputs = document.querySelectorAll('.dataset-data-input');
            dsInputs.forEach(input => {
                const idx = parseInt(input.getAttribute('data-dataset-index'));
                const vals = input.value.split(',').map(s => parseFloat(s.trim()) || 0);
                this.currentData.datasets[idx].data = vals;
            });
        }

        this.renderWorkspace();
    }

    applyJson() {
        try {
            const raw = document.getElementById('input-json-raw').value;
            const parsed = JSON.parse(raw);
            this.currentData = parsed;
            this.renderWorkspace();
            alert('JSON applied successfully!');
        } catch (e) {
            alert('Invalid JSON format. Please check your syntax.');
        }
    }
}

const app = new IELTSApp();
