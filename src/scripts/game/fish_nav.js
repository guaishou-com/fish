

export default class fish_nav extends Laya.Script3D {

    constructor() { 
        super(); 
    }
    
    onAwake() {
        this.is_revert = false; // false: 0, next_step ++, true:  最后一个点, next_step --;
        this.is_walking = false;
        this.speed = 5;
    }

    reset(delay_ms) {
        this.is_walking = false;
        var index = Math.random() * this.roads.length;
        index = Math.floor(index);
        this.is_revert = !this.is_revert;
        this.walk_on_road(this.roads, index, this.is_revert, delay_ms);
    }

    walk_on_road(roads, index, revert, delay_ms) {
        this.is_walking = false;

        if (index < 0 || index >= roads.length) {
            return;
        }

        this.roads = roads;
        this.road_data = roads[index];
        this.is_revert = revert;

        if (this.road_data.length < 2) {
            return;
        }

        if (this.is_revert) {
            var last_index = this.road_data.length - 1;
            this.owner.transform.localPosition = new Laya.Vector3(this.road_data[last_index].x + 1500, this.road_data[last_index].y, this.road_data[last_index].z);
            this.next_step = last_index - 1;
        }
        else {
            this.owner.transform.localPosition = new Laya.Vector3(this.road_data[0].x + 1500, this.road_data[0].y, this.road_data[0].z);
            this.next_step = 1;
        }
        

        if (delay_ms > 0) {
            Laya.timer.once(delay_ms, this, this.walk_to_next);
        }
        else {
            this.walk_to_next();
        }
        
    }

    walk_to_next() {
        if (this.next_step >= this.road_data.length || this.next_step < 0) {
            this.is_walking = false;
            
            var index = Math.random() * this.roads.length;
            index = Math.floor(index);
            this.is_revert = !this.is_revert;
            this.walk_on_road(this.roads, index, this.is_revert, 0);
            return;
        }

        var src = this.owner.transform.localPosition;
        var dst = new Laya.Vector3(this.road_data[this.next_step].x + 1500, this.road_data[this.next_step].y, this.road_data[this.next_step].z);

        var dir = new Laya.Vector3();
        Laya.Vector3.subtract(dst, src, dir);
        var len = Laya.Vector3.scalarLength(dir);
        if (len <= 0) {
            if (this.is_revert) {
                this.next_step --;
            }
            else {
                this.next_step ++;
            }
            this.walk_to_next();
            return;
        }

        this.walk_time = len / this.speed;
        this.passed_time = 0;

        this.vx = this.speed * (dir.x / len);
        this.vy = this.speed * (dir.y / len);
        this.vz = this.speed * (dir.z / len);

        this.is_walking = true;

        // 鱼头的朝向 --->transfrom LookAt;
        var rot = this.owner.transform.localRotation;
        this.owner.transform.lookAt(dst, new Laya.Vector3(0, 1, 0), true);
        this.dst_rot = this.owner.transform.localRotation;
        this.owner.transform.localRotation = rot;
    }

    onUpdate() {
        if (this.is_walking === false) {
            return;
        }


        var dt = Laya.timer.delta / 1000;
        
        this.passed_time += dt;
        if (this.passed_time > this.walk_time) {
            dt -= (this.passed_time - this.walk_time);
        }
        
        var pos = this.owner.transform.localPosition;
        pos.x += (this.vx * dt);
        pos.y += (this.vy * dt);
        pos.z += (this.vz * dt);
        this.owner.transform.localPosition = pos;

        // 旋转插值;
        var new_rot = new Laya.Quaternion();
        Laya.Quaternion.slerp(this.dst_rot, this.owner.transform.localRotation, 2 * dt, new_rot);
        this.owner.transform.localRotation = new_rot;
        // end 
        if (this.passed_time >= this.walk_time) {
            if (this.is_revert) {
                this.next_step --;
            }
            else {
                this.next_step ++;
            }
            this.walk_to_next();
        }
    }

    onEnable() {
    }

    onDisable() {
    }
}