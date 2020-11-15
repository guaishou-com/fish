import UI_ctrl from "../../managers/UI_ctrl";
import game_app from "../game_app";
var ugame = require("../ugame");

export default class ChooseUI_ctrl extends UI_ctrl {

    constructor() { 
        super(); 
        // 更多参数说明请访问: https://ldc2.layabox.com/doc/?nav=zh-as-2-4-0
    }
    
    onAwake() {
        super.onAwake();
        this.view["center/start_button"].on(Laya.Event.CLICK, this, this.on_start_click);
        this.view["coin/label"].text = "" + ugame.coin;
        this.view["damon/label"].text = "" + ugame.damon;
    }

    onStart() {
    }

    on_start_click(){
        game_app.Instance.enter_game_scene();
    }

    onEnable() {
    }

    onDisable() {
    }
}