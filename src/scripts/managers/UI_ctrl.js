export default class UI_ctrl extends Laya.Script {

    constructor() { 
        super(); 
        // 更多参数说明请访问: https://ldc2.layabox.com/doc/?nav=zh-as-2-4-0
    }
    
    _load_all_inview(root, path) {
        
        for(var i = 0; i < root.numChildren; i ++) {
            var child = root.getChildAt(i);
            this.view[path + child.name] = child;

            this._load_all_inview(child, path + child.name + "/");
        }
    }

    onAwake() {
        this.view = {};
        this._load_all_inview(this.owner, "");
        // console.log(this.view);
    }
}