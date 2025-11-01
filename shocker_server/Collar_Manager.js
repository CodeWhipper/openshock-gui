const Collar = require("./Collar");

class CollarManager {
    constructor() {
        this.collarlist = [];
    }

    upsertCollar(data) {
        const existing = this.collarlist.find(c => c.get_id() === data.id);
        if (existing) {
            // Optional: Update bestehender Daten, z.B. Name
            existing.name = data.name; 
            // andere Felder kannst du hier auch aktualisieren, z.B. max_shock
        } else {
            const collar = new Collar(data.id, data.name);
            this.collarlist.push(collar);
        }
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
