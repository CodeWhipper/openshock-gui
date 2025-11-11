class Collar {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.max_shock = 50;
        this.active = false;
        this.mute = false;
        this.game_random = false;
        this.game_wheel = false;
        this.game_tick = false;
        this.game_mine = false;
    }

    set_max_shock(input) {
        if (input >= 0 && input <= 100) this.max_shock = input;
    }

    get_max_shock() {
        return this.max_shock;
    }

    set_active(input) {
        this.active = input;
    }

    get_active() {
        return this.active;
    }

    set_mute(input) {
        this.mute = input;
    }

    get_mute() {
        return this.mute;
    }

    set_game_mode(mode, value) {
        if (["game_random", "game_wheel", "game_tick", "game_mine"].includes(mode)) {
            this[mode] = value;
        }
    }

    get_game_mode(mode) {
        return this[mode];
    }

    get_id() {
        return this.id;
    }

    get_name() {
        return this.name;
    }

    set_name(name) {
        this.name = name;
    }

    toJSON() {
        // Wird automatisch gesendet an Clients
        return {
            id: this.id,
            name: this.name,
            max_shock: this.max_shock,
            active: this.active,
            mute: this.mute,
            game_random: this.game_random,
            game_wheel: this.game_wheel,
            game_tick: this.game_tick,
            game_mine: this.game_mine,
        };
    }
}

module.exports = Collar;
