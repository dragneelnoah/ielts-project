const sampleDatasets = {
    line: {
        type: 'line',
        title: 'Global Carbon Emissions by Sector (2000 - 2020)',
        desc: 'The line graph compares carbon dioxide emissions in millions of tonnes across four main industrial sectors over a twenty-year span.',
        labels: ['2000', '2005', '2010', '2015', '2020'],
        datasets: [
            { label: 'Energy Supply', data: [42, 48, 55, 60, 58], borderColor: '#3b82f6', backgroundColor: '#3b82f6', tension: 0.3 },
            { label: 'Industry', data: [25, 28, 30, 32, 29], borderColor: '#10b981', backgroundColor: '#10b981', tension: 0.3 },
            { label: 'Transport', data: [18, 22, 26, 31, 35], borderColor: '#f59e0b', backgroundColor: '#f59e0b', tension: 0.3 },
            { label: 'Agriculture', data: [12, 13, 14, 15, 16], borderColor: '#ec4899', backgroundColor: '#ec4899', tension: 0.3 }
        ]
    },
    bar: {
        type: 'bar',
        title: 'Internet Penetration Rates in Selected Countries (2024)',
        desc: 'The bar chart illustrates the percentage of the population with regular internet access across five nations in 2024.',
        labels: ['Norway', 'South Korea', 'Canada', 'Brazil', 'Nigeria'],
        datasets: [
            { label: 'Internet Penetration (%)', data: [99, 98, 93, 84, 52], backgroundColor: ['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'] }
        ]
    },
    pie: {
        type: 'pie',
        title: 'Proportion of Energy Sources in European Union (2023)',
        desc: 'The pie chart breaks down the percentage share of different energy generation sources across the EU in 2023.',
        labels: ['Renewables', 'Nuclear', 'Natural Gas', 'Coal', 'Oil'],
        datasets: [
            { data: [42, 23, 18, 11, 6], backgroundColor: ['#10b981', '#3b82f6', '#f59e0b', '#64748b', '#ef4444'] }
        ]
    },
    table: {
        type: 'table',
        title: 'Average Monthly Temperature and Rainfall in City X',
        desc: 'The table details the average monthly temperatures (in °C) and total rainfall (in mm) in a metropolitan area throughout the year.',
        headers: ['Month', 'Temperature (°C)', 'Rainfall (mm)', 'Sunshine Hours'],
        rows: [
            ['January', '4.2', '85', '60'],
            ['April', '12.5', '50', '180'],
            ['July', '22.1', '35', '290'],
            ['October', '11.0', '70', '110']
        ]
    }
};

class IELTSApp {
    constructor() {
        this.currentType = 'line';
        this.currentData = JSON.parse(JSON.stringify(sampleDatasets.line));
        this.chartInstance = null;
        this.activeTab = 'form';
        this.initListeners();
    }

    initListeners() {
        const toggleBtn = document.getElementById('toggle-drawer-btn');
        const randomizeBtn = document.getElementById('randomize-btn');
        
        if (toggleBtn) {
            toggleBtn.addEventListener('click', () => this.toggleDrawer());
        }
        if (randomizeBtn) {
            randomizeBtn.addEventListener('click', () => this.randomizeCurrentData());
        }
    }

    selectGraphType(type) {
        this.currentType = type;
        this.currentData = JSON.parse(JSON.stringify(sampleDatasets[type] || sampleDatasets.line));
        
        document.getElementById('landing-view').classList.add('hidden');
        document.getElementById('workspace-view').classList.remove('hidden');
        
        document.getElementById('current-type-badge').innerText = type.toUpperCase() + ' GRAPH';
        
        this.renderWorkspace();
    }

    returnToHome() {
        document.getElementById('workspace-view').classList.add('hidden');
        document.getElementById('landing-view').classList.remove('hidden');
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
            tabForm.className = "flex-1 py-3 text-xs font-bold uppercase tracking-wider text-blue-400 border-b-2 border-blue-500 transition";
            tabJson.className = "flex-1 py-3 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-200 transition";
            panelForm.classList.remove('hidden');
            panelJson.classList.add('hidden');
        } else {
            tabJson.className = "flex-1 py-3 text-xs font-bold uppercase tracking-wider text-blue-400 border-b-2 border-blue-500 transition";
            tabForm.className = "flex-1 py-3 text-xs font-bold uppercase tracking-wider text-slate-400 hover:text-slate-200 transition";
            panelJson.classList.remove('hidden');
            panelForm.classList.add('hidden');

            document.getElementById('input-json-raw').value = JSON.stringify(this.currentData, null, 2);
        }
    }

    renderWorkspace() {
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
                        labels: { color: '#cbd5e1', font: { family: 'system-ui', size: 12 } }
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
            html += `<th class="p-3 text-xs font-bold uppercase tracking-wider text-slate-300">${h}</th>`;
        });
        html += `</tr></thead><tbody>`;

        this.currentData.rows.forEach((row) => {
            html += `<tr class="border-b border-slate-750 hover:bg-slate-750 transition">`;
            row.forEach((cell) => {
                html += `<td class="p-3 text-sm text-slate-300">${cell}</td>`;
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
            html += `<div class="bg-slate-900/60 p-3 rounded-xl border border-slate-700 space-y-2">`;
            html += `<div class="flex justify-between items-center"><span class="text-xs font-bold text-blue-400">Series: ${ds.label}</span></div>`;
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

    randomizeCurrentData() {
        if (this.currentType === 'line') {
            const randomVals1 = Array.from({length: 5}, () => Math.floor(Math.random() * 60) + 10);
            const randomVals2 = Array.from({length: 5}, () => Math.floor(Math.random() * 50) + 15);
            const randomVals3 = Array.from({length: 5}, () => Math.floor(Math.random() * 40) + 5);
            this.currentData.datasets[0].data = randomVals1;
            this.currentData.datasets[1].data = randomVals2;
            this.currentData.datasets[2].data = randomVals3;
            this.currentData.title = 'Randomized Global Sector Trends';
        } else if (this.currentType === 'bar') {
            const randomVals = Array.from({length: 5}, () => Math.floor(Math.random() * 80) + 20);
            this.currentData.datasets[0].data = randomVals;
            this.currentData.title = 'Randomized Regional Comparison Metrics';
        } else if (this.currentType === 'pie') {
            let r1 = Math.floor(Math.random() * 40) + 20;
            let r2 = Math.floor(Math.random() * 30) + 10;
            let r3 = 100 - (r1 + r2);
            if (r3 < 5) r3 = 5;
            this.currentData.datasets[0].data = [r1, r2, r3, 100 - (r1 + r2 + r3)];
            this.currentData.title = 'Randomized Proportional Share Distribution';
        }
        this.renderWorkspace();
    }
}

const app = new IELTSApp();
