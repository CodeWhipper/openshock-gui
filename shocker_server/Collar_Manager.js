const Collar = require("./Collar");

class CollarManager {
    constructor() {
        this.collarlist = [];
    }

    add_collar(input) {
        const collar = new Collar(input.id, input.name);
        this.collarlist.push(collar);
    }

    get_all_collars() {
        return this.collarlist;
    }

    get_unmuted_collars() {
        return this.collarlist.filter(c => !c.get_mute());
    }

    update_collar(id, data) {
        const collar = this.collarlist.find(c => c.get_id() === id);
        if (collar) {
            if (data.max_shock !== undefined) collar.set_max_shock(data.max_shock);
            if (data.mute !== undefined) collar.set_mute(data.mute);
        }
    }
}

module.exports = CollarManager;
