<template>
  <div class="ws-container">
    <!-- 顶部状态栏 -->
    <div class="ws-header">
      <div class="ws-header-left">
        <h2 class="ws-title">
          <i class="el-icon-connection"></i>
          WebSocket 实时数据推送示例
        </h2>
        <p class="ws-subtitle">模拟服务端通过 WebSocket 实时推送股票行情数据到前端表格</p>
      </div>
      <div class="ws-header-right">
        <div class="ws-status" :class="statusClass">
          <span class="ws-status-dot"></span>
          <span class="ws-status-text">{{ statusText }}</span>
        </div>
      </div>
    </div>

    <!-- 控制面板 -->
    <div class="ws-control-panel">
      <div class="ws-control-row">
        <div class="ws-control-group">
          <label>连接模式：</label>
          <el-switch
            v-model="useMock"
            active-text="模拟"
            inactive-text="真实"
            active-color="#e6a23c"
            inactive-color="#409eff"
            :disabled="isConnected"
            style="margin-right: 12px"
          ></el-switch>
        </div>
        <div class="ws-control-group">
          <label>WebSocket 地址：</label>
          <el-input
            v-model="wsUrl"
            placeholder="请输入 WebSocket 地址"
            :disabled="isConnected"
            size="small"
            style="width: 360px"
          >
            <!-- <template slot="prepend">ws://</template> -->
          </el-input>
        </div>
        <div class="ws-control-group" v-if="useMock">
          <label>推送频率：</label>
          <el-select v-model="pushInterval" size="small" style="width: 140px" :disabled="isConnected">
            <el-option label="500ms" :value="500"></el-option>
            <el-option label="1秒" :value="1000"></el-option>
            <el-option label="2秒" :value="2000"></el-option>
            <el-option label="3秒" :value="3000"></el-option>
            <el-option label="5秒" :value="5000"></el-option>
          </el-select>
        </div>
        <div class="ws-control-group" v-if="!useMock">
          <el-checkbox v-model="autoReconnect" :disabled="isConnected" size="small">自动重连</el-checkbox>
        </div>
        <div class="ws-control-btns">
          <el-button
            type="primary"
            size="small"
            icon="el-icon-video-play"
            :disabled="isConnected"
            @click="connect"
          >
            连接
          </el-button>
          <el-button
            type="danger"
            size="small"
            icon="el-icon-video-pause"
            :disabled="!isConnected"
            @click="disconnect"
          >
            断开
          </el-button>
          <el-button
            type="warning"
            size="small"
            icon="el-icon-refresh"
            :disabled="!isConnected"
            @click="reconnect"
          >
            重连
          </el-button>
          <el-button
            type="info"
            size="small"
            icon="el-icon-delete"
            @click="clearLog"
          >
            清空日志
          </el-button>
        </div>
      </div>
    </div>

    <!-- 统计信息卡片 -->
    <div class="ws-stats-row">
      <div class="ws-stat-card ws-stat-card--primary">
        <div class="ws-stat-icon"><i class="el-icon-s-data"></i></div>
        <div class="ws-stat-info">
          <div class="ws-stat-value">{{ messageCount }}</div>
          <div class="ws-stat-label">收到消息数</div>
        </div>
      </div>
      <div class="ws-stat-card ws-stat-card--success">
        <div class="ws-stat-icon"><i class="el-icon-upload2"></i></div>
        <div class="ws-stat-info">
          <div class="ws-stat-value">{{ sentCount }}</div>
          <div class="ws-stat-label">发送消息数</div>
        </div>
      </div>
      <div class="ws-stat-card ws-stat-card--warning">
        <div class="ws-stat-icon"><i class="el-icon-time"></i></div>
        <div class="ws-stat-info">
          <div class="ws-stat-value">{{ connectedDuration }}</div>
          <div class="ws-stat-label">连接时长</div>
        </div>
      </div>
      <div class="ws-stat-card ws-stat-card--danger">
        <div class="ws-stat-icon"><i class="el-icon-refresh"></i></div>
        <div class="ws-stat-info">
          <div class="ws-stat-value">{{ reconnectCount }}</div>
          <div class="ws-stat-label">重连次数</div>
        </div>
      </div>
    </div>

    <!-- 主内容区 -->
    <div class="ws-main-content">
      <!-- 左侧：实时数据表格 -->
      <div class="ws-table-section">
        <div class="ws-section-header">
          <h3><i class="el-icon-s-grid"></i> 实时行情数据</h3>
          <div class="ws-table-actions">
            <el-tag :type="isConnected ? 'success' : 'info'" size="mini" effect="dark">
              {{ isConnected ? '数据推送中...' : '等待连接' }}
            </el-tag>
            <el-tooltip content="暂停/恢复表格更新" placement="top">
              <el-button
                :type="isPaused ? 'success' : 'warning'"
                size="mini"
                circle
                :icon="isPaused ? 'el-icon-video-play' : 'el-icon-video-pause'"
                @click="togglePause"
              ></el-button>
            </el-tooltip>
          </div>
        </div>
        <el-table
          :data="tableData"
          border
          stripe
          size="small"
          style="width: 100%"
          :row-class-name="tableRowClassName"
          max-height="480"
          highlight-current-row
        >
          <el-table-column prop="code" label="股票代码" width="110" align="center" fixed>
            <template slot-scope="{row}">
              <span class="stock-code">{{ row.code }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="股票名称" width="110" align="center">
            <template slot-scope="{row}">
              <span class="stock-name">{{ row.name }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="price" label="最新价" width="100" align="right">
            <template slot-scope="{row}">
              <span :class="priceColorClass(row)">{{ row.price.toFixed(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="change" label="涨跌额" width="100" align="right">
            <template slot-scope="{row}">
              <span :class="changeColorClass(row.change)">
                {{ row.change > 0 ? '+' : '' }}{{ row.change.toFixed(2) }}
              </span>
            </template>
          </el-table-column>
          <el-table-column prop="changePercent" label="涨跌幅" width="100" align="right">
            <template slot-scope="{row}">
              <el-tag
                :type="row.changePercent > 0 ? 'danger' : row.changePercent < 0 ? 'success' : 'info'"
                size="mini"
                effect="dark"
              >
                {{ row.changePercent > 0 ? '+' : '' }}{{ row.changePercent.toFixed(2) }}%
              </el-tag>
            </template>
          </el-table-column>
          <el-table-column prop="volume" label="成交量(手)" width="120" align="right">
            <template slot-scope="{row}">
              {{ formatVolume(row.volume) }}
            </template>
          </el-table-column>
          <el-table-column prop="turnover" label="成交额(万)" width="120" align="right">
            <template slot-scope="{row}">
              {{ formatTurnover(row.turnover) }}
            </template>
          </el-table-column>
          <el-table-column prop="high" label="最高" width="100" align="right">
            <template slot-scope="{row}">
              <span class="price-high">{{ row.high.toFixed(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="low" label="最低" width="100" align="right">
            <template slot-scope="{row}">
              <span class="price-low">{{ row.low.toFixed(2) }}</span>
            </template>
          </el-table-column>
          <el-table-column prop="open" label="今开" width="100" align="right">
            <template slot-scope="{row}">
              {{ row.open.toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column prop="preClose" label="昨收" width="100" align="right">
            <template slot-scope="{row}">
              {{ row.preClose.toFixed(2) }}
            </template>
          </el-table-column>
          <el-table-column prop="updateTime" label="更新时间" width="100" align="center">
            <template slot-scope="{row}">
              <span class="update-time">{{ row.updateTime }}</span>
            </template>
          </el-table-column>
        </el-table>
      </div>

      <!-- 右侧：消息日志 -->
      <div class="ws-log-section">
        <div class="ws-section-header">
          <h3><i class="el-icon-notebook-2"></i> 消息日志</h3>
          <el-badge :value="logList.length" :max="99" type="primary">
            <span></span>
          </el-badge>
        </div>
        <div class="ws-log-list" ref="logContainer">
          <div
            v-for="(log, index) in logList"
            :key="index"
            class="ws-log-item"
            :class="'ws-log-item--' + log.type"
          >
            <span class="ws-log-time">{{ log.time }}</span>
            <span class="ws-log-tag" :class="'ws-log-tag--' + log.type">{{ log.tag }}</span>
            <span class="ws-log-msg">{{ log.message }}</span>
          </div>
          <div v-if="logList.length === 0" class="ws-log-empty">
            <i class="el-icon-chat-line-square"></i>
            <p>暂无消息</p>
          </div>
        </div>
        <!-- 手动发送 -->
        <div class="ws-send-bar">
          <el-input
            v-model="sendMessage"
            placeholder="输入要发送的消息..."
            size="small"
            @keyup.enter.native="sendMsg"
          >
            <el-button slot="append" icon="el-icon-s-promotion" @click="sendMsg" :disabled="!isConnected">
              发送
            </el-button>
          </el-input>
        </div>
      </div>
    </div>

    <!-- 代码说明 -->
    <div class="ws-code-section">
      <el-collapse>
        <el-collapse-item title="📖 WebSocket 核心代码说明" name="code">
          <div class="ws-code-block">
            <h4>1. 建立连接</h4>
            <pre><code>const ws = new WebSocket('ws://your-server-url');
ws.onopen = () => { console.log('连接成功'); };
ws.onerror = (err) => { console.error('连接错误', err); };
ws.onclose = () => { console.log('连接关闭'); };</code></pre>

            <h4>2. 接收消息并更新数据</h4>
            <pre><code>ws.onmessage = (event) => {
  const data = JSON.parse(event.data);
  // 更新表格数据
  this.tableData = data;
};</code></pre>

            <h4>3. 发送消息</h4>
            <pre><code>ws.send(JSON.stringify({ type: 'subscribe', channel: 'stock' }));</code></pre>

            <h4>4. 心跳检测</h4>
            <pre><code>// 定时发送心跳包，避免连接被服务端关闭
setInterval(() => {
  if (ws.readyState === WebSocket.OPEN) {
    ws.send(JSON.stringify({ type: 'ping' }));
  }
}, 30000);</code></pre>

            <h4>5. 断线重连</h4>
            <pre><code>ws.onclose = () => {
  setTimeout(() => {
    this.connect(); // 自动重连
  }, 3000);
};</code></pre>
          </div>
        </el-collapse-item>
      </el-collapse>
    </div>
  </div>
</template>

<script>
// 模拟股票数据
const STOCK_LIST = [
  { code: '600519', name: '贵州茅台', basePrice: 1680.00 },
  { code: '000858', name: '五粮液', basePrice: 152.30 },
  { code: '601318', name: '中国平安', basePrice: 45.80 },
  { code: '600036', name: '招商银行', basePrice: 33.50 },
  { code: '000001', name: '平安银行', basePrice: 11.20 },
  { code: '600276', name: '恒瑞医药', basePrice: 42.15 },
  { code: '002714', name: '牧原股份', basePrice: 38.60 },
  { code: '300750', name: '宁德时代', basePrice: 198.50 },
  { code: '601012', name: '隆基绿能', basePrice: 22.80 },
  { code: '002475', name: '立讯精密', basePrice: 33.70 },
  { code: '600900', name: '长江电力', basePrice: 28.90 },
  { code: '601899', name: '紫金矿业', basePrice: 15.60 },
  { code: '000333', name: '美的集团', basePrice: 58.40 },
  { code: '002594', name: '比亚迪', basePrice: 245.00 },
  { code: '600809', name: '山西汾酒', basePrice: 210.50 },
];

export default {
  name: 'WebSocketDemo',
  data() {
    return {
      // ===== 模式控制 =====
      useMock: false,           // false=真实WebSocket, true=模拟模式
      wsUrl: 'wss://echo.websocket.org/',
      pushInterval: 1000,
      // ===== 连接相关 =====
      ws: null,                 // 真实 WebSocket 实例
      isConnected: false,
      isPaused: false,
      autoReconnect: true,      // 是否自动重连
      maxReconnect: 10,         // 最大重连次数
      reconnectDelay: 3000,     // 重连间隔(ms)
      reconnectTimer: null,     // 重连定时器
      heartbeatTimer: null,     // 心跳定时器
      heartbeatInterval: 30000, // 心跳间隔(ms)
      isManualClose: false,     // 是否手动关闭(区分手动断开和异常断开)
      echoSendTimer: null,      // echo模式：定时发送模拟数据的定时器
      // ===== 统计 =====
      messageCount: 0,
      sentCount: 0,
      reconnectCount: 0,
      connectedTime: null,
      connectedDuration: '00:00:00',
      durationTimer: null,
      // ===== 数据 =====
      tableData: [],
      logList: [],
      sendMessage: '',
      // ===== 模拟模式 =====
      mockTimer: null,
      // 记录上一次价格，用于计算动画
      prevPrices: {},
    };
  },
  computed: {
    statusText() {
      if (this.isConnected) return '已连接';
      return '未连接';
    },
    statusClass() {
      return this.isConnected ? 'ws-status--connected' : 'ws-status--disconnected';
    },
  },
  methods: {
    // ==================== 连接管理 ====================
    connect() {
      this.addLog('system', '系统', `正在以${this.useMock ? '模拟' : '真实'}模式连接 WebSocket...`);
      this.isManualClose = false;

      if (this.useMock) {
        // 模拟模式
        this.startMockWebSocket();
      } else {
        // 真实 WebSocket 模式
        this.startRealWebSocket();
      }
    },

    disconnect() {
      this.isManualClose = true;

      // 清除重连定时器
      if (this.reconnectTimer) {
        clearTimeout(this.reconnectTimer);
        this.reconnectTimer = null;
      }

      if (this.useMock) {
        // 模拟模式断开
        if (this.mockTimer) {
          clearInterval(this.mockTimer);
          this.mockTimer = null;
        }
      } else {
        // 真实模式断开
        if (this.echoSendTimer) {
          clearInterval(this.echoSendTimer);
          this.echoSendTimer = null;
        }
        this.stopHeartbeat();
        if (this.ws) {
          this.ws.close(1000, '用户手动断开');
          this.ws = null;
        }
      }

      this.isConnected = false;
      this.stopDurationTimer();
      this.addLog('system', '系统', '连接已手动断开');
    },

    reconnect() {
      this.disconnect();
      this.reconnectCount++;
      this.isManualClose = false;
      setTimeout(() => {
        this.connect();
      }, 500);
    },

    // ==================== 真实 WebSocket ====================
    startRealWebSocket() {
      const url = this.wsUrl;
      this.addLog('info', '连接', `正在连接: ${url}`);

      try {
        this.ws = new WebSocket(url);
      } catch (e) {
        this.addLog('error', '错误', `WebSocket 创建失败: ${e.message}`);
        return;
      }

      // 连接成功
      this.ws.onopen = () => {
        this.isConnected = true;
        this.connectedTime = Date.now();
        this.startDurationTimer();
        this.addLog('success', '连接', '✅ WebSocket 连接成功');

        // 启动心跳检测
        this.startHeartbeat();

        // 初始化表格数据（用于 echo 增量更新的基础）
        this.initTableData();
        this.addLog('info', '初始化', `已初始化 ${this.tableData.length} 条基础行情数据`);

        // 启动定时发送模拟数据（发给 echo 服务，echo 原样返回后由 onmessage 处理）
        this.startEchoMockSender();
      };

      // 接收消息
      this.ws.onmessage = (event) => {
        if (this.isPaused) return; // 暂停时忽略消息
        this.messageCount++;
        this.handleWsMessage(event.data);
      };

      // 连接错误
      this.ws.onerror = (event) => {
        this.addLog('error', '错误', '❌ WebSocket 连接发生错误');
        console.error('[WebSocket Error]', event);
      };

      // 连接关闭
      this.ws.onclose = (event) => {
        this.isConnected = false;
        this.stopHeartbeat();
        this.stopDurationTimer();

        const reason = event.reason || '未知原因';
        this.addLog('system', '关闭', `连接关闭 (code: ${event.code}, reason: ${reason})`);

        // 非手动关闭 && 开启自动重连 && 未超过最大重连次数
        if (!this.isManualClose && this.autoReconnect && this.reconnectCount < this.maxReconnect) {
          this.reconnectCount++;
          this.addLog('system', '重连', `将在 ${this.reconnectDelay / 1000}s 后尝试第 ${this.reconnectCount} 次重连...`);
          this.reconnectTimer = setTimeout(() => {
            this.addLog('system', '重连', `正在进行第 ${this.reconnectCount} 次重连...`);
            this.startRealWebSocket();
          }, this.reconnectDelay);
        } else if (this.reconnectCount >= this.maxReconnect) {
          this.addLog('error', '重连', `已达到最大重连次数 (${this.maxReconnect})，停止重连`);
        }
      };
    },

    // 处理收到的 WebSocket 消息
    handleWsMessage(rawData) {
      console.log("handleWsMessage==raw===>", rawData);

      try {
        const data = JSON.parse(rawData);
        console.log("handleWsMessage==json===>", data);
        // 心跳响应
        if (data.type === 'pong') {
          this.addLog('info', '心跳', '收到心跳响应 pong');
          return;
        }

        // 表格数据更新 —— 根据你的后端数据格式进行适配
        // 情况1: 后端推送完整列表 { type: 'snapshot', data: [...] }
        if (data.type === 'snapshot' && Array.isArray(data.data)) {
          this.tableData = data.data.map(item => ({ ...item, _flash: '' }));
          this.addLog('info', '推送', `收到全量快照, 共 ${data.data.length} 条数据`);
          return;
        }

        // 情况2: 后端推送增量更新 { type: 'update', data: [...] }
        if (data.type === 'update' && Array.isArray(data.data)) {
          this.applyIncrementalUpdate(data.data);
          if (this.messageCount % 5 === 0) {
            this.addLog('info', '推送', `收到第 ${this.messageCount} 条增量更新, 更新 ${data.data.length} 条`);
          }
          return;
        }

        // 情况3: 直接推送数组
        if (Array.isArray(data)) {
          this.tableData = data.map(item => ({ ...item, _flash: '' }));
          if (this.messageCount % 5 === 0) {
            this.addLog('info', '推送', `收到第 ${this.messageCount} 条数据推送, 共 ${data.length} 条`);
          }
          return;
        }

        // 其他格式：直接记录原始数据
        this.addLog('info', '消息', typeof rawData === 'string' ? rawData.substring(0, 200) : JSON.stringify(data).substring(0, 200));
      } catch (e) {
        // 非 JSON 格式，按文本处理
        this.addLog('info', '消息', String(rawData).substring(0, 200));
      }
    },

    // 增量更新表格数据
    applyIncrementalUpdate(updates) {
      updates.forEach(updateItem => {
        const idx = this.tableData.findIndex(row => row.code === updateItem.code);
        if (idx !== -1) {
          const prevPrice = this.tableData[idx].price;
          const newPrice = updateItem.price;
          const flash = newPrice > prevPrice ? 'up' : newPrice < prevPrice ? 'down' : '';

          this.$set(this.tableData, idx, {
            ...this.tableData[idx],
            ...updateItem,
            updateTime: updateItem.updateTime || this.getCurrentTime(),
            _flash: flash,
          });

          setTimeout(() => {
            if (this.tableData[idx]) {
              this.$set(this.tableData[idx], '_flash', '');
            }
          }, 600);
        } else {
          // 新增行
          this.tableData.push({ ...updateItem, _flash: 'up' });
        }
      });
    },

    // 向 WebSocket 发送数据
    wsSend(data) {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        const msg = typeof data === 'string' ? data : JSON.stringify(data);
        this.ws.send(msg);
        return true;
      }
      return false;
    },

    // ==================== Echo 模式：定时发送模拟数据 ====================
    // 定时生成增量更新数据，通过 ws.send 发给 echo 服务
    // echo 服务原样返回 → onmessage 接收 → handleWsMessage 解析 → applyIncrementalUpdate 更新表格
    startEchoMockSender() {
      if (this.echoSendTimer) {
        clearInterval(this.echoSendTimer);
      }
      this.addLog('info', 'Echo', `启动定时发送, 间隔 ${this.pushInterval}ms`);
      this.echoSendTimer = setInterval(() => {
        if (!this.isPaused && this.ws && this.ws.readyState === WebSocket.OPEN) {
          const updatePayload = this.generateMockUpdatePayload();
          this.wsSend(updatePayload);
          this.sentCount++;
        }
      }, this.pushInterval);
    },

    // 生成一组模拟增量更新数据（格式为 { type: 'update', data: [...] }）
    generateMockUpdatePayload() {
      const updateCount = Math.floor(Math.random() * 8) + 3;
      const indices = this.getRandomIndices(this.tableData.length, updateCount);
      const updates = [];

      indices.forEach(idx => {
        const item = this.tableData[idx];
        if (!item) return;
        const fluctuation = (Math.random() - 0.5) * item.preClose * 0.005;
        const newPrice = +(item.price + fluctuation).toFixed(2);
        const change = +(newPrice - item.preClose).toFixed(2);
        const changePercent = +((change / item.preClose) * 100).toFixed(2);
        const volumeAdd = Math.floor(Math.random() * 5000) + 100;

        updates.push({
          code: item.code,
          name: item.name,
          price: newPrice,
          preClose: item.preClose,
          open: item.open,
          change,
          changePercent,
          volume: item.volume + volumeAdd,
          turnover: +((item.volume + volumeAdd) * newPrice / 10000).toFixed(2),
          high: Math.max(item.high, newPrice),
          low: Math.min(item.low, newPrice),
          updateTime: this.getCurrentTime(),
        });
      });

      return { type: 'update', data: updates };
    },

    // 心跳检测
    startHeartbeat() {
      this.stopHeartbeat();
      this.heartbeatTimer = setInterval(() => {
        if (this.ws && this.ws.readyState === WebSocket.OPEN) {
          this.wsSend({ type: 'ping', timestamp: Date.now() });
        }
      }, this.heartbeatInterval);
    },

    stopHeartbeat() {
      if (this.heartbeatTimer) {
        clearInterval(this.heartbeatTimer);
        this.heartbeatTimer = null;
      }
    },

    // ==================== 模拟 WebSocket（保留） ====================
    startMockWebSocket() {
      // 模拟连接延迟
      setTimeout(() => {
        this.isConnected = true;
        this.connectedTime = Date.now();
        this.startDurationTimer();
        this.addLog('success', '连接', '✅ WebSocket 连接成功（模拟模式）');
        this.addLog('info', '订阅', '已订阅实时行情数据频道');

        // 初始化表格数据
        this.initTableData();

        // 定时推送数据更新
        this.mockTimer = setInterval(() => {
          if (!this.isPaused) {
            this.pushMockData();
          }
        }, this.pushInterval);
      }, 300 + Math.random() * 500);
    },

    initTableData() {
      this.tableData = STOCK_LIST.map(stock => {
        const fluctuation = (Math.random() - 0.5) * 2 * stock.basePrice * 0.02;
        const price = +(stock.basePrice + fluctuation).toFixed(2);
        const preClose = stock.basePrice;
        const change = +(price - preClose).toFixed(2);
        const changePercent = +((change / preClose) * 100).toFixed(2);
        const volume = Math.floor(Math.random() * 500000) + 10000;
        const turnover = +(volume * price / 10000).toFixed(2);
        const high = +(price + Math.random() * 2).toFixed(2);
        const low = +(price - Math.random() * 2).toFixed(2);

        this.prevPrices[stock.code] = price;

        return {
          code: stock.code,
          name: stock.name,
          price,
          preClose,
          open: +(preClose + (Math.random() - 0.5) * 2).toFixed(2),
          change,
          changePercent,
          volume,
          turnover,
          high,
          low,
          updateTime: this.getCurrentTime(),
          _flash: '',
        };
      });
    },

    pushMockData() {
      // 随机更新部分股票数据
      const updateCount = Math.floor(Math.random() * 8) + 3;
      const indices = this.getRandomIndices(this.tableData.length, updateCount);

      indices.forEach(idx => {
        const item = this.tableData[idx];
        const prevPrice = item.price;
        const fluctuation = (Math.random() - 0.5) * item.preClose * 0.005;
        const newPrice = +(item.price + fluctuation).toFixed(2);
        const change = +(newPrice - item.preClose).toFixed(2);
        const changePercent = +((change / item.preClose) * 100).toFixed(2);
        const volumeAdd = Math.floor(Math.random() * 5000) + 100;

        // 闪烁效果
        const flash = newPrice > prevPrice ? 'up' : newPrice < prevPrice ? 'down' : '';

        this.$set(this.tableData, idx, {
          ...item,
          price: newPrice,
          change,
          changePercent,
          volume: item.volume + volumeAdd,
          turnover: +((item.volume + volumeAdd) * newPrice / 10000).toFixed(2),
          high: Math.max(item.high, newPrice),
          low: Math.min(item.low, newPrice),
          updateTime: this.getCurrentTime(),
          _flash: flash,
        });

        // 短暂闪烁后移除样式
        setTimeout(() => {
          if (this.tableData[idx]) {
            this.$set(this.tableData[idx], '_flash', '');
          }
        }, 600);
      });

      this.messageCount++;
      // 每5条消息记录一次日志，减少日志量
      if (this.messageCount % 5 === 0) {
        this.addLog('info', '推送', `收到第 ${this.messageCount} 条行情数据更新, 本次更新 ${updateCount} 只股票`);
      }
    },

    getRandomIndices(max, count) {
      const indices = new Set();
      while (indices.size < Math.min(count, max)) {
        indices.add(Math.floor(Math.random() * max));
      }
      return Array.from(indices);
    },

    // ==================== 发送消息 ====================
    sendMsg() {
      if (!this.sendMessage.trim()) return;
      if (!this.isConnected) {
        this.$message.warning('请先连接 WebSocket');
        return;
      }

      const msg = this.sendMessage;
      this.addLog('send', '发送', msg);
      this.sentCount++;

      if (this.useMock) {
        // 模拟模式：模拟服务端回复
        setTimeout(() => {
          this.addLog('info', '回复', `服务端收到消息: "${msg}"`);
          this.messageCount++;
        }, 200 + Math.random() * 300);
      } else {
        // 真实模式：通过 WebSocket 发送
        const success = this.wsSend(msg);
        if (!success) {
          this.addLog('error', '发送', '发送失败：连接未就绪');
        }
      }

      this.sendMessage = '';
    },

    // ==================== 日志管理 ====================
    addLog(type, tag, message) {
      this.logList.push({
        type,
        tag,
        message,
        time: this.getCurrentTime(),
      });
      // 限制日志数量
      if (this.logList.length > 200) {
        this.logList.splice(0, this.logList.length - 200);
      }
      // 自动滚动到底部
      this.$nextTick(() => {
        const container = this.$refs.logContainer;
        if (container) {
          container.scrollTop = container.scrollHeight;
        }
      });
    },

    clearLog() {
      this.logList = [];
      this.addLog('system', '系统', '日志已清空');
    },

    // ==================== 工具方法 ====================
    getCurrentTime() {
      const now = new Date();
      return [
        String(now.getHours()).padStart(2, '0'),
        String(now.getMinutes()).padStart(2, '0'),
        String(now.getSeconds()).padStart(2, '0'),
      ].join(':');
    },

    togglePause() {
      this.isPaused = !this.isPaused;
      this.addLog('system', '系统', this.isPaused ? '⏸ 已暂停数据更新' : '▶ 已恢复数据更新');
    },

    tableRowClassName({ row }) {
      if (row._flash === 'up') return 'flash-row-up';
      if (row._flash === 'down') return 'flash-row-down';
      return '';
    },

    priceColorClass(row) {
      if (row.price > row.preClose) return 'price-up';
      if (row.price < row.preClose) return 'price-down';
      return 'price-flat';
    },

    changeColorClass(val) {
      if (val > 0) return 'price-up';
      if (val < 0) return 'price-down';
      return 'price-flat';
    },

    formatVolume(val) {
      if (val >= 10000) {
        return (val / 10000).toFixed(2) + '万';
      }
      return val.toLocaleString();
    },

    formatTurnover(val) {
      if (val >= 10000) {
        return (val / 10000).toFixed(2) + '亿';
      }
      return val.toFixed(2);
    },

    startDurationTimer() {
      this.durationTimer = setInterval(() => {
        if (this.connectedTime) {
          const diff = Math.floor((Date.now() - this.connectedTime) / 1000);
          const h = String(Math.floor(diff / 3600)).padStart(2, '0');
          const m = String(Math.floor((diff % 3600) / 60)).padStart(2, '0');
          const s = String(diff % 60).padStart(2, '0');
          this.connectedDuration = `${h}:${m}:${s}`;
        }
      }, 1000);
    },

    stopDurationTimer() {
      if (this.durationTimer) {
        clearInterval(this.durationTimer);
        this.durationTimer = null;
      }
    },
  },

  beforeDestroy() {
    this.isManualClose = true;
    this.disconnect();
    this.stopDurationTimer();
    this.stopHeartbeat();
  },
};
</script>

<style scoped>
.ws-container {
  padding: 20px;
  background: #f0f2f5;
  min-height: 100vh;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB',
    'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif;
}

/* ========== 顶部 ========== */
.ws-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
  border-radius: 12px;
  padding: 24px 32px;
  margin-bottom: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.ws-title {
  color: #fff;
  margin: 0 0 6px 0;
  font-size: 22px;
  font-weight: 600;
  letter-spacing: 1px;
}

.ws-title i {
  margin-right: 8px;
  color: #00d2ff;
}

.ws-subtitle {
  color: rgba(255, 255, 255, 0.65);
  margin: 0;
  font-size: 13px;
}

.ws-status {
  display: flex;
  align-items: center;
  padding: 8px 20px;
  border-radius: 24px;
  font-size: 14px;
  font-weight: 500;
  transition: all 0.3s ease;
}

.ws-status--connected {
  background: rgba(0, 210, 91, 0.15);
  border: 1px solid rgba(0, 210, 91, 0.4);
  color: #00d25b;
}

.ws-status--disconnected {
  background: rgba(255, 77, 79, 0.15);
  border: 1px solid rgba(255, 77, 79, 0.4);
  color: #ff4d4f;
}

.ws-status-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  margin-right: 8px;
  position: relative;
}

.ws-status--connected .ws-status-dot {
  background: #00d25b;
  box-shadow: 0 0 8px #00d25b;
  animation: pulse-green 1.5s infinite;
}

.ws-status--disconnected .ws-status-dot {
  background: #ff4d4f;
  box-shadow: 0 0 8px #ff4d4f;
}

@keyframes pulse-green {
  0%, 100% { box-shadow: 0 0 4px #00d25b; }
  50% { box-shadow: 0 0 16px #00d25b, 0 0 30px rgba(0, 210, 91, 0.3); }
}

/* ========== 控制面板 ========== */
.ws-control-panel {
  background: #fff;
  border-radius: 10px;
  padding: 16px 24px;
  margin-bottom: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.ws-control-row {
  display: flex;
  align-items: center;
  gap: 20px;
  flex-wrap: wrap;
}

.ws-control-group {
  display: flex;
  align-items: center;
  gap: 8px;
}

.ws-control-group label {
  font-size: 13px;
  color: #606266;
  white-space: nowrap;
  font-weight: 500;
}

.ws-control-btns {
  display: flex;
  gap: 8px;
  margin-left: auto;
}

/* ========== 统计卡片 ========== */
.ws-stats-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
  margin-bottom: 16px;
}

.ws-stat-card {
  background: #fff;
  border-radius: 10px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  transition: transform 0.2s ease, box-shadow 0.2s ease;
  border-left: 4px solid transparent;
}

.ws-stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.1);
}

.ws-stat-card--primary { border-left-color: #409eff; }
.ws-stat-card--success { border-left-color: #67c23a; }
.ws-stat-card--warning { border-left-color: #e6a23c; }
.ws-stat-card--danger { border-left-color: #f56c6c; }

.ws-stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
}

.ws-stat-card--primary .ws-stat-icon { background: rgba(64, 158, 255, 0.1); color: #409eff; }
.ws-stat-card--success .ws-stat-icon { background: rgba(103, 194, 58, 0.1); color: #67c23a; }
.ws-stat-card--warning .ws-stat-icon { background: rgba(230, 162, 60, 0.1); color: #e6a23c; }
.ws-stat-card--danger .ws-stat-icon { background: rgba(245, 108, 108, 0.1); color: #f56c6c; }

.ws-stat-value {
  font-size: 26px;
  font-weight: 700;
  color: #303133;
  line-height: 1.2;
}

.ws-stat-label {
  font-size: 13px;
  color: #909399;
  margin-top: 4px;
}

/* ========== 主内容区 ========== */
.ws-main-content {
  display: flex;
  gap: 16px;
  margin-bottom: 16px;
}

.ws-table-section {
  flex: 1;
  background: #fff;
  border-radius: 10px;
  padding: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  min-width: 0;
}

.ws-log-section {
  width: 380px;
  flex-shrink: 0;
  background: #fff;
  border-radius: 10px;
  padding: 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
  display: flex;
  flex-direction: column;
}

.ws-section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
  padding-bottom: 10px;
  border-bottom: 1px solid #ebeef5;
}

.ws-section-header h3 {
  margin: 0;
  font-size: 15px;
  color: #303133;
  font-weight: 600;
}

.ws-section-header h3 i {
  margin-right: 6px;
  color: #409eff;
}

.ws-table-actions {
  display: flex;
  align-items: center;
  gap: 10px;
}

/* ========== 表格样式 ========== */
.stock-code {
  font-family: 'Consolas', 'Monaco', monospace;
  font-weight: 600;
  color: #409eff;
}

.stock-name {
  font-weight: 500;
}

.price-up {
  color: #f5222d;
  font-weight: 600;
}

.price-down {
  color: #52c41a;
  font-weight: 600;
}

.price-flat {
  color: #303133;
  font-weight: 600;
}

.price-high {
  color: #f5222d;
}

.price-low {
  color: #52c41a;
}

.update-time {
  font-family: 'Consolas', 'Monaco', monospace;
  font-size: 12px;
  color: #909399;
}

/* 行闪烁动画 */
::v-deep .flash-row-up {
  animation: flashUp 0.6s ease;
}

::v-deep .flash-row-down {
  animation: flashDown 0.6s ease;
}

@keyframes flashUp {
  0% { background-color: transparent; }
  30% { background-color: rgba(245, 34, 45, 0.12); }
  100% { background-color: transparent; }
}

@keyframes flashDown {
  0% { background-color: transparent; }
  30% { background-color: rgba(82, 196, 26, 0.12); }
  100% { background-color: transparent; }
}

/* ========== 日志区域 ========== */
.ws-log-list {
  flex: 1;
  overflow-y: auto;
  max-height: 420px;
  min-height: 200px;
  background: #fafafa;
  border-radius: 8px;
  padding: 8px;
  margin-bottom: 10px;
}

.ws-log-item {
  display: flex;
  align-items: flex-start;
  gap: 6px;
  padding: 5px 8px;
  border-radius: 4px;
  margin-bottom: 3px;
  font-size: 12px;
  line-height: 1.6;
  transition: background 0.2s;
}

.ws-log-item:hover {
  background: rgba(0, 0, 0, 0.04);
}

.ws-log-time {
  font-family: 'Consolas', 'Monaco', monospace;
  color: #909399;
  white-space: nowrap;
  flex-shrink: 0;
}

.ws-log-tag {
  font-size: 11px;
  padding: 0 6px;
  border-radius: 3px;
  white-space: nowrap;
  flex-shrink: 0;
  font-weight: 500;
}

.ws-log-tag--system { background: #e6e8eb; color: #606266; }
.ws-log-tag--success { background: #e1f3d8; color: #67c23a; }
.ws-log-tag--info { background: #d9ecff; color: #409eff; }
.ws-log-tag--send { background: #fdf6ec; color: #e6a23c; }
.ws-log-tag--error { background: #fde2e2; color: #f56c6c; }

.ws-log-msg {
  color: #303133;
  word-break: break-all;
}

.ws-log-empty {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 0;
  color: #c0c4cc;
}

.ws-log-empty i {
  font-size: 40px;
  margin-bottom: 10px;
}

.ws-send-bar {
  flex-shrink: 0;
}

/* ========== 代码说明 ========== */
.ws-code-section {
  background: #fff;
  border-radius: 10px;
  padding: 8px 16px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.06);
}

.ws-code-block h4 {
  margin: 16px 0 8px;
  color: #303133;
  font-size: 14px;
}

.ws-code-block pre {
  background: #1e1e1e;
  color: #d4d4d4;
  padding: 14px 18px;
  border-radius: 8px;
  overflow-x: auto;
  font-family: 'Consolas', 'Monaco', 'Fira Code', monospace;
  font-size: 13px;
  line-height: 1.6;
  margin: 0;
}

.ws-code-block code {
  font-family: inherit;
}

/* ========== 响应式 ========== */
@media (max-width: 1200px) {
  .ws-main-content {
    flex-direction: column;
  }
  .ws-log-section {
    width: 100%;
  }
  .ws-stats-row {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 768px) {
  .ws-stats-row {
    grid-template-columns: 1fr;
  }
  .ws-control-row {
    flex-direction: column;
    align-items: flex-start;
  }
  .ws-control-btns {
    margin-left: 0;
  }
}
</style>
