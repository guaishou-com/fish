import game_app from "./game_app";
import event_mgr from "../managers/event_mgr";
import fish_data from "./fish_data";

var ObjectType = require("./ObjectType");

export default class bullet extends Laya.Script3D {

    constructor() { 
        super(); 
    }
    
    onAwake() {
        this.is_died = false;
        this.body = this.owner.getComponent(Laya.Rigidbody3D);
        this.body.collisionGroup = 2; // (1<<1, 默认1, 2 ,4 8, 16, 32, )
        this.body.canCollideWith = (1 << 0); // -1;
    }

    init_bullet(config) {
        this.config = config;
    }
    
    shoot_to(dst, degree) {
        this.owner.transform.lookAt(dst, Laya.Vector3._Up, false);
        var forward = new Laya.Vector3();
        this.owner.transform.getForward(forward);

        var scale = 0.5;
        var vx = this.config.speed * forward.x * scale;
        var vy = this.config.speed * forward.y * scale;
        var vz = this.config.speed * forward.z * scale;

        this.body.linearVelocity = new Laya.Vector3(vx, vy, vz);
    }

    onCollisionEnter(collision) {
        if (this.is_died === true) {
            return;
        }

        if (collision.other.owner.layer == ObjectType.FISH) {
            this.is_died = true;
            var net_pos = game_app.Instance.get_fish_net_pos(this.owner.transform.position);
            event_mgr.Instance.dispatch_event("fish_net", net_pos);
            collision.other.owner.getComponent(fish_data).on_kill(this.config.killValue);
        }

        if (collision.other.owner.layer == ObjectType.BG) {
            this.is_died = true;
        }
    }

    onUpdate() {
        if (this.is_died || this.owner.transform.position.z >= 100) { // 
            this.owner.removeSelf();
            return;
        }
    }
}