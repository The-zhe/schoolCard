import E from 'wangeditor';

const {$,BtnMenu,DropListMenu,PanelMenu,DropList,Panel,Tooltip} = E;





export default class writeMenu extends BtnMenu{
    constructor(editor) {
        const $elem = E.$(`
            <div class="w-e-menu w-e-menu--custom" data-title="手写插入">
                <span>手写插入</span>
            </div>
        `);
        super($elem,editor)
    }
    clickHandler() {
        // editor.cmd.do('insertHTML', '手写插入');
        window.open('http://webdemo.myscript.com/views/math/index.html')
    }
    // 菜单激活状态
    tryChangeActive() {
        this.active(); // 菜单激活
        // this.unActive() // 菜单不激活
    }
}