class Collar {
    constructor(id, name) {
        this.name = name
        this.id = id
        this.max_shock = 0
        this.mute = false
        }
    
    set_max_shock(input){
        if (input >= 0 && input <= 100) this.max_shock = input
    }
    get_max_shock(){
        return this.max_shock
    }
    get_id(){
        return this.id
    }
    get_name(){
        return this.name
    }
    set_mute(input){
        this.mute = input
    }
    get_mute(){
        return this.mute
    }
}

class Coallar_managment{
    constructor() {
        this.collarlist = []
    }
    add_collar(input){
        let collar = new Collar(input.id, input.name)
        this.collarlist.push(collar)
    }
    get_unmuted_collars(){
        let result = []
        for(let i = 0; i < this.collarlist.length; i++){
            if (!this.collarlist[i].get_mute){
                result.push(this.collarlist[i])
            }
        }
        return result
    }
    get_all_collars(){
        return this.collarlist
    }
}