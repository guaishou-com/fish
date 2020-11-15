import fish_nav from "./fish_nav";

export default class fish_AI extends Laya.Script {

    constructor() { 
        super(); 
        // 更多参数说明请访问: https://ldc2.layabox.com/doc/?nav=zh-as-2-4-0
    }
    
    onAwake() {
        this.think_time = 0.3;
        this.offset_x = 5; // [-5, 5]
        
        this.allready_in_center = false; // 不在中间水域
        this.now_time = this.think_time;
    }

    onStart() {
        this.nav = this.owner.getComponent(fish_nav);
        this.speed0 = this.nav.speed; // 保存我们的初始的速度;
        this.dst_speed = 0; // 表示不用插值;
    }

    in_center() {
        if (this.owner.transform.localPosition.x >= (-this.offset_x) &&
            this.owner.transform.localPosition.x <= (this.offset_x)) {
                return true;
        }

        return false;
    }

    do_AI() {
        var is_center = this.in_center();
        if (!this.allready_in_center) {
            if(is_center) {
                // 减速决策
                this.dst_speed = this.speed0 * (0.4 + Math.random() * 0.2);
                // end 
                this.allready_in_center = true;
            }
        }
        else {
            if (!is_center) {
                // 加速离开
                this.dst_speed = this.speed0;
                // end
                this.allready_in_center = false;
            }
        }
    }

    onUpdate() {
        var dt = Laya.timer.delta / 1000;
        this.now_time += dt;
        if (this.now_time >= this.think_time) {
            this.now_time = 0;
            this.do_AI();
        }

        if (this.dst_speed > 0 && this.dst_speed !== this.nav.speed) {
            this.nav.speed = this.nav.speed + (this.dst_speed - this.nav.speed) * 3 * dt;
        }
    }
}