import fish_nav from "./fish_nav";
var ugame = require("./ugame");

export default class fish_data extends Laya.Script {

    constructor() { 
        super(); 
        this.config = null;
        this.hp = 0;
    }
    
    onAwake() {
        this.nav = this.owner.getComponent(fish_nav);
    }

    init_fish_data(config) {
        this.config = config;
        this.hp = this.config.hp;
    }

    on_kill(kill_value) {
        this.hp -= kill_value;
        if (this.hp <= 0) { // 鱼挂了
            // 
            Laya.SoundManager.playSound("res/sounds/sfx_coin.ogg");
            ugame.add_chip(this.config.coinValue); 
            ugame.add_exp(this.config.expValue); 
            // 

            this.reset();
        }
    }

    reset() {
        this.hp = this.config.hp;
        var delay_ms = 5000 + Math.random() * 5000; // [5000, 10000]
        this.nav.reset(delay_ms);
    }
}