# 番茄大棚监控系统

一个基于Web的实时番茄大棚监控系统，支持温度、湿度、光照、土壤湿度和CO2浓度的实时监测，以及视频监控功能。

## 功能特点

- 📊 实时环境数据监控
  - 温度监测
  - 湿度监测
  - 光照强度监测
  - 土壤湿度监测
  - CO2浓度监测
- 📹 实时视频监控
- 📈 历史数据趋势图表
- ⚡ 实时数据更新（WebSocket）
- 🔔 异常数据警报
- 📱 响应式设计，支持移动端
- 🤖 支持硬件设备集成（通过UDP协议）
- 🎮 支持模拟数据模式（用于演示）

## 技术栈

### 前端
- HTML5
- CSS3
- JavaScript
- Chart.js（数据可视化）
- Socket.IO（WebSocket客户端）
- JSMpeg（视频流播放）

### 后端
- Python
- Flask（Web框架）
- Flask-SocketIO（WebSocket服务器）
- eventlet（异步I/O）

## 本地开发

1. 克隆仓库：
```bash
git clone https://github.com/your-username/tomato-monitoring.git
cd tomato-monitoring
```

2. 创建并激活虚拟环境：
```bash
# Windows
python -m venv venv
.\venv\Scripts\activate

# Linux/macOS
python3 -m venv venv
source venv/bin/activate
```

3. 安装依赖：
```bash
pip install -r requirements.txt
```

4. 运行开发服务器：
```bash
python app/server.py
```

5. 访问应用：
打开浏览器访问 http://localhost:10000

## 部署指南

由于项目包含需要长时间运行的WebSocket连接，我们需要将前端和后端分别部署到不同的平台。

### 前端部署（Vercel）

1. Fork 这个仓库到你的GitHub账号

2. 在Vercel上创建新项目：
   - 连接你的GitHub仓库
   - 选择导入的仓库
   - 配置环境变量（见下文）
   - 点击"Deploy"

3. 部署完成后，Vercel会提供一个域名，记录下来用于后端配置

### 后端部署（Render）

1. 在Render.com创建新的Web Service：
   - 连接你的GitHub仓库
   - 选择"Python"作为环境
   - 设置启动命令：`python app/server.py`
   - 配置环境变量（见下文）

2. 部署完成后，Render会提供一个域名，更新前端的`BACKEND_URL`环境变量

### 环境变量配置

#### 前端（Vercel）
- `BACKEND_URL`：后端服务的URL（例如：https://your-app.onrender.com）

#### 后端（Render）
- `USE_MOCK_DATA`：是否使用模拟数据（true/false）
- `MOCK_DATA_INTERVAL`：模拟数据更新间隔（秒）
- `PORT`：服务器端口（默认：10000）

## 硬件设备集成

### UDP数据格式
硬件设备需要通过UDP协议发送JSON格式的数据到服务器的5005端口。数据格式如下：

```json
{
    "temperature": 25.0,
    "humidity": 60.0,
    "light": 5000,
    "soil_moisture": 65.0,
    "co2": 800
}
```

### 视频流集成
系统支持通过WebSocket接收MPEG1视频流，默认端口为8082。你可以使用ffmpeg将摄像头视频流转换为合适的格式：

```bash
ffmpeg -i /dev/video0 -f mpegts -codec:v mpeg1video -s 800x600 -b:v 1000k -bf 0 -muxdelay 0.001 http://localhost:8082/stream
```

## 开发计划

- [ ] 添加用户认证系统
- [ ] 实现数据导出功能
- [ ] 添加自动控制功能（如自动浇水）
- [ ] 支持多个大棚的监控
- [ ] 添加移动端APP
- [ ] 实现数据分析和预测功能

## 贡献指南

1. Fork 这个仓库
2. 创建你的特性分支：`git checkout -b feature/amazing-feature`
3. 提交你的改动：`git commit -m 'Add some amazing feature'`
4. 推送到分支：`git push origin feature/amazing-feature`
5. 提交Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详细信息。

## 联系方式

如果你有任何问题或建议，请创建一个issue或者联系项目维护者。

---

**注意**：本项目仍在开发中，可能会有重大变更。