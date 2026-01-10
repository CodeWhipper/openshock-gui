const Collar = require("./Collar");

class CollarManager {
    constructor() {
        this.collarlist = [];
    }

    upsertCollar(data) {
        const existing = this.collarlist.find(c => c.get_id() === data.id);
        if (existing) {
            existing.set_name(data.name ?? existing.get_name());
            if (data.max_shock !== undefined) existing.set_max_shock(data.max_shock);
            if (data.active !== undefined) existing.set_active(data.active);
            if (data.mute !== undefined) existing.set_mute(data.mute);
            ["game_random", "game_wheel", "game_tick", "game_mine"].forEach(mode => {
                if (data[mode] !== undefined) existing.set_game_mode(mode, data[mode]);
            });
        } else {
            const collar = new Collar(data.id, data.name);
            if (data.max_shock !== undefined) collar.set_max_shock(data.max_shock);
            if (data.active !== undefined) collar.set_active(data.active);
            if (data.mute !== undefined) collar.set_mute(data.mute);
            ["game_random", "game_wheel", "game_tick", "game_mine"].forEach(mode => {
                if (data[mode] !== undefined) collar.set_game_mode(mode, data[mode]);
            });
            this.collarlist.push(collar);
        }
    }

    add_collar(input) {
        const collar = new Collar(input.id, input.name);
        if (input.max_shock !== undefined) collar.set_max_shock(input.max_shock);
        if (input.active !== undefined) collar.set_active(input.active);
        if (input.mute !== undefined) collar.set_mute(input.mute);
        ["game_random", "game_wheel", "game_tick", "game_mine"].forEach(mode => {
            if (input[mode] !== undefined) collar.set_game_mode(mode, input[mode]);
        });
        this.collarlist.push(collar);
    }

    get_all_collars() {
        return this.collarlist.map(c => c.toJSON());
    }

    get_unmuted_collars() {
        return this.collarlist.filter(c => !c.get_mute());
    }

    update_collar(id, data) {
        const collar = this.collarlist.find(c => c.get_id() === id);
        if (collar) {
            if (data.max_shock !== undefined) collar.set_max_shock(data.max_shock);
            if (data.active !== undefined) collar.set_active(data.active);
            if (data.mute !== undefined) collar.set_mute(data.mute);
            ["game_random", "game_wheel", "game_tick", "game_mine"].forEach(mode => {
                if (data[mode] !== undefined) collar.set_game_mode(mode, data[mode]);
            });
            if (data.name !== undefined) collar.set_name(data.name);
        }
    }
}

module.exports = CollarManager;
