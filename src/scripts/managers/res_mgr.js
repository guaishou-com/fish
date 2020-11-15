export default class res_mgr extends Laya.Script {

    constructor() { 
        super(); 
    }
    
    onAwake() {
        if (!res_mgr.Instance) {
            res_mgr.Instance = this;
        }
        else {
            console.log("err res_mgr has multi instances");
            return;
        } 

        this.prefabs_res = {};
        this.scene3D_res = {};
        this.sprite3D_res = {};
        this.atlas_res = {};
        this.sound_res = {};
    }

    _one_res_load_finished() {
        this.now_num ++;
        if (this.on_progress) {
            this.on_progress(this.now_num / this.total_num);
        }

        if (this.now_num >= this.total_num && this.on_load_finished) {
            this.on_load_finished();
        }

    }

    load_prefab(url) {
        Laya.loader.load(url, Laya.Handler.create(this, function(json) {
            var pref = new Laya.Prefab();
            pref.json = json;
            this.prefabs_res[url] = pref;

            this._one_res_load_finished();
        }));
    }

    reslease_prefab(url) {
        if (!this.prefabs_res[url]) {
            return;
        }

        this.prefabs_res[url].json = null;
        Laya.loader.clearRes(url);
        this.prefabs_res[url] = null;
    }

    load_atlas(url) {
        Laya.loader.load(url, Laya.Handler.create(this, function(atlas) {
            this.atlas_res[url] = atlas;
            this._one_res_load_finished();
        }));
    }

    reslease_atlas(url) {
        if (!this.atlas_res[url]) {
            return;
        }

        Laya.loader.clearRes(url);
        this.atlas_res[url] = null;
    }

    load_sound(url) {
        Laya.loader.load(url, Laya.Handler.create(this, function(atlas) {
            this.sound_res[url] = atlas;
            this._one_res_load_finished();
        }));
    }

    reslease_sound(url) {
        if (!this.sound_res[url]) {
            return;
        }

        Laya.loader.clearRes(url);
        this.sound_res[url] = null;
    }

    load_scene3D(url) {
        Laya.Scene3D.load(url, Laya.Handler.create(this, function(scene3d) {
            this.scene3D_res[url] = scene3d;

            this._one_res_load_finished();
        }));
    }

    release_scene3D(url) {
        if (!this.scene3D_res[url]) {
            return;
        }

        this.scene3D_res[url] = null;
    }

    load_sprite3D(url) {
        Laya.Sprite3D.load(url, Laya.Handler.create(this, function(sprite3d) {
            this.sprite3D_res[url] = sprite3d;

            this._one_res_load_finished();
        }));
    }

    release_sprite3D(url) {
        if (!this.sprite3D_res[url]) {
            return;
        }

        this.sprite3D_res[url] = null;
        
    }

    // res_set: {prefabs: [], scene3D: [], sprite3D:[], atlas: [], imgs: [], sounds:[]}
    // on_progress(per)
    // on_load_finished
    preload_res_pkg(res_pkg, on_progress, on_load_finished) {
        var i = 0;
        var url = "";

        this.on_progress = on_progress;
        this.on_load_finished = on_load_finished;

        this.total_num = 0;
        for(var key in res_pkg) {
            this.total_num += res_pkg[key].length;
        }

        this.now_num = 0;

        if (res_pkg.prefabs) {
            for(i = 0; i < res_pkg.prefabs.length; i ++) {
                url = res_pkg.prefabs[i];
                this.load_prefab(url);
            }
        }

        if (res_pkg.atlas) {
            for(i = 0; i < res_pkg.atlas.length; i ++) {
                url = res_pkg.atlas[i];
                this.load_atlas(url);
            }
        }

        if (res_pkg.sounds) {
            for(i = 0; i < res_pkg.sounds.length; i ++) {
                url = res_pkg.sounds[i];
                this.load_sound(url);
            }
        }

        if (res_pkg.scene3D) {
            for(i = 0; i < res_pkg.scene3D.length; i ++) {
                url = res_pkg.scene3D[i];
                this.load_scene3D(url);
            }
        }

        if (res_pkg.sprite3D) {
            for(i = 0; i < res_pkg.sprite3D.length; i ++) {
                url = res_pkg.sprite3D[i];
                this.load_sprite3D(url);
            }
        }
    }

    release_res_pkg(res_pkg) {
        if (res_pkg.prefabs) {
            for(i = 0; i < res_pkg.prefabs.length; i ++) {
                url = res_pkg.prefabs[i];
                this.reslease_prefab(url);
            }
        }

        if (res_pkg.atlas) {
            for(i = 0; i < res_pkg.atlas.length; i ++) {
                url = res_pkg.atlas[i];
                this.reslease_atlas(url);
            }
        }

        if (res_pkg.sounds) {
            for(i = 0; i < res_pkg.sounds.length; i ++) {
                url = res_pkg.sounds[i];
                this.reslease_sound(url);
            }
        }

        if (res_pkg.scene3D) {
            for(i = 0; i < res_pkg.scene3D.length; i ++) {
                url = res_pkg.scene3D[i];
                this.release_scene3D(url);
            }
        }

        if (res_pkg.sprite3D) {
            for(i = 0; i < res_pkg.sprite3D.length; i ++) {
                url = res_pkg.sprite3D[i];
                this.release_sprite3D(url);
            }
        }
    }

    get_prefab_res(url) {
        return this.prefabs_res[url];
    }

    get_scens3d_res(url) {
        return this.scene3D_res[url];
    }

    get_sprite3D_res(url) {
        return this.sprite3D_res[url];
    }

}