class Collar {
    constructor(id, name) {
        this.id = id;
        this.name = name;
        this.max_shock = 0;
        this.mute = false;
    }

    set_max_shock(input) {
        if (input >= 0 && input <= 100) this.max_shock = input;
    }

    get_max_shock() {
        return this.max_shock;
    }

    get_id() {
        return this.id;
    }

    get_name() {
        return this.name;
    }

    set_mute(input) {
        this.mute = input;
    }

    get_mute() {
        return this.mute;
    }
}

module.exports = Collar;
