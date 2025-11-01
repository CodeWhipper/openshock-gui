import "./Api_calls/Api_calls"
import { control_collar } from "./Api_calls/Api_calls"
import { Collarmodes } from "./utils/collar_modes.js"


function shock_person(collar, shock_percentage, duration = 300) {
    if (!collar.mute) {
        console.log("shocking!!! "+ collar.name);
        const intensity = Math.floor((shock_percentage / 100) * collar.max_shock)
        control_collar(collar.id, Collarmodes.SHOCK, intensity, duration)
    }
}

function shock_all(collar_list, shock_percentage, duration = 300) {
    for (let i = 0; i < collar_list.length; i++) {
        shock_person(collar_list[i], shock_percentage, duration)
    }
}

function shock_random(collar_list, shock_percentage, duration) {
    let unmuted = get_unmuted(collar_list)
    const random_number = Math.floor(Math.random() * unmuted.length)   
    shock_person(unmuted[random_number], shock_percentage, duration)
}

function get_unmuted(collar_list) {
    return collar_list.filter(c => !c.mute);
}
//function shock_random(collars ,intensity = 10, duration = 300)

export { shock_all, shock_person, shock_random }