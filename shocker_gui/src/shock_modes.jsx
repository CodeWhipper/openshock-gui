import "./Api_calls/Api_calls"
import { control_collar } from "./Api_calls/Api_calls"
import { Collarmodes } from "./utils/collar_modes.js"


function shock_person(collar, shock_percentage, duration = 300) {
    if (!collar.mute) {
        const intensity = Math.floor((shock_percentage / 100) * collar.max_shock)
        console.log("shocking!!! " + collar.name + " intensity: " + intensity);
        control_collar(collar.id, Collarmodes.SHOCK, intensity, duration)
    }
}

function stop_person(collar) {
    console.log("shocking!!! " + collar.name);
    control_collar(collar.id, Collarmodes.STOP, 100, 300)
}

function vibrate_person(collar, intensity, duration = 300) {
    if (!collar.mute) {
        console.log("Vibrating!!! " + collar.name + " intensity: " + intensity);
        control_collar(collar.id, Collarmodes.VIBRATE, intensity, duration)
    }
}
function sound_person(collar, intensity, duration = 300) {
    if (!collar.mute) {
        console.log("Sound!!! " + collar.name + " intensity: " + intensity);
        control_collar(collar.id, Collarmodes.SOUND, intensity, duration)
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

function stop_all(collar_list){
    for (let i = 0; i < collar_list.length; i++) {
        stop_person(collar_list[i])
    }
}

async function shock_spinning_wheel(collar_list, shock_percentage, duration) {
    const unmuted = get_unmuted(collar_list)
    const random_number = Math.floor(Math.random() * unmuted.length * 3) + 3
    const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));
    for (let i = 0; i < random_number; i++) {
        vibrate_person(
            unmuted[i % unmuted.length],
            Math.floor(i * (100 / random_number)),
            300
        );

        await wait(500); // 0,5 Sekunden warten
    }

    sound_person(unmuted[random_number % unmuted.length], 100, 600)
    await wait(500)
    shock_person(unmuted[random_number % unmuted.length], shock_percentage, duration)
}

function get_unmuted(collar_list) {
    return collar_list.filter(c => !c.mute);
}
//function shock_random(collars ,intensity = 10, duration = 300)

export { shock_all, shock_person, shock_random, vibrate_person, sound_person, shock_spinning_wheel, stop_all }
