export default class UI_Button extends Laya.Script {

    /** @prop {name:normal_img, tips:"按钮弹起的状态", accept:res, default:null}*/
    /** @prop {name:press_img, tips:"按钮按下的状态", accept:res, default:null}*/
    /** @prop {name:disable_img, tips:"按钮禁用的状态", accept:res, default:null}*/
    /** @prop {name:is_disable, tips:"是否被禁用", type:Bool, default:false}*/

    constructor() { 
        super(); 
        this.normal_img = null;
        this.press_img = null;
        this.disable_img = null;
        this.is_disable = false;
        // 更多参数说明请访问: https://ldc2.layabox.com/doc/?nav=zh-as-2-4-0
    }
    
    onAwake() {
        this.owner.on(Laya.Event.CLICK, this, this.on_click);
        this.set_disable(this.is_disable);
    }

    on_click(event) {
        event.stopPropagation();
    }

    onMouseDown() {
        if (this.is_disable) {
            return;
        }

        if (this.press_img !== null) {
            this.owner.skin = this.press_img;
        }
    }

    onMouseUp() {
        if (this.is_disable) {
            return;
        }
    
        if (this.normal_img !== null)  {
            this.owner.skin = this.normal_img;
        }
    }

    set_disable(is_disable) {
        if (this.is_disable == is_disable) {
            return;
        }

        this.is_disable = is_disable;

        if (this.is_disable) {
            if (this.disable_img) {
                this.owner.skin = this.disable_img;
            }
        }
        else {
            if (this.normal_img) {
                this.owner.skin = this.normal_img;
            }
        }
    }

    onEnable() {
    }

    onDisable() {
    }
}