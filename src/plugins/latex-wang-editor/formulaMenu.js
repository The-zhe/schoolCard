import E from 'wangeditor';

const {$,BtnMenu,DropListMenu,PanelMenu,DropList,Panel,Tooltip} = E;



export default class formulaMenu extends BtnMenu{
    constructor(editor) {
        const $elem = E.$(`
            <div class="w-e-menu w-e-menu--custom" data-title="公式检查">
                <span>公式检查</span>
            </div>
        `);
        super($elem,editor)
    }
    clickHandler() {
        window.open('https://zh.numberempire.com/latexequationeditor.php')
    }
    // 菜单激活状态
    tryChangeActive() {
        this.active(); // 菜单激活
        // this.unActive() // 菜单不激活
    }
}