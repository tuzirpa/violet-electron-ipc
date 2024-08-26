<script setup lang="ts">
// 添加逻辑
import { addElementLibraryPopup, checkElement, deleteElementLibraryInfo, recapture, saveElementLibraryInfo, selectBrowserPopup } from '../propertyTabs';
import { ElDialog, ElInput } from 'element-plus';

</script>

<template>
    <div>
        <ElDialog v-model="selectBrowserPopup.show" :title="'选择浏览器'" center>
            <div class="flex flex-col">
                <div class="item flex flex-col p-1 gap-2" v-for="(item, index) in selectBrowserPopup.browsers" :key="index">
                    <div class="flex flex-col gap-1">
                        <div class="flex flex-col gap-1">
                            <div class="item-title">
                                应用名：{{ item.appName }}
                            </div>
                            <div>
                                启动时间：{{ item.time }}
                            </div>
                        </div>
                    </div>
                    <div class="pages ml-4">
                        <div class="page cursor-pointer p-1 rounded hover:bg-gray-100" v-for="(page, index) in item.pages"
                            @click="selectBrowserPopup.callback(item.wsUrl, page.url)" :key="index">
                            <div class="page-title">标题：{{ page.title }}</div>
                            <div class="page-url truncate">{{ page.url }}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="text-red-500">注意：当前启动多个运行中的浏览器，请选择浏览器获取元素，点击上面已开的的页面去选择元素。</div>
        </ElDialog>
        <ElDialog v-model="addElementLibraryPopup.show" width="80%" :title="'元素预览'" center>
            <div class="flex flex-col">
                <el-form :model="addElementLibraryPopup.elementInfo" label-width="auto">
                    <el-form-item label="名称">
                        <ElInput v-model="addElementLibraryPopup.elementInfo.name" placeholder="请输入名称"></ElInput>
                    </el-form-item>
                    <el-form-item label="描述">
                        <ElInput v-model="addElementLibraryPopup.elementInfo.description" placeholder="请输入描述" autosize
                            :type="'textarea'">
                        </ElInput>
                    </el-form-item>
                    <el-form-item label="css选择器">
                        <ElInput v-model="addElementLibraryPopup.elementInfo.cssSelector" autosize :type="'textarea'">
                        </ElInput>
                    </el-form-item>
                    <el-form-item label="xpath">
                        <ElInput v-model="addElementLibraryPopup.elementInfo.xPath" autosize :type="'textarea'"></ElInput>
                    </el-form-item>

                    <el-form-item label="图片预览">
                        <div class="preview-img border">
                            <img :src="`assets://file?path=${addElementLibraryPopup.elementInfo.previewPath}`" alt="">
                        </div>
                    </el-form-item>

                    <el-form-item v-if="!addElementLibraryPopup.elementInfo.id">
                        <el-button type="primary" @click="recapture">重新捕获</el-button>
                        <el-button type="primary"
                            @click="checkElement(addElementLibraryPopup.elementInfo, 'css')">css检验元素</el-button>
                        <el-button type="primary"
                            @click="checkElement(addElementLibraryPopup.elementInfo)">xpath检验元素</el-button>
                        <el-button type="primary" @click="addElementLibraryPopup.callback">确定</el-button>
                    </el-form-item>
                    <el-form-item v-else>
                        <el-button type="primary"
                            @click="checkElement(addElementLibraryPopup.elementInfo, 'css')">css检验元素</el-button>
                        <el-button type="primary"
                            @click="checkElement(addElementLibraryPopup.elementInfo)">xpath检验元素</el-button>
                        <el-button type="primary" @click="saveElementLibraryInfo">修改并保存</el-button>
                        <el-button type="primary" @click="deleteElementLibraryInfo">删除</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </ElDialog>
    </div>
</template>

<style lang="less" scoped>
// 添加样式
</style>
