import UI_ctrl from "../../managers/UI_ctrl";
import game_app from "../game_app";
import event_mgr from "../../managers/event_mgr";
var ugame = require("../ugame");

export default class GameUI_ctrl extends UI_ctrl {

    constructor() { 
        super(); 
        // 更多参数说明请访问: https://ldc2.layabox.com/doc/?nav=zh-as-2-4-0
    }
    
    onAwake() {
        super.onAwake();

        this.is_no_coin = false;
        this.owner.on(Laya.Event.CLICK, this, this.on_shoot_bullet);
        this.view["right/system_click"].on(Laya.Event.CLICK, this, this.on_recv_low_chip);

        event_mgr.Instance.add_listener("fish_net", this, this.gen_fish_net);

        event_mgr.Instance.add_listener("coin_change", this, this.sync_coin);
        this.sync_coin(null, null);
        
        event_mgr.Instance.add_listener("damon_change", this, this.sync_damon);
        this.sync_damon(null, null);

        event_mgr.Instance.add_listener("exp_change", this, this.sync_exp);
        this.sync_exp(null, null);

        event_mgr.Instance.add_listener("lv_ugrade", this, this.sync_level);
        this.sync_level(null, null);
    }

    on_recv_low_chip() {
        if (!this.is_no_coin) {
            return;
        }

        this.is_no_coin = false;
        Laya.SoundManager.playSound("res/sounds/sfx_coins.ogg");
        ugame.add_chip(8000);
    }

    sync_level(event_name, udata) {

        Laya.SoundManager.playSound("res/sounds/sfx_levelup.ogg");

        this.view["left/uinfo/ulevel"].text = "LV" + ugame.ulevel;

        var a_icon = ugame.get_avator_icon();
        this.view["left/uinfo/avator"].skin = a_icon;

        var cannon_icon = ugame.get_cannon_icon();
        this.view["center/bottom/cannon"].skin = cannon_icon;
    }

    sync_exp(event_name, udata) {

    }

    sync_damon(event_name, udata) {
        this.view["center/bottom/damon_rhs/label"].text = "" + ugame.damon;
    }

    sync_coin(event_name, udata) {
        this.view["center/bottom/coin_lhs/label"].text = "" + ugame.coin;
    }

    gen_fish_net(event_name, ui_pos) {
        var net = new Laya.Image("res/ui/bullets/net.png");
        this.view["net_root"].addChild(net);

        net.anchorX = 0.5;
        net.anchorY = 0.5;
        
        net.x = ui_pos.x;
        net.y = ui_pos.y;

        Laya.SoundManager.playSound("res/sounds/sfx_net.ogg");

        Laya.timer.once(1000, this, function() {
            net.removeSelf();
        });
    }

    on_shoot_bullet(event) {
        if (!game_app.Instance.check_coin()) {
            this.is_no_coin = true;
            return;
        }

        var result = {}; // dst: 射击点, degree: 角度;
        if (game_app.Instance.get_shoot_point(result)) {
            Laya.SoundManager.playSound("res/sounds/sfx_harpoon.ogg");
            // 数学是逆时针为正，顺时针为父;
            this.view["center/bottom/cannon"].rotation = 360 - result.degree + 90;
            game_app.Instance.shoot_bullet(result.dst, result.degree);
        }
    }

    onStart() {
    }

    onEnable() {
    }

    onDisable() {
    }
}