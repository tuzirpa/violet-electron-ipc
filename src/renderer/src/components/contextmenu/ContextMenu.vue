<template>
    <div>
        <!-- 遮挡层 -->
        <div class="context-menu-mask" v-if="showMenu" @mousedown="showMenu = false"></div>
        <div v-if="showMenu" class="context-menu rounded shadow-xl w-56 border-gray-200 border"
            :style="{ top: `${menuY}px`, left: `${menuX}px` }">

            <div class="group w-full h-10 flex flex-row justify-between items-center p-1 hover:bg-gray-100 hover:cursor-pointer rounded gap-2"
                @click.stop="handleItemClick(item)" v-for="(item, index) in menuItems" :key="index">
                <i class="iconfont group-hover:text-black text-gray-400 mr-3" :class="item.icon"></i>
                <span class="flex-1 text-gray-600 text-sm group-hover:text-gray-900">{{ item.label }}</span>
                <span class="text-gray-400/60 text-xs pr-2">{{ item.shortcut }}</span>
            </div>
        </div>
    </div>
</template>
  
<script lang="ts">
import MenuItem from './MenuItem';

export default {
    data() {
        return {
            showMenu: false,
            menuItems: [] as MenuItem[],
            menuX: 0,
            menuY: 0
        };
    },
    mounted() {

    },
    methods: {
        handleDocumentClick() {
            this.showMenu = false;
        },
        showContextMenu(event: MouseEvent, menuItems: MenuItem[] = []) {
            this.menuX = event.pageX;
            this.menuY = event.pageY;
            this.showMenu = true;
            this.menuItems = menuItems;
            // 阻止默认的右键菜单行为
            event.preventDefault();

        },
        handleItemClick(item: MenuItem) {
            console.log(`Clicked on ${item}`);
            // 这里可以根据点击的菜单项执行相应的逻辑
            this.showMenu = false; // 点击后隐藏菜单
            item.onClick();
        }
    }
};
</script>
  
<style lang="less" scoped>
.context-menu {
    position: absolute;
    background-color: #fff;
    border: 1px solid #ccc;
    padding: 5px;
    list-style: none;
    z-index: 2;
}

.context-menu-mask {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0);
    z-index: 1;
}


.context-menu ul {
    margin: 0;
    padding: 0;
}

.context-menu li {
    cursor: pointer;
}
</style>
  