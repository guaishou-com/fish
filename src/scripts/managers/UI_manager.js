import res_mgr from "./res_mgr";

export default class UI_manager extends Laya.Script {

    constructor() { 
        super(); 
        // 更多参数说明请访问: https://ldc2.layabox.com/doc/?nav=zh-as-2-4-0
    }

    onAwake() {
        if (!UI_manager.Instance) {
            UI_manager.Instance = this;
        }
        else {
            console.log("error UI_manager multi instances");
            return;
        }

        this.ui_view = {};
    }

    onEnable() {
    }

    onDisable() {
    }

    show_ui(name) {
        var url = "res/ui_prefabs/" + name + ".json";
        var prefab = res_mgr.Instance.get_prefab_res(url);
        if (!prefab) {
            return;
        }

        var obj = prefab.create();
        this.owner.addChild(obj);
        // 挂上脚本, name_ctrl类; 名字---》类型;
        var cls = Laya.ClassUtils.getClass(name + "_ctrl");
        if (cls) {
            obj.addComponent(cls);
        }
        // end

        this.ui_view[name] = obj;
    }

    remove_ui(name) {
        if (this.ui_view[name]) {
            this.ui_view[name].removeSelf();
            this.ui_view[name] = null;
        }
    }

    remove_all_ui() {
        for(var key in this.ui_view) {
            if (this.ui_view[key]) {
                this.ui_view[key].removeSelf();
                this.ui_view[key] = null;
            }
        }
    }

}