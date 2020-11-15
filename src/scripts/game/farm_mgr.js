import res_mgr from "../managers/res_mgr";
import fish_nav from "./fish_nav";
import fish_AI from "./fish_AI";
import fish_data from "./fish_data";
var ObjectType = require("./ObjectType");
    
export default class farm_mgr extends Laya.Script {

    constructor() { 
        super(); 
        // 更多参数说明请访问: https://ldc2.layabox.com/doc/?nav=zh-as-2-4-0
    }
    
    onAwake() {
        this.fish_root = this.owner.getChildByName("fish_root");
        this.farm_bg = this.owner.getChildByName("bg"); // 
        this.farm_bg.layer = ObjectType.BG;

        this.farm_bg.meshRenderer.sharedMaterial.renderQueue = 999;
        this.fish_render_queue = 1000;
    }

    onStart() {

    }

    remove_all_fishes() {
        this.fish_root.destroyChildren();
    }

    create_fish(r) {
        var fish_prefab = res_mgr.Instance.get_sprite3D_res("res/prefabs3D/LayaScene_fishes/Conventional/" + r.fishName + ".lh");
        if (!fish_prefab) {
            console.log("error: fish has no prefab: " + r.fishName);
            return null;
        }

        var fish = Laya.Sprite3D.instantiate(fish_prefab);
        var scale = r.scale / 1000;
        scale = scale * 0.3; // 之前unity项目 15, 5---> 0.3;
        fish.transform.localScale = new Laya.Vector3(scale, scale, scale);
        fish.layer = ObjectType.FISH;
        
        var anim = fish.getChildByName("anim");
        var animator = fish.getChildByName("anim").getComponent(Laya.Animator);
        var anim_state = animator.getDefaultState();
        if (!anim_state) {
            console.log("error fish: " + r.fishName + " has no anim");
        }
        else {
            anim_state.clip.islooping = true;
        }
        
        var body = anim.getChildByName("body");
        body.skinnedMeshRenderer.sharedMaterial.renderQueue = this.fish_render_queue;
        
        this.fish_root.addChild(fish);

        this.fish_render_queue ++; 
        return fish;
    }
    
    config_fish_nav(roads, r, fish) {
        var nav = fish.addComponent(fish_nav);
        nav.speed = Math.floor(r.min_speed + Math.random() * (r.max_speed - r.min_speed)) / 1000;
        nav.speed = nav.speed * 0.3;

        var revert = (r.isRevert == 1) ? true : false;
        var index = r.roadIndex % roads.length; // 参数的合法性;

        if (r.isRandom === 1) { // 随机选着一条路径在渔场里面游动;
            nav.walk_on_road(roads, index, revert, r.genTime);
        }
        else { // 只又一条;
            nav.walk_on_road([roads[index]], 0, revert, r.genTime);
        }
    }

    find_nearest_fish(ref_dst) {
        var min_len = 1000000.0;
        var min_fish = null;

        for(var i = 0; i < this.fish_root.numChildren; i ++) {
            var fish = this.fish_root.getChildAt(i);

            var x_offset = ref_dst.x - fish.transform.position.x;
            var y_offset = ref_dst.y - fish.transform.position.y;

            var len = x_offset * x_offset + y_offset * y_offset; // len ^ 2;
            if (len < min_len) {
                min_len = len;
                min_fish = fish;
            }
        }

        if (min_len <= 0.3 && min_fish !== null) {
            var pos = min_fish.transform.position;
            ref_dst.x = pos.x;
            ref_dst.y = pos.y;
            ref_dst.z = pos.z;
            console.log(min_fish.name);
            return true;
        }

        return false;
    }

    gen_fishes(roads, config_model) {
        this.fish_render_queue = 1000;
        for(var i = 0; i < config_model.filed_data_array.total_count; i ++) {
            var r = config_model.get_record(i + 1);
            var fish = this.create_fish(r);
            if (!fish) {
                continue;
            }

            // fish nav;
            this.config_fish_nav(roads, r, fish);

            var f_data = fish.addComponent(fish_data);
            f_data.init_fish_data(r);
            
            if (r.use_AI !== 0) {
                fish.addComponent(fish_AI);
            }
        }
    }

    onEnable() {
    }

    onDisable() {
    }
}