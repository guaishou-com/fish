import UI_ctrl from "../../managers/UI_ctrl";
import game_app from "../game_app";

export default class LoginUI_ctrl extends UI_ctrl {

    constructor() { 
        super(); 
        // 更多参数说明请访问: https://ldc2.layabox.com/doc/?nav=zh-as-2-4-0
    }
    
    onAwake() {
        super.onAwake();
    }

    onStart() {
        // this.view["center/desic"].text = "version";
        this.view["center/start_button"].on(Laya.Event.CLICK, this, this.on_start_click);
    }

    on_start_click() {
        game_app.Instance.enter_choose_scene();
    }

    onEnable() {
    }

    onDisable() {
    }
}