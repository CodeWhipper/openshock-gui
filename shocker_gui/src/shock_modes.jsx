import "./Api_calls/Api_calls"
import { control_collar } from "./Api_calls/Api_calls"
import {Collarmodes} from "./utils/collar_modes.js"

function shock_all(collars ,intensity = 10, duration = 300){
    for (let i = 0; i< collars.length; i++){
        control_collar(collars[i].id, Collarmodes.SHOCK, intensity, duration)
    }
}

//function shock_random(collars ,intensity = 10, duration = 300)

export {shock_all}