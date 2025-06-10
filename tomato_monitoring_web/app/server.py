from flask import Flask, render_template, jsonify, request
import json
import random
import os
from datetime import datetime, timedelta

# 初始化Flask应用
app = Flask(__name__)

# 模拟数据
def get_mock_data():
    """生成模拟的传感器数据"""
    # 基础值
    base_values = {
        'temperature': 25.0,
        'humidity': 60.0,
        'light': 5000,
        'soil_moisture': 65.0,
        'co2': 800,
    }
    
    # 添加随机变化
    mock_data = {
        'temperature': round(base_values['temperature'] + random.uniform(-3, 3), 1),
        'humidity': round(base_values['humidity'] + random.uniform(-10, 10), 1),
        'light': int(base_values['light'] + random.uniform(-1000, 1000)),
        'soil_moisture': round(base_values['soil_moisture'] + random.uniform(-5, 5), 1),
        'co2': int(base_values['co2'] + random.uniform(-100, 100)),
        'timestamp': datetime.now().isoformat()
    }
    
    # 确保数据在合理范围内
    mock_data['temperature'] = max(15, min(35, mock_data['temperature']))
    mock_data['humidity'] = max(30, min(90, mock_data['humidity']))
    mock_data['light'] = max(0, min(10000, mock_data['light']))
    mock_data['soil_moisture'] = max(20, min(90, mock_data['soil_moisture']))
    mock_data['co2'] = max(400, min(1500, mock_data['co2']))
    
    return mock_data

# 路由
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/current-data')
def get_current_data():
    """API端点，返回最新的传感器数据"""
    return jsonify(get_mock_data())

@app.route('/api/historical-data')
def get_historical_data():
    """API端点，返回历史数据（模拟）"""
    hours = int(request.args.get('hours', 24))
    interval_minutes = int(request.args.get('interval', 30))
    
    # 计算需要生成的数据点数量
    points = (hours * 60) // interval_minutes
    
    # 生成历史数据
    data = []
    base_temp = 25.0
    base_humidity = 60.0
    base_light = 5000
    base_soil = 65.0
    base_co2 = 800
    
    now = datetime.now()
    
    for i in range(points):
        # 时间点（从现在往前推）
        time_point = now.replace(microsecond=0) - timedelta(minutes=i*interval_minutes)
        
        # 添加一些周期性变化和随机噪声
        hour_of_day = time_point.hour
        day_factor = abs(12 - hour_of_day) / 12.0  # 0 at noon, 1 at midnight
        
        temp = base_temp - (day_factor * 5) + random.uniform(-1, 1)
        humidity = base_humidity + (day_factor * 15) + random.uniform(-5, 5)
        light = base_light * (1 - day_factor * 0.9) + random.uniform(-200, 200)
        soil = base_soil + random.uniform(-3, 3)
        co2 = base_co2 + random.uniform(-50, 50)
        
        # 确保数据在合理范围内
        temp = max(15, min(35, temp))
        humidity = max(30, min(90, humidity))
        light = max(0, min(10000, light))
        soil = max(20, min(90, soil))
        co2 = max(400, min(1500, co2))
        
        data.append({
            'timestamp': time_point.isoformat(),
            'temperature': round(temp, 1),
            'humidity': round(humidity, 1),
            'light': int(light),
            'soil_moisture': round(soil, 1),
            'co2': int(co2)
        })
    
    # 反转数据，使其按时间升序排列
    data.reverse()
    
    return jsonify(data)

from flask_cors import CORS

# 启用CORS
CORS(app)

# Vercel需要的handler
def handler(event, context):
    """处理来自Vercel的请求"""
    try:
        # 使用test_client处理请求
        with app.test_client() as client:
            # 准备请求参数
            method = event.get('httpMethod', 'GET')
            path = event.get('path', '/')
            headers = event.get('headers', {})
            query_string = event.get('queryStringParameters', {})
            body = event.get('body', '')
            
            # 发送请求
            response = client.open(
                path=path,
                method=method,
                headers=headers,
                query_string=query_string,
                data=body
            )
            
            # 构建Vercel响应格式
            return {
                'statusCode': response.status_code,
                'headers': dict(response.headers),
                'body': response.get_data(as_text=True),
                'isBase64Encoded': False
            }
    except Exception as e:
        # 错误处理
        return {
            'statusCode': 500,
            'body': json.dumps({'error': str(e)}),
            'headers': {'Content-Type': 'application/json'},
            'isBase64Encoded': False
        }

# 本地开发服务器
if __name__ == '__main__':
    port = int(os.environ.get('PORT', 10000))
    app.run(host='0.0.0.0', port=port, debug=True)