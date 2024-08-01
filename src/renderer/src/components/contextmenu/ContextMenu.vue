<template>
    <div>
        <!-- 遮挡层 -->
        <!-- <div class="context-menu-mask" v-show="showMenu" @mousedown="showMenu = false"></div> -->
        <div v-show="showMenu" ref="menu" @blur="showMenu = false"
            class="context-menu rounded w-56 shadow-xl outline-none border-gray-200 border"
            :style="{ top: `${menuY}px`, left: `${menuX}px` }" tabindex="-1">

            <div class="group w-full h-10 flex flex-row justify-between items-center p-1
             hover:bg-gray-100  rounded gap-2" :class="{ disabled: item.disabled }" @click.stop="handleItemClick(item)"
                v-for="(item, index) in menuItems" :key="index">
                <i v-if="typeof item.icon === 'string'" class=" w-5 h-5 iconfont  mr-3" :class="item.icon"></i>
                <div v-else class="iconfont w-5 h-5   mr-3" :class="item.icon">
                    <component :is="item.icon"></component>
                </div>
                <span class="flex-1  text-sm">{{ item.label }}</span>
                <span class="shortcut text-xs pr-2">{{ item.shortcut }}</span>
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
            menuY: 0,
            menuRef: null as HTMLElement | null,
        };
    },
    mounted() {
        this.menuRef = this.$refs.menu as HTMLElement;
    },
    methods: {
        handleDocumentClick() {
            this.showMenu = false;
        },
        async showContextMenu(event: MouseEvent, menuItems: MenuItem[] = []) {
            this.menuX = event.pageX;
            this.menuY = event.pageY;


            this.menuItems = menuItems;
            this.showMenu = true;

            await this.$nextTick();
            this.menuRef?.focus();
            let { width, height } = this.menuRef!.getBoundingClientRect();
            // const width = this.menuRef!.offsetWidth;
            // const height = this.menuRef!.offsetHeight;
            width = width + 20;
            height = height + 20;
            if (this.menuX + width > window.innerWidth) {
                this.menuX = window.innerWidth - width;
                this.menuY = this.menuY + 20;
            }
            if (this.menuY + height > window.innerHeight) {
                this.menuY = window.innerHeight - height;
            }

            // 阻止默认的右键菜单行为
            event.preventDefault();

        },
        handleItemClick(item: MenuItem) {
            if (item.disabled) {
                return;
            }
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
    cursor: pointer;

    .iconfont,
    .shortcut {
        color: #ccc;
    }


    :hover {
        .iconfont {
            color: #000000;
        }
    }

    .disabled {
        cursor: not-allowed;
        color: #e9e9e9;

        .iconfont {
            color: #e9e9e9;
        }
    }

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
  