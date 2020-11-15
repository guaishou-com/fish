import UI_manager from "./UI_manager";
import res_mgr from "./res_mgr";
import event_mgr from "./event_mgr";

export default class game_mgr extends Laya.Script {

    constructor() { 
        super(); 
        
    }
    
    onAwake() {
        console.log("init game framwork... ...");
        this.owner.addComponent(UI_manager);
        this.owner.addComponent(res_mgr);
        this.owner.addComponent(event_mgr);
        console.log("end init game framwork");
    }

    onEnable() {
    }

    onDisable() {
    }
}