<script setup lang="ts">
import { onMounted, computed, ref } from 'vue';
import { NConfigProvider, darkTheme, dateZhCN, zhCN, GlobalThemeOverrides } from 'naive-ui'
import axios from 'axios';



// import themeSettings from '@/settings/theme.json';


//循环主题配置，设置css变量，用于unocss shortcuts
function addThemeColorCssVars() {
  // const defaultColor = themeSettings.themeColor;
  // const themeColor = sessionStg.get('themeColor') || defaultColor;

  //const { r, g, b } = getRgbOfColor(themeColor);

  const cssVars = `--primary-color: 100,100,100;--primary-color-hover: 255,0,255;`;
  document.documentElement.style.cssText = cssVars;
}

addThemeColorCssVars();

const count = ref(0)

onMounted(() => {
  console.log(document.documentElement.style.cssText, "ggg")
})

const darkMode = ref(false);

const themeOverrides: GlobalThemeOverrides = {
  common: {
    // baseColor: '#FF0000',
    // primaryColor: '#FF0000',
    // primaryColorHover: '#FF00FF',
  },
  Input: {
    border: "transparent",
    borderHover: "transparent",
    borderFocus: "transparent",
    boxShadowFocus: "none",
  },
  Card: {
    colorEmbedded: "transparent"
  },
}

const items = ref(["😏", "😐", "😑", "😒", "😕"])

const container_d = ref<HTMLHtmlElement | null>(null);

const removeItem = (item: string) => {
  items.value = items.value.filter(i => i !== item)
}

// const numbers = ref<number[]>(new Array(50).fill("").map((_, i) => i))
// const randomize = () => {
//   numbers.value.sort(() => (Math.random() > 0.5 ? 1 : -1))
// }

let chatId = ref("")

let loading = ref(false);

let inputVal = ref("")

interface Msg {
  //是否机器人
  isRobot?: boolean;
  //聊天内容
  msg?: string;
}

let msgs = ref<Msg[]>([])

let hasVal = computed(() => {
  return inputVal.value.length > 0
})

const clickBtn = async ($event: MouseEvent) => {
  console.log($event);


  const x = $event.clientX;
  const y = $event.clientY;



  const endRadius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y));


  const transition = document.startViewTransition?.(() => {
    darkMode.value = !darkMode.value;
  })

  await transition?.ready;  //快照完毕


  const clipPath = [`circle(0px at ${x}px ${y}px)`, `circle(${endRadius}px at ${x}px ${y}px)`];

  document.documentElement.animate(
    {
      clipPath: clipPath,
    },
    {
      duration: 500,
      easing: 'ease-in',
      pseudoElement: '::view-transition-new(root)',
    }
  );

}

const handleKeyDown = async ($event: KeyboardEvent) => {
  if ($event.key === 'Enter' && $event.metaKey) {
    sendMsg()
  }
}

const sendMsg = async () => {
  msgs.value?.push({
    isRobot: false,
    msg: inputVal.value,
  })

  const val = inputVal.value
  inputVal.value = ""

  loading.value = true



  const prefix = import.meta.env.VITE_HTTP_PROXY === 'Y' ? '/proxy-pattern' : '';
  try {
    let res = await axios.post(prefix + '/ai-api-gate/chat/complete', {
      type: 'azure',
      chat_id: chatId.value,
      prompt: val,
    }, {
      headers: {
        'content-type': 'application/json',
        'xdheader-auth': '70044495faefe4cb139b75e52ae74d67'
      }
    })
    msgs.value?.push({
      isRobot: true,
      msg: res.data.data.answer,
    })

    chatId.value = res.data.data.chat_id;
  } catch (error) {

  } finally {
    loading.value = false
  }








  // vditor.value!.setValue("It seems like you're entering a blank space. If you have any questions or need assistance, feel free to let me know how I can help you!")
  // vditor.value!.disabled()

}
</script>

<template>
  <NConfigProvider class="wh-full" :theme="darkMode ? darkTheme : undefined" :theme-overrides="themeOverrides"
    :locale="zhCN" :date-locale="dateZhCN">
    <div class="wh-full flex-center flex-col dark:border-yellow hidden" :class="{ dark: darkMode }">
      <h1 mb-2 class="text-black dark:text-gray">{{ count }}</h1>
      <n-button :type="'primary'" @click="count++">
        <template #icon>
          <n-icon>
            <icon-bx:adjust></icon-bx:adjust>
          </n-icon>
        </template>
        count is {{ count }}
      </n-button>

      <ul v-auto-animate="{ duration: 300 }" class="flex gap-6 w-200px flex-wrap">
        <div class="w-20px text-center border-0.25 border-solid border-green border-rounded-4px" v-for="item in items"
          :key="item" @click="removeItem(item)">
          {{ item }}
        </div>
      </ul>

      <div ref="container_d" class="w-400px h-400px border-solid border bg-amber dark:bg-red " style=""
        @click="clickBtn($event)">

        <n-button>hello</n-button>
      </div>


      <!-- <div class="boxes" v-auto-animate="{ duration: 500 }">
        <div class="box" v-for="number in numbers" :key="number" v-text="number" />
      </div>
      <button class="button button--alt" @click="randomize">Randomize</button> -->


    </div>

    <div class="h-full flex flex-col">
      <div
        class="sticky top-0 header h-52px text-center border-b-2 border-b-solid border-gray-100 text-gray-500 flex-center">
        <span>GPT 3.5</span>
      </div>


      <div class="flex-1  content_container overflow-y-auto pb-100px">
        <chat_item v-for="item, idx in msgs" :key="idx" :is-robot="item.isRobot" :msg="item.msg"></chat_item>
      </div>

      <div class=" p-x-40 absolute bottom-6 left-0 w-full">
        <div
          class=" flex items-center justify-between gap-6 border-1 border-gray-200 border-solid  rounded-4 p-x-4 bg-white">
          <!-- <textarea rows="1"
            class="flex-1 outline-none pl-3 pr-10 p-y-4  resize-none bg-transparent max-h-200px"></textarea> -->
          <n-input placeholder="请输入你的问题" :clearable="true" v-model:value="inputVal" :show-count="false" :round="true"
            class="outline-none focus:outline-none border-0 ring-0 focus:ring-0 focus-visible:ring-0" type="textarea"
            size="large" @keydown="handleKeyDown" :autosize="{
              minRows: 1,
              maxRows: 5
            }">
            <template #suffix>
              <div class="relative w-28px h-full">
                <button class="absolute bottom-1 -right-3 rounded-2 bg-green text-white disabled:bg-gray"
                  :disabled="(!hasVal || loading)" @click="sendMsg">
                  <span class="w-full h-28px"><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16"
                      fill="currentcolor" class="w-26px h-26px m-1" stroke-width="1">
                      <path v-if="!loading"
                        d="M.5 1.163A1 1 0 0 1 1.97.28l12.868 6.837a1 1 0 0 1 0 1.766L1.969 15.72A1 1 0 0 1 .5 14.836V10.33a1 1 0 0 1 .816-.983L8.5 8 1.316 6.653A1 1 0 0 1 .5 5.67V1.163Z"
                        fill="currentColor"></path>
                      <icon-svg-spinners:90-ring v-else></icon-svg-spinners:90-ring>
                    </svg></span>
                </button>
              </div>
            </template>
          </n-input>

        </div>
      </div>


    </div>
  </NConfigProvider>
</template>

<style scoped>
.boxes {
  display: flex;
  flex-wrap: wrap;
  margin: 2em -0.25em 2em -0.25em;
}

.box {
  box-sizing: border-box;
  width: calc(10% - 0.5em);
  margin: 0.25em;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.875em;
  font-weight: 300;
  aspect-ratio: 1;
  border: 1px solid black;
}
</style>

<style>
::view-transition-old(root),
::view-transition-new(root) {
  animation: none;
  mix-blend-mode: normal;
}

::view-transition-old(root) {
  z-index: 1;
}

::view-transition-new(root) {
  z-index: 9999;
}

.dark::view-transition-old(root) {
  z-index: 1;
}

.dark::view-transition-new(root) {
  z-index: 9999;
}

.vditor-toolbar {
  height: 0px;
  border: none;
}

.vditor-reset {
  color: rgb(37, 26, 26) !important;
  opacity: 1;
  background: transparent !important;
  padding: 0 !important;
}

.vditor {
  border: none !important;
  background: transparent !important;
}

.vditor-ir pre.vditor-reset[contenteditable="false"] {
  opacity: 1 !important;
}
</style>