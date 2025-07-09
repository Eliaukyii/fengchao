<template>
  <div class="login-center-wrapper">
    <div class="login-center-box">
      <div class="login-img-box">
        <img class="login-illustration" src="../assets/img/login_picture.svg" alt="illustration" />
      </div>
      <div class="login-form-box">
        <div class="login-title">登录</div>
        <el-form :model="form" ref="loginForm" @submit.native.prevent="handleLogin" :rules="rules">
          <el-form-item prop="username">
            <el-input v-model="form.username" placeholder="账户" prefix-icon="el-icon-user" />
          </el-form-item>
          <el-form-item prop="password">
            <el-input v-model="form.password" placeholder="密码" prefix-icon="el-icon-lock" show-password />
          </el-form-item>
          <el-form-item prop="captcha" class="captcha-item">
            <div class="captcha-wrapper">
              <el-input v-model="form.captcha" placeholder="请输入验证码" prefix-icon="el-icon-message" />
              <div id="auth_code"></div> 
            </div>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" style="width:100%" @click="handleLogin">登录</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
import { GVerify } from "../utils/code.js";
export default {
  name: "Login",
  data() {
    return {
      form: {
        username: "",
        password: "",
        captcha: "",
      },
      verifyCode: null,
      rules: {
        username: [{ required: true, message: "请输入账户", trigger: "blur" }],
        password: [{ required: true, message: "请输入密码", trigger: "blur" }],
        captcha: [{ required: true, message: "请输入验证码", trigger: "blur" }],
      },
    };
  },
  mounted() {
    this.verifyCode = new GVerify("auth_code");
    localStorage.removeItem('isLogin');
  },
  methods: {
    handleLogin() {
      this.$refs.loginForm.validate((valid) => {
        if (!valid) return;
        //校验验证码
        if (!this.verifyCode.validate(this.form.captcha)) {
          this.$message.error("验证码错误");
          this.form.captcha = "";
          this.verifyCode.refresh();
          return;
        }
        // 验证用户名密码
        const { username, password } = this.form;
        if (username !== "admin" || password !== "kL8#fT!9@Q") {
          this.$message.error("用户名或密码错误");
          return;
        }
        localStorage.setItem('isLogin', 'true');
        this.$message.success("登录成功");
        this.$router.push("/home");

      });
    },
  },
};
</script>

<style scoped>
.login-center-wrapper {
  width: 100vw;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #fafbfc;
}
.login-center-box {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  background: #fff;
  border-radius: 16px;
  box-shadow: 0 2px 24px rgba(0, 0, 0, 0.08);
  padding: 0 40px;
  min-width: 900px;
  min-height: 520px;
}
.login-img-box {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 420px;
  margin-right: 60px;
}

.login-illustration {
  width: 340px;
  max-width: 100%;
  margin-top: 32px;
}
.login-form-box {
  width: 360px;
  background: #fff;
  border-radius: 10px;
  /* box-shadow: 0 2px 16px rgba(0,0,0,0.06); */
  padding: 40px 32px 32px 32px;
}
.login-title {
  font-size: 28px;
  font-weight: 600;
  color: #222;
  margin-bottom: 32px;
  text-align: left;
}
.captcha-wrapper {
  display: flex;
  align-items: center;
  width: 100%;
}

.captcha-wrapper :deep(.el-input) {
  flex: 1;
}

#auth_code {
  width: 100px;
  height: 38px;
  /* margin-left: 10px; */
  border: 1px solid #eee;
  border-radius: 4px;
  cursor: pointer;
}
</style>