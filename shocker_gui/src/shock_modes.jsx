import { control_collar } from "./Api_calls/Api_calls";
import { Collarmodes } from "./utils/collar_modes.js";

/**
 * Einzelaktionen auf eine Person
 */
function shock_person(collar, shock_percentage, duration = 300) {
    if (collar.active) {
        const intensity = Math.floor((shock_percentage / 100) * collar.max_shock);
        console.log(`Shocking ${collar.name} with intensity ${intensity}`);
        control_collar(collar.id, Collarmodes.SHOCK, intensity, duration);
    }
}

function stop_person(collar) {
    if (collar.active) {
        console.log(`Stopping ${collar.name}`);
        control_collar(collar.id, Collarmodes.STOP, 100, 300);
    }
}

function vibrate_person(collar, intensity, duration = 300) {
    if (collar.active) {
        console.log(`Vibrating ${collar.name} with intensity ${intensity}`);
        control_collar(collar.id, Collarmodes.VIBRATE, intensity, duration);
    }
}

function sound_person(collar, intensity, duration = 300) {
    if (collar.active) {
        console.log(`Sound for ${collar.name} with intensity ${intensity}`);
        control_collar(collar.id, Collarmodes.SOUND, intensity, duration);
    }
}

/**
 * Gruppenaktionen
 */
function shock_all(collar_list, shock_percentage, duration = 300) {
    collar_list.forEach((c) => shock_person(c, shock_percentage, duration));
}

function shock_random(collar_list, shock_percentage, duration) {
    const unmuted = get_unmuted_active(collar_list);
    if (unmuted.length === 0) return;
    const random_index = Math.floor(Math.random() * unmuted.length);
    shock_person(unmuted[random_index], shock_percentage, duration);
}

function stop_all(collar_list) {
    collar_list.forEach(stop_person);
}

async function shock_spinning_wheel(collar_list, shock_percentage, duration) {
    const unmuted = get_unmuted_active(collar_list);
    if (unmuted.length === 0) return;

    const random_number = Math.floor(Math.random() * unmuted.length * 3) + 3;
    const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

    for (let i = 0; i < random_number; i++) {
        vibrate_person(
            unmuted[i % unmuted.length],
            Math.floor((i * 100) / random_number),
            300
        );
        await wait(500);
    }

    const winner = unmuted[random_number % unmuted.length];
    sound_person(winner, 100, 600);
    await wait(500);
    shock_person(winner, shock_percentage, duration);
}

/**
 * Hilfsfunktion: filtert nur aktive Personen
 */
function get_unmuted_active(collar_list) {
    return collar_list.filter((c) => c.active);
}

export {
    shock_all,
    shock_person,
    shock_random,
    vibrate_person,
    sound_person,
    shock_spinning_wheel,
    stop_all
};
