export default class event_mgr extends Laya.Script {

    constructor() { 
        super(); 
    }
    
    onAwake() {
        if(!event_mgr.Instance) {
            event_mgr.Instance = this;
        }
        else {
            console.log("error, event_mgr has multi instances");
            return;
        }

        this.events_map = {}; // "事件名字": [{caller: xxxx, func: xxx}, {}, {}]
    }

    // 添加监听
    add_listener(event_name, caller, func) {
        if (!this.events_map[event_name]) {
            this.events_map[event_name] = [];
        }

        var handler = { caller: caller, func: func };
        this.events_map[event_name].push(handler);
    }

    // 删除监听
    remove_listener(event_name, caller, func) {
        if (!this.events_map[event_name]) {
            return;
        }

        for(var i = 0; i < this.events_map[event_name].length; i ++) {
            var handler = this.events_map[event_name][i];
            if (handler.caller == caller && handler.func == func) {
                this.events_map[event_name].splice(i, 1);
                // return;
                i --;
            }
        }
    }

    // 派送事件
    dispatch_event(event_name, udata) {
        if (!this.events_map[event_name]) {
            return;
        }

        for(var i = 0; i < this.events_map[event_name].length; i ++) {
            var handler = this.events_map[event_name][i];
            handler.func.call(handler.caller, event_name, udata); 
        }
    }
}