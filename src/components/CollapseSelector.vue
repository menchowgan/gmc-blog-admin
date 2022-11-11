<template>
  <el-row class="types-container">
    <el-col :span="24">
      <h1 class="selection" @click="curParent = -1">
        {{ title }}
      </h1>
      <section style="color: #3fc7f5">
        <div
          v-for="(item, index) in (options as OptionsModel)"
          :key="item.title"
          @click="() => onSelected(index)"
        >
          <p class="type-title">
            {{ item.title }}
          </p>
          <transition-group name="fade" mode="out-in">
            <template v-if="curParent === index">
              <p v-for="opt in item.opts" :key="opt.value">
                <span class="link" @click="() => onTypeChanged(opt.value)">{{
                  opt.label
                }}</span>
              </p>
            </template>
          </transition-group>
        </div>
      </section>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import { ref } from "@vue/reactivity";
import { defineEmits, watchEffect } from "@vue/runtime-core";
const emits = defineEmits(["typeChanged"]);

type OptionsModel = Array<{
  title: string;
  opts: Array<{ label: string; value: string }>;
}>;

const props = defineProps({
  options: {
    type: Array,
    default: () => [],
  },
  title: {
    type: String,
    default: "Selection",
  },
  defaultCur: Number,
});

const curParent = ref(-1);

watchEffect(() => {
  if (props.defaultCur === 0 || props.defaultCur) {
    curParent.value = props.defaultCur;
  }
});

const onTypeChanged = (newVal: string) => {
  emits("typeChanged", newVal);
};

const onSelected = (cur: number) => {
  curParent.value = cur;
};
</script>

<style scoped lang="scss">
@import "../style/theme.scss";

.types-container {
  .link {
    font-size: 22px;
    line-height: 30px;
    color: #ccc;
    &:hover {
      @include hover-style;
      transition: background 0.3s ease-out;
    }
  }
  .type-title {
    line-height: 48px;
    font-size: 25px;
    font-family: Hiragino Sans GB;
    &:hover {
      background-color: #3fc7f5;
      transition: background 0.3s ease-out;
      color: #fff;
      opacity: 0.7;
      border-radius: 5px;
      cursor: pointer;
    }
  }
  .selection {
    height: 42px;
    color: #3fc7f5;
    &:hover {
      animation: bounce 0.5s reverse;
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
