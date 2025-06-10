// 全局变量
let player;
let temperatureChart;
let humidityChart;
let lightChart;
let soilMoistureChart;
let lastUpdateTime = '未连接';
let isConnected = true;
let dataHistory = {
    temperature: [],
    humidity: [],
    light: [],
    soilMoisture: []
};
const MAX_DATA_POINTS = 20;
const POLLING_INTERVAL = 5000; // 5秒轮询一次

// 初始化函数
document.addEventListener('DOMContentLoaded', () => {
    initCharts();
    initVideoPlayer();
    updateConnectionStatus();
    
    // 立即获取一次数据
    fetchCurrentData();
    
    // 每隔一段时间轮询数据
    setInterval(fetchCurrentData, POLLING_INTERVAL);
    
    // 每秒更新一次时间
    setInterval(updateCurrentTime, 1000);
});

// 从API获取当前数据
function fetchCurrentData() {
    fetch('/api/current-data')
        .then(response => {
            if (!response.ok) {
                throw new Error('网络响应不正常');
            }
            isConnected = true;
            updateConnectionStatus();
            return response.json();
        })
        .then(data => {
            console.log('收到数据:', data);
            processData(data);
        })
        .catch(error => {
            console.error('获取数据失败:', error);
            isConnected = false;
            updateConnectionStatus();
        });
}

// 处理接收到的数据
function processData(data) {
    try {
        // 尝试解析JSON数据
        const parsedData = typeof data === 'string' ? JSON.parse(data) : data;
        
        // 更新UI显示
        updateDataDisplay(parsedData);
        
        // 更新图表
        updateCharts(parsedData);
        
        // 更新最后更新时间
        lastUpdateTime = new Date().toLocaleTimeString();
        document.getElementById('last-update-time').textContent = lastUpdateTime;
        
        // 检查异常值并显示警告
        checkAbnormalValues(parsedData);
    } catch (error) {
        console.error('数据处理错误:', error);
    }
}

// 更新数据显示
function updateDataDisplay(data) {
    // 更新温度
    if (data.temperature !== undefined) {
        document.getElementById('temperature-value').textContent = `${data.temperature} °C`;
    }
    
    // 更新湿度
    if (data.humidity !== undefined) {
        document.getElementById('humidity-value').textContent = `${data.humidity} %`;
    }
    
    // 更新光照
    if (data.light !== undefined) {
        document.getElementById('light-value').textContent = `${data.light} lux`;
    }
    
    // 更新土壤湿度
    if (data.soil_moisture !== undefined) {
        document.getElementById('soil-moisture-value').textContent = `${data.soil_moisture} %`;
    }
    
    // 更新CO2浓度
    if (data.co2 !== undefined) {
        document.getElementById('co2-value').textContent = `${data.co2} ppm`;
    }
}

// 初始化图表
function initCharts() {
    // 温度图表
    const temperatureCtx = document.getElementById('temperature-chart').getContext('2d');
    temperatureChart = new Chart(temperatureCtx, {
        type: 'line',
        data: {
            labels: Array(MAX_DATA_POINTS).fill(''),
            datasets: [{
                label: '温度 (°C)',
                data: Array(MAX_DATA_POINTS).fill(null),
                borderColor: 'rgb(255, 99, 132)',
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false
                }
            }
        }
    });
    
    // 湿度图表
    const humidityCtx = document.getElementById('humidity-chart').getContext('2d');
    humidityChart = new Chart(humidityCtx, {
        type: 'line',
        data: {
            labels: Array(MAX_DATA_POINTS).fill(''),
            datasets: [{
                label: '湿度 (%)',
                data: Array(MAX_DATA_POINTS).fill(null),
                borderColor: 'rgb(54, 162, 235)',
                backgroundColor: 'rgba(54, 162, 235, 0.2)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: false,
                    max: 100
                }
            }
        }
    });
    
    // 光照图表
    const lightCtx = document.getElementById('light-chart').getContext('2d');
    lightChart = new Chart(lightCtx, {
        type: 'line',
        data: {
            labels: Array(MAX_DATA_POINTS).fill(''),
            datasets: [{
                label: '光照 (lux)',
                data: Array(MAX_DATA_POINTS).fill(null),
                borderColor: 'rgb(255, 205, 86)',
                backgroundColor: 'rgba(255, 205, 86, 0.2)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true
                }
            }
        }
    });
    
    // 土壤湿度图表
    const soilMoistureCtx = document.getElementById('soil-moisture-chart').getContext('2d');
    soilMoistureChart = new Chart(soilMoistureCtx, {
        type: 'line',
        data: {
            labels: Array(MAX_DATA_POINTS).fill(''),
            datasets: [{
                label: '土壤湿度 (%)',
                data: Array(MAX_DATA_POINTS).fill(null),
                borderColor: 'rgb(75, 192, 192)',
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            scales: {
                y: {
                    beginAtZero: true,
                    max: 100
                }
            }
        }
    });
}

// 更新图表数据
function updateCharts(data) {
    const currentTime = new Date().toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
    
    // 更新温度图表
    if (data.temperature !== undefined) {
        updateChartData(temperatureChart, data.temperature, currentTime);
    }
    
    // 更新湿度图表
    if (data.humidity !== undefined) {
        updateChartData(humidityChart, data.humidity, currentTime);
    }
    
    // 更新光照图表
    if (data.light !== undefined) {
        updateChartData(lightChart, data.light, currentTime);
    }
    
    // 更新土壤湿度图表
    if (data.soil_moisture !== undefined) {
        updateChartData(soilMoistureChart, data.soil_moisture, currentTime);
    }
}

// 更新单个图表数据
function updateChartData(chart, value, label) {
    // 移除第一个数据点
    chart.data.datasets[0].data.shift();
    chart.data.labels.shift();
    
    // 添加新数据点
    chart.data.datasets[0].data.push(value);
    chart.data.labels.push(label);
    
    // 更新图表
    chart.update();
}

// 初始化视频播放器
function initVideoPlayer() {
    // 在Vercel环境中，我们使用静态图片或视频文件代替实时WebSocket流
    const canvas = document.getElementById('video-canvas');
    
    // 检查是否存在视频元素，如果不存在则创建一个
    let videoElement = document.getElementById('video-element');
    if (!videoElement) {
        videoElement = document.createElement('div');
        videoElement.id = 'video-element';
        videoElement.className = 'video-placeholder';
        videoElement.innerHTML = `
            <p>在Vercel部署环境中，实时视频流不可用</p>
            <p>这里将显示静态图片或预录制的视频</p>
        `;
        
        // 将视频元素插入到canvas的父元素中
        canvas.parentNode.insertBefore(videoElement, canvas);
        
        // 隐藏canvas
        canvas.style.display = 'none';
    }
}

// 更新连接状态
function updateConnectionStatus() {
    const statusElement = document.getElementById('connection-status');
    const statusIndicator = document.getElementById('status-indicator');
    
    if (isConnected) {
        statusElement.textContent = '已连接';
        statusIndicator.className = 'status-indicator status-online';
    } else {
        statusElement.textContent = '未连接';
        statusIndicator.className = 'status-indicator status-offline';
    }
}

// 更新当前时间
function updateCurrentTime() {
    const currentTimeElement = document.getElementById('current-time');
    const now = new Date();
    currentTimeElement.textContent = now.toLocaleString('zh-CN');
}

// 检查异常值并显示警告
function checkAbnormalValues(data) {
    // 温度异常检查
    if (data.temperature !== undefined) {
        const tempElement = document.getElementById('temperature-value');
        if (data.temperature > 35) {
            tempElement.className = 'data-value danger';
            showAlert('警告：温度过高！', 'danger');
        } else if (data.temperature < 15) {
            tempElement.className = 'data-value warning';
            showAlert('注意：温度过低', 'warning');
        } else {
            tempElement.className = 'data-value';
        }
    }
    
    // 湿度异常检查
    if (data.humidity !== undefined) {
        const humidityElement = document.getElementById('humidity-value');
        if (data.humidity > 90) {
            humidityElement.className = 'data-value warning';
            showAlert('注意：湿度过高', 'warning');
        } else if (data.humidity < 30) {
            humidityElement.className = 'data-value warning';
            showAlert('注意：湿度过低', 'warning');
        } else {
            humidityElement.className = 'data-value';
        }
    }
    
    // 土壤湿度异常检查
    if (data.soil_moisture !== undefined) {
        const soilElement = document.getElementById('soil-moisture-value');
        if (data.soil_moisture < 20) {
            soilElement.className = 'data-value warning';
            showAlert('注意：土壤湿度过低，需要浇水', 'warning');
        } else {
            soilElement.className = 'data-value';
        }
    }
}

// 显示警告信息
function showAlert(message, type) {
    const alertsContainer = document.getElementById('alerts-container');
    
    // 创建警告元素
    const alertElement = document.createElement('div');
    alertElement.className = `alert alert-${type} fade-in`;
    alertElement.textContent = message;
    
    // 添加到容器
    alertsContainer.appendChild(alertElement);
    
    // 5秒后自动移除
    setTimeout(() => {
        alertElement.style.opacity = '0';
        setTimeout(() => {
            alertsContainer.removeChild(alertElement);
        }, 300);
    }, 5000);
}