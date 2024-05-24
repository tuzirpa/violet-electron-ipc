import { ref } from 'vue';

export const dragData = ref<{ add: boolean; data: any }>({
    add: false,
    data: null
});
