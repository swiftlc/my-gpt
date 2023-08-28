<template>
    <div class="w-full flex border-solid border-gray-300 border-b-1 " :class="{ 'bg-gray-100': isRobot }">
        <div class="mt-4  ml-6  text-center text-3xl">
            <icon-mdi:account v-if="!isRobot"></icon-mdi:account>
            <icon-solar:accumulator-bold-duotone v-else></icon-solar:accumulator-bold-duotone>
        </div>
        <div class="text-wrap text-2xl flex-1">
            <n-card title="" embedded :bordered="false" class="">
                <div ref="domRef" id="vditor" class="">
                </div>
            </n-card>
        </div>
    </div>
</template>
  
<script setup lang="ts">
import { onMounted, ref } from 'vue';
import Vditor from 'vditor';
import 'vditor/dist/index.css';
import { watch } from 'vue';

defineOptions({ name: 'ChatItem' });

interface Props {
    //是否机器人
    isRobot?: boolean;
    //聊天内容
    msg?: string;
}

const props = withDefaults(defineProps<Props>(), {
    msg: "",
    isRobot: false,
})


const vditor = ref<Vditor>();
const domRef = ref<HTMLElement>();

const renderVditor = async () => {
    if (!domRef.value) return;

    console.log(props)
    vditor.value = new Vditor(domRef.value, {
        theme: 'classic',
        icon: 'material',
        value: props.msg,
        cache: { enable: false },
        toolbarConfig: {
            hide: true,
            pin: false,
        },
        width: '96%',
        minHeight: 0,
        toolbar: [{
            name: 'sponsor',
        }],
        preview: {
            mode: 'editor'
        },
    });
}



watch(() => props.msg, (newVal: any) => {
    vditor.value?.setValue(newVal as string)
}, {
    immediate: false
})

onMounted(async () => {
    await renderVditor();
    setTimeout(() => {
        vditor.value?.disabled();
    }, 100);
})


</script>
  
<style scoped></style>
  