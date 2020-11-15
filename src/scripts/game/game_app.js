require("./UI_ctrls/uictrl_class_reg");

import game_mgr from "../managers/game_mgr";
import UI_manager from "../managers/UI_manager";
import res_mgr from "../managers/res_mgr";
import event_mgr from "../managers/event_mgr";
import fish_nav from "./fish_nav";
import farm_mgr from "./farm_mgr";
import bullet from "./bullet";

var SingleFarmWaypoint = require("./../maps/SingleFarmWaypoint");
var MultiFarmWaypoint = require("./../maps/MultiFarmWaypoint");
var ChooseFishData = require("../excels/ChooseFishData");
var FishGenData = require("../excels/FishGenData");
var MultiFishGen = require("../excels/MultiFishGen");
var ObjectType = require("./ObjectType");
var BulletConfig = require("../excels/BulletConfig");
var ugame = require("./ugame");

export default class game_app extends game_mgr {

    constructor() { 
        super(); 
        // 更多参数说明请访问: https://ldc2.layabox.com/doc/?nav=zh-as-2-4-0
    }
    
    onAwake() {
        super.onAwake();

        ugame.init();

        if (!game_app.Instance) {
            game_app.Instance = this;
        }
        else {
            console.log("error game app multi instances");
            return;
        }

        this.game_start();
    }

    game_start() {
        res_mgr.Instance.preload_res_pkg({
            prefabs: [
                "res/ui_prefabs/LoginUI.json",
                "res/ui_prefabs/ChooseUI.json",
                "res/ui_prefabs/GameUI.json",
            ],

            scene3D: [
                "res/scenes3D/LayaScene_fisher_farmer/Conventional/fisher_farmer.ls", 
            ],

            sprite3D: [
                "res/prefabs3D/LayaScene_fishes/Conventional/cheqiyu.lh",
                "res/prefabs3D/LayaScene_fishes/Conventional/denglongyu.lh",
                "res/prefabs3D/LayaScene_fishes/Conventional/dinianyu.lh",
                "res/prefabs3D/LayaScene_fishes/Conventional/fangyu.lh",
                "res/prefabs3D/LayaScene_fishes/Conventional/haigui.lh",
                "res/prefabs3D/LayaScene_fishes/Conventional/hetun.lh",
                "res/prefabs3D/LayaScene_fishes/Conventional/jianyu.lh",
                "res/prefabs3D/LayaScene_fishes/Conventional/jinqiangyu.lh",
                "res/prefabs3D/LayaScene_fishes/Conventional/shayu.lh",
                "res/prefabs3D/LayaScene_fishes/Conventional/shayu2.lh",
                "res/prefabs3D/LayaScene_fishes/Conventional/shiziyu.lh",
                "res/prefabs3D/LayaScene_fishes/Conventional/tianshiyu.lh",
                "res/prefabs3D/LayaScene_fishes/Conventional/xiaochouyu.lh",
                "res/prefabs3D/LayaScene_fishes/Conventional/xiaohuangyu.lh",
                "res/prefabs3D/LayaScene_fishes/Conventional/xiaolvyu.lh",
                "res/prefabs3D/LayaScene_bullut/Conventional/bullet.lh",
            ],

            atlas: [
                "res/atlas/res/ui/achievements.atlas",
                "res/atlas/res/ui/bullets.atlas",
                "res/atlas/res/ui/button.atlas",
                "res/atlas/res/ui/cannons.atlas",
                "res/atlas/res/ui/choose_new.atlas",
                "res/atlas/res/ui/common_icon.atlas",
                "res/atlas/res/ui/common_image.atlas",
                "res/atlas/res/ui/heads.atlas",
                "res/atlas/res/ui/main_screen.atlas",
                "res/atlas/res/ui/reward.atlas",
                "res/atlas/res/ui/start.atlas",
            ],

            sounds: [
                "res/sounds/bgm_scene1.ogg",
                "res/sounds/bgm_scene3.ogg",
                "res/sounds/bgm_select.ogg",
                "res/sounds/sfx_coin.ogg",
                "res/sounds/sfx_coins.ogg",
                "res/sounds/sfx_harpoon.ogg",
                "res/sounds/sfx_net.ogg",
                "res/sounds/sfx_levelup.ogg",
            ],
        }, null, function() {
            
            var scene3D = res_mgr.Instance.get_scens3d_res("res/scenes3D/LayaScene_fisher_farmer/Conventional/fisher_farmer.ls");
            Laya.stage.addChild(scene3D);
            scene3D.zOrder = -1;
            var fish_far = scene3D.getChildByName("fish_farm");
            var fish_root = fish_far.getChildByName("fish_root");
            var camera = scene3D.getChildByName("Main Camera");
            camera.useOcclusionCulling = false;
            this.camera = camera;

            this.scene3D = scene3D;
            this.fish_far = fish_far;
            this.farm_manger = fish_far.addComponent(farm_mgr);
            this.shoot_point = fish_far.getChildByName("shoot_point");
            this.fish_root = fish_root;

            this.enter_logion_scene();
        }.bind(this));
    }

    onStart() {
        
    }

    get_fish_net_pos(point) {
        var screen_pos = new Laya.Vector3();
        this.camera.worldToViewportPoint(point, screen_pos);

        return new Laya.Vector2(screen_pos.x, screen_pos.y);
    }

    check_coin() {
        var ulevel = ugame.ulevel;
        var config = null;

        if (ulevel > BulletConfig.filed_data_array.total_count) {
            config = BulletConfig.get_record(BulletConfig.filed_data_array.total_count);
        }
        else {
            config = BulletConfig.get_record(ulevel);
        }

        return (ugame.coin >= config.coinCost);
    }

    // out_result: 用户传入一个表，我再函数里面往这个表里来添加结构就可以，返回以后外面就可以拿到;
    // 返回值: bool true: 正常获得射击点，false, 就无法射击;
    get_shoot_point(out_result) {
        var ray = new Laya.Ray(new Laya.Vector3(0, 0, 0), new Laya.Vector3(0, 0, 1)); // 射线对象
        var screen_pos = new Laya.Vector2(Laya.MouseManager.instance.mouseX, Laya.MouseManager.instance.mouseY);
        this.camera.viewportPointToRay(screen_pos, ray); // ray 生成了一个摄像对象，从屏幕点击位置开始，垂直与屏幕发射一条射线;

        var hit = new Laya.HitResult();
        if (!this.scene3D.physicsSimulation.rayCast(ray, hit)) { // 射线状态了某个物体;
            return false;
        }

        var dst = hit.point;
        if (hit.collider.owner.layer == ObjectType.BG || hit.collider.owner.layer == ObjectType.BULLET) {
            dst.z = 20;
            // 找这个最近的鱼;
            if (this.farm_manger.find_nearest_fish(dst)) {
            }
            // end 
        }
        else {
            console.log(hit.collider.owner.name);
        }

        var dx = dst.x - this.shoot_point.transform.position.x;
        var dy = dst.y - this.shoot_point.transform.position.y;

        var r = Math.atan2(dy, dx);
        var degree = r * 180 / Math.PI;

        // 特别注意;由于laya的坐标系是从后面看的，所以球的角度，和我们认同不一样;
        degree = 180 - degree;
        
        out_result.dst = dst;
        out_result.degree = degree;

        return true;
    }

    shoot_bullet(dst, degree) {
        var ulevel = ugame.ulevel;
        var config = null;

        if (ulevel > BulletConfig.filed_data_array.total_count) {
            config = BulletConfig.get_record(BulletConfig.filed_data_array.total_count);
        }
        else {
            config = BulletConfig.get_record(ulevel);
        }
        

        var bullet_prefab =  res_mgr.Instance.get_sprite3D_res("res/prefabs3D/LayaScene_bullut/Conventional/" + config.bulletName + ".lh");

        var obj = Laya.Sprite3D.instantiate(bullet_prefab);
        obj.layer = ObjectType.BULLET;

        this.shoot_point.addChild(obj);
        obj.transform.localPosition = Laya.Vector3._ZERO;
        var b = obj.addComponent(bullet);
        

        b.init_bullet(config);
        b.shoot_to(dst, degree);

        ugame.add_chip(-config.coinCost);
    }

    enter_logion_scene() {

        Laya.SoundManager.stopMusic();
        Laya.SoundManager.playMusic("res/sounds/bgm_scene1.ogg", 0);

        this.farm_manger.remove_all_fishes();
        this.farm_manger.gen_fishes(SingleFarmWaypoint.roads, ChooseFishData);
        UI_manager.Instance.show_ui("LoginUI");
    }

    enter_choose_scene() {
        Laya.SoundManager.stopMusic();
        Laya.SoundManager.playMusic("res/sounds/bgm_select.ogg", 0);

        UI_manager.Instance.remove_all_ui();
        UI_manager.Instance.show_ui("ChooseUI");
    }

    enter_game_scene() {
        Laya.SoundManager.stopMusic();
        Laya.SoundManager.playMusic("res/sounds/bgm_scene3.ogg", 0);

        this.farm_manger.remove_all_fishes();
        this.farm_manger.gen_fishes(SingleFarmWaypoint.roads, FishGenData);
        this.farm_manger.gen_fishes(MultiFarmWaypoint.roads, MultiFishGen);

        UI_manager.Instance.remove_all_ui();
        UI_manager.Instance.show_ui("GameUI");
    }

    onEnable() {

    }

    onDisable() {
    }
}