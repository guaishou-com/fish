import event_mgr from "../managers/event_mgr";

var LevelConfig = require("../excels/LevelConfig");

var ugame = {
    coin: 0,
    damon: 0,
    exp: 0,
    ulevel: 0,

    init() {
        var str = Laya.LocalStorage.getItem("is_saved");
        var is_saved = 0;
        if (str) {
            is_saved = parseInt(str);
        }
        
        if (is_saved === 0) {
            this.coin = 8000;
            this.damon = 10;
            this.exp = 0;

            Laya.LocalStorage.setItem("is_saved", "1");
            Laya.LocalStorage.setItem("coin", "" + this.coin);
            Laya.LocalStorage.setItem("damon", "" + this.damon);
            Laya.LocalStorage.setItem("exp", "" + this.exp);
        }
        else {
            str = Laya.LocalStorage.getItem("coin");
            this.coin = parseInt(str);

            str = Laya.LocalStorage.getItem("damon");
            this.damon = parseInt(str);

            str = Laya.LocalStorage.getItem("exp");
            this.exp = parseInt(str);
        }

        this.ulevel = this.get_level(this.exp);
    },

    get_level(exp) {
        var level = 0;
        for(var i = 0; i < LevelConfig.filed_data_array.total_count; i ++) {
            if(LevelConfig.get_record(i + 1).exp > exp) {
                break;
            }

            level = i + 1;
        }

        return level;
    },

    add_chip(chip) { // chip < 0;
        this.coin += chip;
        if (this.coin < 0) {
            this.coin = 0;
        }

        Laya.LocalStorage.setItem("coin", "" + this.coin);
        // 金币变换了以后你要抛事件
        event_mgr.Instance.dispatch_event("coin_change", null);
    },

    add_damon(damon) { // chip < 0;
        this.damon += damon;
        if (this.damon < 0) {
            this.damon = 0;
        }

        Laya.LocalStorage.setItem("damon", "" + this.damon);
        event_mgr.Instance.dispatch_event("damon_change", null);
    },

    add_exp(exp) {
        this.exp += exp;
        Laya.LocalStorage.setItem("exp", "" + this.exp);
        event_mgr.Instance.dispatch_event("exp_change", null);

        // 经验增加了有可能触发升级;
        var prev_level = this.ulevel;
        this.ulevel = this.get_level(this.exp);
        if (prev_level != this.ulevel) {
            event_mgr.Instance.dispatch_event("lv_ugrade", null);
        }
    },

    get_avator_icon() {
        var r = LevelConfig.get_record(this.ulevel);
        return "res/ui/heads/" + r.headName + ".png"; 
    },

    get_cannon_icon() {
        var r = LevelConfig.get_record(this.ulevel);
        return "res/ui/cannons/" + r.cannonIconName + ".png"; 
    },
};

module.exports = ugame;