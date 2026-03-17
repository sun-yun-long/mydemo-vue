<template>
  <div class="login-container">
    <div class="login-wrapper">
      <div class="login-box">
        <div class="login-header">
          <img src="~@/assets/logo.png" alt="logo" class="logo" />
          <h2 class="title">后台管理系统</h2>
          <p class="subtitle">欢迎回来，请登录您的账号</p>
        </div>
        <el-form :model="loginForm" :rules="rules" ref="loginForm" class="login-form">
          <el-form-item prop="username">
            <el-input 
              v-model="loginForm.username" 
              prefix-icon="el-icon-user"
              placeholder="请输入账号 (admin)"
              @keyup.enter.native="handleLogin"
              size="large"
            ></el-input>
          </el-form-item>
          <el-form-item prop="password">
            <el-input 
              v-model="loginForm.password" 
              prefix-icon="el-icon-lock"
              type="password" 
              placeholder="请输入密码 (888888)"
              show-password
              @keyup.enter.native="handleLogin"
              size="large"
            ></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" class="login-btn" @click="handleLogin" :loading="loading" size="large">
              登 录
            </el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      loginForm: {
        username: 'admin',
        password: '888888'
      },
      rules: {
        username: [{ required: true, message: '请输入账号', trigger: 'blur' }],
        password: [{ required: true, message: '请输入密码', trigger: 'blur' }]
      },
      loading: false
    };
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate(valid => {
        if (valid) {
          this.loading = true;
          // 模拟接口请求
          setTimeout(() => {
            if (this.loginForm.username === 'admin' && this.loginForm.password === '888888') {
              this.$message.success('登录成功');
              sessionStorage.setItem('isLogin', 'true');
              this.$router.push('/');
            } else {
              this.$message.error('账号或密码错误！请使用 admin / 888888');
            }
            this.loading = false;
          }, 800);
        }
      });
    }
  }
};
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  /* 使用一个深色带渐变的优质背景，搭配一点虚化效果 */
  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
  position: relative;
  overflow: hidden;
}

/* 装饰性背景球 */
.login-container::before,
.login-container::after {
  content: "";
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  z-index: 0;
}

.login-container::before {
  width: 400px;
  height: 400px;
  background: rgba(64, 158, 255, 0.4);
  top: -100px;
  left: -100px;
}

.login-container::after {
  width: 500px;
  height: 500px;
  background: rgba(103, 194, 58, 0.2);
  bottom: -150px;
  right: -100px;
}

.login-wrapper {
  position: relative;
  z-index: 1;
}

.login-box {
  width: 420px;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 50px 40px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);
  box-sizing: border-box;
}

.login-header {
  text-align: center;
  margin-bottom: 40px;
}

.login-header .logo {
  width: 64px;
  height: 64px;
  margin-bottom: 16px;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
}

.login-header .title {
  margin: 0;
  font-size: 26px;
  color: #1e293b;
  font-weight: 700;
  letter-spacing: 1px;
}

.login-header .subtitle {
  margin: 10px 0 0;
  font-size: 14px;
  color: #64748b;
}

.login-form ::v-deep .el-input__inner {
  height: 48px;
  line-height: 48px;
  border-radius: 8px;
  font-size: 15px;
}

.login-form ::v-deep .el-input__prefix {
  top: 4px; /* 调整图标居中垂直位置 */
}

.login-form ::v-deep .el-input__suffix {
  top: 4px;
}

.login-btn {
  width: 100%;
  height: 48px;
  font-size: 18px;
  border-radius: 8px;
  margin-top: 15px;
  font-weight: 600;
  letter-spacing: 2px;
  box-shadow: 0 4px 14px rgba(64, 158, 255, 0.4);
  transition: all 0.3s ease;
}

.login-btn:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(64, 158, 255, 0.5);
}
</style>
