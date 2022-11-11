<template>
  <div class="flex row container">
    <img src="../assets/images/loading.png" alt="" />

    <transition-group name="fade" mode="out-in">
      <!-- 登录 -->
      <div class="login-container flex column" v-if="isLog">
        <div class="form-cls flex row">
          <label>昵称：</label>
          <div class="input">
            <input type="text" v-model.trim="userName" />
          </div>
        </div>
        <div class="form-cls flex row">
          <label>密码：</label>
          <div class="input">
            <input type="password" v-model.trim="password" />
          </div>
        </div>
        <div class="login-btn flex row" @click="onLogin">登录</div>
        <div class="enroll-btn flex row" @click="toEnroll">注册</div>
      </div>

      <!-- 注册 -->
      <div class="login-container flex column" v-else>
        <div class="form-cls flex row">
          <label>昵称：</label>
          <div class="input">
            <input type="text" v-model.trim="userName" />
          </div>
        </div>
        <div class="form-cls flex row">
          <label>密码：</label>
          <div class="input">
            <input type="password" v-model.trim="password" />
          </div>
        </div>
        <div class="form-cls flex row">
          <label>确认密码：</label>
          <div class="input">
            <input type="password" v-model.trim="passwordVerify" />
          </div>
        </div>
        <div class="login-btn flex row" @click="onEnroll">注册</div>
        <div class="enroll-btn flex row" @click="onBack">返回</div>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { GMessage } from "@/plugins";
import { UserManager } from "@/utils/managers";
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useUserInfoStore } from "@/store"
const userStore = useUserInfoStore();

const userManager = new UserManager()
// 是否正在登录
const isLog = ref<boolean>(true);

// 登录时 用户名 密码
const userName = ref("");
const password = ref("");
const passwordVerify = ref("");

const router = useRouter()

const onEnroll = () => {
  if (!userName.value || !password.value) {
    GMessage("用户名和密码必填！", {
      type: "warn"
    })
    return
  }
  if (password.value !== passwordVerify.value) {
    GMessage("确认密码与密码不同", {
      type: "warn",
    });
    return;
  }
  userManager.enroll({
    userName: userName.value,
    password: password.value
  })
};

const toEnroll = () => {
  isLog.value = false
  reset()
}

const onBack = () => {
  isLog.value = true
  reset()
}

const reset = () => {
  userName.value = ""
  password.value = ""
  passwordVerify.value = ""
}

const onLogin = async () => {
  if (!userName.value || !password.value) {
    GMessage("用户名和密码必填！", {
      type: "warn"
    })
    return
  }
  const userId = await userManager.login({
    userName: userName.value,
    password: password.value
  })
  if (userId) {
    await userStore.getUserInfo()
    router.push({
      name: 'Admin',
    })
  }
};
</script>

<style lang="scss" scoped>
@import "../style/flex-style.scss";
@import "../style/theme.scss";

.container {
  width: 100vw;
  height: 20vw;
  justify-content: center;
  align-items: center;
  img {
    width: 30vh;
    height: 30vh;
  }
}

.login-container {
  min-width: 25vw;
  height: 20vw;
  justify-content: flex-start;
  align-items: center;
  border: 5px solid #3fc7f5;
  border-radius: 20px;
  background-color: #164f61;
  padding-top: 2vh;
  .form-cls {
    width: 100%;
    height: 20%;
    justify-content: space-around;
    align-items: center;
    label {
      display: inline-block;
      width: 16%;
      font-size: 2vh;
      color: $theme-color;
    }
    .input {
      width: 72%;
      height: 60%;
      border: 1px solid #3fc7f5;
      border-radius: 10px;
      input {
        width: 95%;
        height: 100%;
        font-size: 2vh;
        color: #3fc7f5;
        background-color: rgba($color: #000000, $alpha: 0);
        border: 0;
        padding-left: 0.5vw;
      }
    }
  }
  .login-btn {
    width: 94%;
    height: 14%;
    justify-content: center;
    align-items: center;
    font-size: 2vh;
    color: #eee;
    background-color: #3fc7f5;
    margin-top: 2vh;
    border-radius: 20px;
    border: 1px solid #eee;
    &:active {
      color: #3fc7f5;
      background-color: rgba($color: #000000, $alpha: 0);
      border: 1px solid #3fc7f5;
    }
  }
  .enroll-btn {
    @extend .login-btn;
    color: #3fc7f5;
    background-color: rgba($color: #000000, $alpha: 0);
    border: 1px solid #3fc7f5;
    &:active {
      color: #eee;
      background-color: #3fc7f5;
      border: 1px solid #eee;
    }
  }
}


.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

@keyframes bounce {
  0% {
    transform: scale(0.2);
  }
  50% {
    transform: scale(1.25);
  }
  100% {
    transform: scale(1);
  }
}
</style>
