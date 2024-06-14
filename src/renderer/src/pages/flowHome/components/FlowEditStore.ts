// import { Action } from '@renderer/lib/action';
// import { ref } from 'vue';

// export const historysMap = ref(
//     new Map<
//         string,
//         {
//             curIndex: number;
//             historys: { saveName: string; data: any }[];
//         }
//     >()
// );

// /**
//  * 撤销
//  */
// export const undo = () => {
//     if (curIndex.value === 0) {
//         return;
//     }
//     curIndex.value--;
//     console.log(historyDrawData.value[curIndex.value], 'quash');
//     drawData.value = copyObj(historyDrawData.value[curIndex.value].data);
//     currentNodeElements.value = [];
//     draw();
// };
// /**
//  * 重做
//  */
// export const redo = () => {
//     if (curIndex.value >= historyDrawData.value.length - 1) {
//         return;
//     }
//     curIndex.value++;
//     drawData.value = historyDrawData.value[curIndex.value].data;
//     draw();
// };

// /**
//  * 重做
//  */
// export const historyTo = (index) => {
//     curIndex.value = index;
//     drawData.value = historyDrawData.value[curIndex.value].data;
//     draw();
// };
