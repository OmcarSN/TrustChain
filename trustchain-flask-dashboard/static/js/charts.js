document.addEventListener('DOMContentLoaded', function() {
    const ctx = document.getElementById('growthChart').getContext('2d');
    
    const labels = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];
    const dataValues = [1, 2, 1, 3, 2, 4, 3];

    let currentType = 'line';

    const chartConfig = {
        type: currentType,
        data: {
            labels: labels,
            datasets: [{
                label: 'System Growth',
                data: dataValues,
                borderColor: '#ffffff',
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderWidth: 2,
                fill: true,
                tension: 0.4,
                pointBackgroundColor: '#111111', // Hollow effect bg
                pointBorderColor: '#ffffff',
                pointBorderWidth: 2,
                pointRadius: 4,
                pointHoverRadius: 6
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    display: false
                },
                tooltip: {
                    backgroundColor: '#000',
                    titleColor: '#fff',
                    bodyColor: '#ccc',
                    borderColor: 'rgba(255,255,255,0.1)',
                    borderWidth: 1,
                    padding: 12,
                    displayColors: false,
                    cornerRadius: 4
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 4,
                    grid: {
                        display: false // No grid lines
                    },
                    ticks: {
                        stepSize: 1,
                        color: 'rgba(255, 255, 255, 0.2)',
                        font: { size: 10, weight: '600' }
                    },
                    border: {
                        display: false
                    }
                },
                x: {
                    grid: {
                        display: false // No grid lines
                    },
                    ticks: {
                        color: 'rgba(255, 255, 255, 0.2)',
                        font: { size: 10, weight: '600' }
                    },
                    border: {
                        display: false
                    }
                }
            }
        }
    };

    let growthChart = new Chart(ctx, chartConfig);

    const btnArea = document.getElementById('btn-area');
    const btnBar = document.getElementById('btn-bar');

    btnArea.addEventListener('click', () => {
        btnArea.classList.add('active');
        btnBar.classList.remove('active');
        
        growthChart.destroy();
        chartConfig.type = 'line';
        chartConfig.data.datasets[0].fill = true;
        growthChart = new Chart(ctx, chartConfig);
    });

    btnBar.addEventListener('click', () => {
        btnBar.classList.add('active');
        btnArea.classList.remove('active');
        
        growthChart.destroy();
        chartConfig.type = 'bar';
        chartConfig.data.datasets[0].fill = false;
        chartConfig.data.datasets[0].backgroundColor = 'rgba(255, 255, 255, 0.1)';
        growthChart = new Chart(ctx, chartConfig);
    });
});
