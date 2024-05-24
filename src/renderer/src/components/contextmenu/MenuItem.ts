export default class MenuItem {
    constructor(
        public label: string,
        public icon: string,
        public shortcut: string,
        public onClick: () => void
    ) {}
}
