// Carbon Footprint Calculator JavaScript
class CarbonFootprintCalculator {
    constructor() {
        this.initializeElements();
        this.initializeEventListeners();
        this.initializeCharts();
        this.loadData();
        this.footprintHistory = this.getFootprintHistory();
    }

    initializeElements() {
        // Form elements
        this.form = document.getElementById('carbonForm');
        this.resultsSection = document.getElementById('results');
        
        // Input elements
        this.inputs = {
            carMiles: document.getElementById('carMiles'),
            carType: document.getElementById('carType'),
            publicTransport: document.getElementById('publicTransport'),
            transportType: document.getElementById('transportType'),
            flights: document.getElementById('flights'),
            flightType: document.getElementById('flightType'),
            electricity: document.getElementById('electricity'),
            energySource: document.getElementById('energySource'),
            naturalGas: document.getElementById('naturalGas'),
            heatingOil: document.getElementById('heatingOil'),
            shopping: document.getElementById('shopping'),
            services: document.getElementById('services'),
            waste: document.getElementById('waste')
        };
        
        // Result elements
        this.resultElements = {
            totalFootprint: document.getElementById('totalFootprint'),
            comparisonText: document.getElementById('comparisonText'),
            comparisonFill: document.getElementById('comparisonFill'),
            transportPercent: document.getElementById('transportPercent'),
            energyPercent: document.getElementById('energyPercent'),
            dietPercent: document.getElementById('dietPercent'),
            consumptionPercent: document.getElementById('consumptionPercent')
        };
        
        // Chart elements
        this.trendChart = null;
        this.pieChart = null;
        this.categoryTrendChart = null;
    }

    initializeEventListeners() {
        // Form submission
        this.form.addEventListener('submit', (e) => {
            e.preventDefault();
            this.calculateFootprint();
        });

        // Navigation
        document.getElementById('navToggle').addEventListener('click', () => {
            document.querySelector('.nav-menu').classList.toggle('active');
        });

        // Smooth scrolling for navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                this.scrollToSection(targetId);
            });
        });

        // Real-time calculation updates
        Object.values(this.inputs).forEach(input => {
            if (input && input.type === 'number') {
                input.addEventListener('input', () => {
                    this.updateRealTimeCalculation();
                });
            }
        });
    }

    // Carbon emission factors (kg CO2 per unit)
    getEmissionFactors() {
        return {
            transportation: {
                car: {
                    gasoline: 0.404,      // kg CO2 per mile
                    hybrid: 0.226,        // kg CO2 per mile
                    electric: 0.090       // kg CO2 per mile (including electricity generation)
                },
                publicTransport: {
                    bus: 0.089,           // kg CO2 per mile
                    train: 0.041,         // kg CO2 per mile
                    subway: 0.035         // kg CO2 per mile
                },
                flights: {
                    short: 250,           // kg CO2 per flight
                    medium: 500,          // kg CO2 per flight
                    long: 1000            // kg CO2 per flight
                }
            },
            energy: {
                electricity: {
                    grid: 0.4,            // kg CO2 per kWh
                    renewable: 0.05,      // kg CO2 per kWh
                    coal: 0.9             // kg CO2 per kWh
                },
                naturalGas: 5.3,         // kg CO2 per therm
                heatingOil: 10.2         // kg CO2 per gallon
            },
            diet: {
                meatHeavy: 3.3,          // kg CO2 per day
                average: 2.5,            // kg CO2 per day
                vegetarian: 1.7,         // kg CO2 per day
                vegan: 1.5               // kg CO2 per day
            },
            consumption: {
                shopping: 0.05,          // kg CO2 per dollar
                services: 0.03,          // kg CO2 per dollar
                waste: 0.5               // kg CO2 per pound
            }
        };
    }

    calculateFootprint() {
        const factors = this.getEmissionFactors();
        const monthlyFootprint = {
            transportation: 0,
            energy: 0,
            diet: 0,
            consumption: 0
        };

        // Transportation calculations
        const carMiles = parseFloat(this.inputs.carMiles.value) || 0;
        const carType = this.inputs.carType.value;
        monthlyFootprint.transportation += carMiles * factors.transportation.car[carType] * 30; // Monthly

        const publicTransportMiles = parseFloat(this.inputs.publicTransport.value) || 0;
        const transportType = this.inputs.transportType.value;
        monthlyFootprint.transportation += publicTransportMiles * factors.transportation.publicTransport[transportType] * 30;

        const flights = parseFloat(this.inputs.flights.value) || 0;
        const flightType = this.inputs.flightType.value;
        monthlyFootprint.transportation += flights * factors.transportation.flights[flightType];

        // Energy calculations
        const electricity = parseFloat(this.inputs.electricity.value) || 0;
        const energySource = this.inputs.energySource.value;
        monthlyFootprint.energy += electricity * factors.energy.electricity[energySource];

        const naturalGas = parseFloat(this.inputs.naturalGas.value) || 0;
        monthlyFootprint.energy += naturalGas * factors.energy.naturalGas;

        const heatingOil = parseFloat(this.inputs.heatingOil.value) || 0;
        monthlyFootprint.energy += heatingOil * factors.energy.heatingOil;

        // Diet calculations
        const dietType = document.querySelector('input[name="diet"]:checked').value;
        monthlyFootprint.diet += factors.diet[dietType] * 30; // Monthly

        // Consumption calculations
        const shopping = parseFloat(this.inputs.shopping.value) || 0;
        monthlyFootprint.consumption += shopping * factors.consumption.shopping;

        const services = parseFloat(this.inputs.services.value) || 0;
        monthlyFootprint.consumption += services * factors.consumption.services;

        const waste = parseFloat(this.inputs.waste.value) || 0;
        monthlyFootprint.consumption += waste * factors.consumption.waste * 4; // Weekly to monthly

        // Calculate total
        const total = Object.values(monthlyFootprint).reduce((sum, value) => sum + value, 0);

        // Display results
        this.displayResults(total, monthlyFootprint);
        
        // Save to history
        this.saveFootprintToHistory(total, monthlyFootprint);
        
        // Update recommendations
        this.updateRecommendations(monthlyFootprint);
        
        // Update charts
        this.updateCharts(total, monthlyFootprint);
        
        // Update achievements
        this.checkAchievements();
    }

    displayResults(total, breakdown) {
        // Show results section
        this.resultsSection.style.display = 'block';
        
        // Animate total number
        this.animateNumber(this.resultElements.totalFootprint, 0, total, 2000);
        
        // Comparison with average (400 kg CO2/month is average)
        const average = 400;
        const percentage = ((total - average) / average) * 100;
        
        if (total < average) {
            this.resultElements.comparisonText.textContent = `${Math.abs(percentage).toFixed(1)}% below average`;
            this.resultElements.comparisonFill.style.width = `${Math.min(100, (total / average) * 100)}%`;
        } else {
            this.resultElements.comparisonText.textContent = `${percentage.toFixed(1)}% above average`;
            this.resultElements.comparisonFill.style.width = `${Math.min(100, (total / average) * 100)}%`;
        }
        
        // Update breakdown percentages
        this.resultElements.transportPercent.textContent = `${((breakdown.transportation / total) * 100).toFixed(1)}%`;
        this.resultElements.energyPercent.textContent = `${((breakdown.energy / total) * 100).toFixed(1)}%`;
        this.resultElements.dietPercent.textContent = `${((breakdown.diet / total) * 100).toFixed(1)}%`;
        this.resultElements.consumptionPercent.textContent = `${((breakdown.consumption / total) * 100).toFixed(1)}%`;
        
        // Scroll to results
        setTimeout(() => {
            this.scrollToSection('results');
        }, 500);
    }

    animateNumber(element, start, end, duration) {
        const startTime = performance.now();
        
        const updateNumber = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            const current = start + (end - start) * this.easeOutQuad(progress);
            element.textContent = current.toFixed(1);
            
            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            }
        };
        
        requestAnimationFrame(updateNumber);
    }

    easeOutQuad(t) {
        return t * (2 - t);
    }

    updateRealTimeCalculation() {
        // Optional: Show real-time updates as user types
        // This could show a live preview of the footprint
    }

    initializeCharts() {
        // Trend Chart
        const trendCtx = document.getElementById('trendChart');
        if (trendCtx) {
            this.trendChart = new Chart(trendCtx, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [{
                        label: 'Monthly Carbon Footprint (kg CO₂)',
                        data: [],
                        borderColor: '#10b981',
                        backgroundColor: 'rgba(16, 185, 129, 0.1)',
                        borderWidth: 3,
                        tension: 0.4,
                        fill: true,
                        pointBackgroundColor: '#10b981',
                        pointBorderColor: '#fff',
                        pointBorderWidth: 2,
                        pointRadius: 5,
                        pointHoverRadius: 7
                    }]
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
                            display: true,
                            position: 'top',
                            labels: {
                                font: {
                                    size: 14,
                                    weight: '500'
                                },
                                usePointStyle: true,
                                padding: 20
                            }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            titleFont: {
                                size: 14
                            },
                            bodyFont: {
                                size: 13
                            },
                            padding: 12,
                            cornerRadius: 8,
                            displayColors: false,
                            callbacks: {
                                label: function(context) {
                                    return `Carbon Footprint: ${context.parsed.y.toFixed(1)} kg CO₂`;
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'kg CO₂',
                                font: {
                                    size: 14,
                                    weight: '500'
                                }
                            },
                            grid: {
                                color: 'rgba(0, 0, 0, 0.05)'
                            },
                            ticks: {
                                font: {
                                    size: 12
                                }
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Month',
                                font: {
                                    size: 14,
                                    weight: '500'
                                }
                            },
                            grid: {
                                display: false
                            },
                            ticks: {
                                font: {
                                    size: 12
                                }
                            }
                        }
                    }
                }
            });
        }

        // Pie Chart
        const pieCtx = document.getElementById('pieChart');
        if (pieCtx) {
            this.pieChart = new Chart(pieCtx, {
                type: 'doughnut',
                data: {
                    labels: ['Transportation', 'Home Energy', 'Diet', 'Consumption'],
                    datasets: [{
                        data: [0, 0, 0, 0],
                        backgroundColor: [
                            '#3b82f6',
                            '#f59e0b',
                            '#10b981',
                            '#8b5cf6'
                        ],
                        borderColor: '#fff',
                        borderWidth: 3,
                        hoverOffset: 8
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                        legend: {
                            position: 'bottom',
                            labels: {
                                font: {
                                    size: 13,
                                    weight: '500'
                                },
                                padding: 20,
                                usePointStyle: true,
                                pointStyle: 'circle'
                            }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            titleFont: {
                                size: 14
                            },
                            bodyFont: {
                                size: 13
                            },
                            padding: 12,
                            cornerRadius: 8,
                            callbacks: {
                                label: function(context) {
                                    const total = context.dataset.data.reduce((a, b) => a + b, 0);
                                    const percentage = ((context.parsed / total) * 100).toFixed(1);
                                    return `${context.label}: ${context.parsed.toFixed(1)} kg CO₂ (${percentage}%)`;
                                }
                            }
                        }
                    },
                    cutout: '60%'
                }
            });
        }

        // Category Trend Chart
        const categoryTrendCtx = document.getElementById('categoryTrendChart');
        if (categoryTrendCtx) {
            this.categoryTrendChart = new Chart(categoryTrendCtx, {
                type: 'line',
                data: {
                    labels: [],
                    datasets: [
                        {
                            label: 'Transportation',
                            data: [],
                            borderColor: '#3b82f6',
                            backgroundColor: 'rgba(59, 130, 246, 0.1)',
                            borderWidth: 2,
                            tension: 0.3,
                            fill: true
                        },
                        {
                            label: 'Home Energy',
                            data: [],
                            borderColor: '#f59e0b',
                            backgroundColor: 'rgba(245, 158, 11, 0.1)',
                            borderWidth: 2,
                            tension: 0.3,
                            fill: true
                        },
                        {
                            label: 'Diet',
                            data: [],
                            borderColor: '#10b981',
                            backgroundColor: 'rgba(16, 185, 129, 0.1)',
                            borderWidth: 2,
                            tension: 0.3,
                            fill: true
                        },
                        {
                            label: 'Consumption',
                            data: [],
                            borderColor: '#8b5cf6',
                            backgroundColor: 'rgba(139, 92, 246, 0.1)',
                            borderWidth: 2,
                            tension: 0.3,
                            fill: true
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
                            display: true,
                            position: 'top',
                            labels: {
                                font: {
                                    size: 12,
                                    weight: '500'
                                },
                                usePointStyle: true,
                                padding: 15
                            }
                        },
                        tooltip: {
                            backgroundColor: 'rgba(0, 0, 0, 0.8)',
                            titleFont: {
                                size: 14
                            },
                            bodyFont: {
                                size: 12
                            },
                            padding: 12,
                            cornerRadius: 8,
                            callbacks: {
                                label: function(context) {
                                    return `${context.dataset.label}: ${context.parsed.y.toFixed(1)} kg CO₂`;
                                }
                            }
                        }
                    },
                    scales: {
                        y: {
                            beginAtZero: true,
                            title: {
                                display: true,
                                text: 'kg CO₂',
                                font: {
                                    size: 14,
                                    weight: '500'
                                }
                            },
                            grid: {
                                color: 'rgba(0, 0, 0, 0.05)'
                            },
                            ticks: {
                                font: {
                                    size: 12
                                }
                            }
                        },
                        x: {
                            title: {
                                display: true,
                                text: 'Month',
                                font: {
                                    size: 14,
                                    weight: '500'
                                }
                            },
                            grid: {
                                display: false
                            },
                            ticks: {
                                font: {
                                    size: 12
                                }
                            }
                        }
                    }
                }
            });
        }
    }

    updateCharts(total, breakdown) {
        // Update trend chart
        if (this.trendChart) {
            const today = new Date();
            const monthYear = today.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            
            // Check if we already have data for this month
            const existingIndex = this.trendChart.data.labels.findIndex(label => label === monthYear);
            
            if (existingIndex !== -1) {
                // Update existing month data
                this.trendChart.data.datasets[0].data[existingIndex] = total;
            } else {
                // Add new month data
                this.trendChart.data.labels.push(monthYear);
                this.trendChart.data.datasets[0].data.push(total);
                
                // Keep only last 12 months
                if (this.trendChart.data.labels.length > 12) {
                    this.trendChart.data.labels.shift();
                    this.trendChart.data.datasets[0].data.shift();
                }
            }
            
            // Add average line if we have enough data
            if (this.trendChart.data.datasets[0].data.length > 1) {
                const avgValue = this.trendChart.data.datasets[0].data.reduce((a, b) => a + b, 0) / this.trendChart.data.datasets[0].data.length;
                
                if (this.trendChart.data.datasets.length === 1) {
                    this.trendChart.data.datasets.push({
                        label: 'Average (400 kg CO₂)',
                        data: new Array(this.trendChart.data.labels.length).fill(400),
                        borderColor: '#ef4444',
                        backgroundColor: 'transparent',
                        borderWidth: 2,
                        borderDash: [5, 5],
                        tension: 0,
                        fill: false,
                        pointRadius: 0,
                        pointHoverRadius: 0
                    });
                } else {
                    this.trendChart.data.datasets[1].data = new Array(this.trendChart.data.labels.length).fill(400);
                }
            }
            
            this.trendChart.update();
        }

        // Update pie chart
        if (this.pieChart) {
            this.pieChart.data.datasets[0].data = [
                breakdown.transportation,
                breakdown.energy,
                breakdown.diet,
                breakdown.consumption
            ];
            this.pieChart.update();
        }

        // Update category trend chart
        if (this.categoryTrendChart) {
            const monthYear = new Date().toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
            
            // Check if we already have data for this month
            const existingIndex = this.categoryTrendChart.data.labels.findIndex(label => label === monthYear);
            
            if (existingIndex !== -1) {
                // Update existing month data
                this.categoryTrendChart.data.datasets[0].data[existingIndex] = breakdown.transportation;
                this.categoryTrendChart.data.datasets[1].data[existingIndex] = breakdown.energy;
                this.categoryTrendChart.data.datasets[2].data[existingIndex] = breakdown.diet;
                this.categoryTrendChart.data.datasets[3].data[existingIndex] = breakdown.consumption;
            } else {
                // Add new month data
                this.categoryTrendChart.data.labels.push(monthYear);
                this.categoryTrendChart.data.datasets[0].data.push(breakdown.transportation);
                this.categoryTrendChart.data.datasets[1].data.push(breakdown.energy);
                this.categoryTrendChart.data.datasets[2].data.push(breakdown.diet);
                this.categoryTrendChart.data.datasets[3].data.push(breakdown.consumption);
                
                // Keep only last 12 months
                if (this.categoryTrendChart.data.labels.length > 12) {
                    this.categoryTrendChart.data.labels.shift();
                    this.categoryTrendChart.data.datasets.forEach(dataset => {
                        dataset.data.shift();
                    });
                }
            }
            
            this.categoryTrendChart.update();
        }
    }

    updateRecommendations(breakdown) {
        const recommendations = this.generateRecommendations(breakdown);
        const grid = document.getElementById('recommendationsGrid');
        
        grid.innerHTML = '';
        
        recommendations.forEach(rec => {
            const card = this.createRecommendationCard(rec);
            grid.appendChild(card);
        });
    }

    generateRecommendations(breakdown) {
        const recommendations = [];
        const total = Object.values(breakdown).reduce((sum, value) => sum + value, 0);
        
        // Transportation recommendations
        if (breakdown.transportation > total * 0.3) {
            recommendations.push({
                title: 'Reduce Car Usage',
                description: 'Consider carpooling, public transportation, or biking for shorter trips. Even reducing car usage by 20% can significantly lower your footprint.',
                impact: 'high',
                savings: '50-100 kg CO₂/month',
                icon: 'fa-car'
            });
        }
        
        // Energy recommendations
        if (breakdown.energy > total * 0.3) {
            recommendations.push({
                title: 'Switch to Renewable Energy',
                description: 'Contact your utility provider about green energy options or consider installing solar panels to reduce your home energy emissions.',
                impact: 'high',
                savings: '30-80 kg CO₂/month',
                icon: 'fa-solar-panel'
            });
            
            recommendations.push({
                title: 'Improve Home Efficiency',
                description: 'Add insulation, use LED bulbs, and upgrade to energy-efficient appliances to reduce your energy consumption.',
                impact: 'medium',
                savings: '20-50 kg CO₂/month',
                icon: 'fa-lightbulb'
            });
        }
        
        // Diet recommendations
        if (breakdown.diet > total * 0.2) {
            recommendations.push({
                title: 'Try Meatless Mondays',
                description: 'Reducing meat consumption, even one day per week, can significantly lower your dietary carbon footprint.',
                impact: 'medium',
                savings: '15-30 kg CO₂/month',
                icon: 'fa-leaf'
            });
        }
        
        // Consumption recommendations
        if (breakdown.consumption > total * 0.2) {
            recommendations.push({
                title: 'Buy Less, Choose Well',
                description: 'Focus on quality over quantity, buy second-hand when possible, and support sustainable brands.',
                impact: 'medium',
                savings: '10-25 kg CO₂/month',
                icon: 'fa-shopping-bag'
            });
            
            recommendations.push({
                title: 'Reduce Waste',
                description: 'Compost organic waste, recycle properly, and choose products with minimal packaging.',
                impact: 'low',
                savings: '5-15 kg CO₂/month',
                icon: 'fa-recycle'
            });
        }
        
        // Always include some general tips
        recommendations.push({
            title: 'Plant Trees',
            description: 'Support reforestation efforts or plant trees in your community. One tree can absorb 22 kg of CO₂ per year.',
            impact: 'low',
            savings: '2 kg CO₂/month per tree',
            icon: 'fa-tree'
        });
        
        return recommendations.slice(0, 6); // Limit to 6 recommendations
    }

    createRecommendationCard(recommendation) {
        const card = document.createElement('div');
        card.className = `recommendation-card ${recommendation.impact}-impact`;
        
        card.innerHTML = `
            <div class="recommendation-header">
                <div class="recommendation-icon">
                    <i class="fas ${recommendation.icon}"></i>
                </div>
                <h3 class="recommendation-title">${recommendation.title}</h3>
            </div>
            <p class="recommendation-description">${recommendation.description}</p>
            <div class="recommendation-impact">
                <span class="impact-label">Potential Savings:</span>
                <span class="impact-value">${recommendation.savings}</span>
            </div>
        `;
        
        return card;
    }

    checkAchievements() {
        const achievements = [
            { id: 'achievement1', condition: () => this.footprintHistory.length >= 1 },
            { id: 'achievement2', condition: () => this.footprintHistory.length >= 2 && this.getReductionPercentage() >= 20 },
            { id: 'achievement3', condition: () => this.footprintHistory.length >= 30 }
        ];
        
        achievements.forEach(achievement => {
            const element = document.getElementById(achievement.id);
            if (element && achievement.condition()) {
                element.classList.add('unlocked');
            }
        });
        
        // Update goal progress
        this.updateGoalProgress();
    }

    updateGoalProgress() {
        if (this.footprintHistory.length < 2) return;
        
        const initial = this.footprintHistory[0].total;
        const current = this.footprintHistory[this.footprintHistory.length - 1].total;
        const reduction = ((initial - current) / initial) * 100;
        
        const goalProgress = document.getElementById('goalProgress');
        const goalPercent = document.getElementById('goalPercent');
        
        if (goalProgress && goalPercent) {
            const progress = Math.min(100, Math.max(0, reduction));
            goalProgress.style.width = `${progress}%`;
            goalPercent.textContent = `${progress.toFixed(1)}%`;
        }
    }

    getReductionPercentage() {
        if (this.footprintHistory.length < 2) return 0;
        
        const initial = this.footprintHistory[0].total;
        const current = this.footprintHistory[this.footprintHistory.length - 1].total;
        return ((initial - current) / initial) * 100;
    }

    saveFootprintToHistory(total, breakdown) {
        const entry = {
            date: new Date().toISOString(),
            total: total,
            breakdown: breakdown
        };
        
        this.footprintHistory.push(entry);
        
        // Keep only last 365 entries (1 year)
        if (this.footprintHistory.length > 365) {
            this.footprintHistory.shift();
        }
        
        // Save to localStorage
        localStorage.setItem('footprintHistory', JSON.stringify(this.footprintHistory));
    }

    getFootprintHistory() {
        const saved = localStorage.getItem('footprintHistory');
        return saved ? JSON.parse(saved) : [];
    }

    loadData() {
        // Load any saved data
        this.footprintHistory = this.getFootprintHistory();
        
        // Update charts with historical data
        if (this.footprintHistory.length > 0) {
            const latest = this.footprintHistory[this.footprintHistory.length - 1];
            this.updateCharts(latest.total, latest.breakdown);
            
            // Load historical data for category trend chart
            if (this.categoryTrendChart && this.footprintHistory.length > 1) {
                const monthlyData = {};
                
                // Group data by month
                this.footprintHistory.forEach(entry => {
                    const monthYear = new Date(entry.date).toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
                    if (!monthlyData[monthYear]) {
                        monthlyData[monthYear] = {
                            transportation: [],
                            energy: [],
                            diet: [],
                            consumption: []
                        };
                    }
                    monthlyData[monthYear].transportation.push(entry.breakdown.transportation);
                    monthlyData[monthYear].energy.push(entry.breakdown.energy);
                    monthlyData[monthYear].diet.push(entry.breakdown.diet);
                    monthlyData[monthYear].consumption.push(entry.breakdown.consumption);
                });
                
                // Calculate averages and update chart
                const sortedMonths = Object.keys(monthlyData).slice(-12); // Last 12 months
                this.categoryTrendChart.data.labels = sortedMonths;
                
                sortedMonths.forEach(month => {
                    const data = monthlyData[month];
                    this.categoryTrendChart.data.datasets[0].data.push(
                        data.transportation.reduce((a, b) => a + b, 0) / data.transportation.length
                    );
                    this.categoryTrendChart.data.datasets[1].data.push(
                        data.energy.reduce((a, b) => a + b, 0) / data.energy.length
                    );
                    this.categoryTrendChart.data.datasets[2].data.push(
                        data.diet.reduce((a, b) => a + b, 0) / data.diet.length
                    );
                    this.categoryTrendChart.data.datasets[3].data.push(
                        data.consumption.reduce((a, b) => a + b, 0) / data.consumption.length
                    );
                });
                
                this.categoryTrendChart.update();
            }
        }
        
        // Animate hero stats
        this.animateHeroStats();
    }

    animateHeroStats() {
        const animateStat = (elementId, targetValue, suffix = '') => {
            const element = document.getElementById(elementId);
            if (!element) return;
            
            const duration = 2000;
            const startTime = performance.now();
            const startValue = 0;
            
            const updateStat = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                const current = startValue + (targetValue - startValue) * this.easeOutQuad(progress);
                
                if (typeof targetValue === 'number') {
                    element.textContent = current.toLocaleString() + suffix;
                } else {
                    element.textContent = targetValue;
                }
                
                if (progress < 1) {
                    requestAnimationFrame(updateStat);
                }
            };
            
            requestAnimationFrame(updateStat);
        };
        
        animateStat('totalUsers', 12453);
        animateStat('totalCO2Saved', 2300000, 'M');
        animateStat('treesEquivalent', 45678);
    }

    scrollToSection(sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.scrollIntoView({ behavior: 'smooth' });
        }
    }
}

// Initialize the calculator when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new CarbonFootprintCalculator();
});

// Utility function for global access
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
    }
}
