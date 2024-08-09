<script setup lang="ts">
import type { OutputTypeDetails } from 'src/main/userApp/types';
import TypeDetails from './TypeDetails.vue';
import { ref } from 'vue';
// 添加逻辑
const props = defineProps<{
    typeDetails: OutputTypeDetails[],
    parentKey: string
}>()

const pkey = props.parentKey;

const emit = defineEmits<{
    (e: 'selectType', keys: string[]): void
}>()

const typeDetailsOpen = ref(false);
function clickSubattribute() {
    typeDetailsOpen.value = !typeDetailsOpen.value;
}

function onSelectType(keys: string[]) {
    keys.unshift(pkey);
    emit('selectType', keys);
}

</script>

<template>
    <div class="flex flex-col pl-6 py-1" v-for="typeDetail in typeDetails">
        <div class="flex gap-1">
            <div class="subattribute" @click.stop="clickSubattribute()"
                v-if="typeDetail.typeDetails && typeDetail.typeDetails.length > 0">
                <div class="w-6 h-6 flex justify-center items-center hover:bg-gray-200">
                    <el-icon>
                        <ArrowRight v-if="!typeDetailsOpen" />
                        <ArrowDown v-else />
                    </el-icon>
                </div>
            </div>
            <span class="flex-1 p-1 hover:bg-gray-100" @click="emit('selectType', [parentKey, typeDetail.key])">{{
                typeDetail.key }} （{{ typeDetail.display ? typeDetail.display : '未提供备注' }}）</span>
        </div>
        <TypeDetails @select-type="onSelectType"
            v-if="typeDetail.typeDetails && typeDetail.typeDetails.length > 0 && typeDetailsOpen"
            :typeDetails="typeDetail.typeDetails" :parentKey="typeDetail.key">
        </TypeDetails>
    </div>
</template>

<style lang="less" scoped>
// 添加样式
</style>
