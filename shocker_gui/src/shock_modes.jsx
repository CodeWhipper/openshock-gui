import { control_collar } from "./Api_calls/Api_calls";
import { Collarmodes } from "./utils/collar_modes.js";

/**
 * Helper: only returns active collars
 */
const getActiveCollars = (collarList) => collarList.filter((c) => c.active);

/**
 * === Einzelaktionen auf eine Person ===
 */
function shock_person(collar, shock_percentage, duration = 300) {
  if (!collar.active) return;

  const intensity = Math.floor((shock_percentage / 100) * collar.max_shock);
  console.log(`Shocking ${collar.name} with intensity ${intensity}`);
  control_collar(collar.id, Collarmodes.SHOCK, intensity, duration);
}

function stop_person(collar) {
  if (!collar.active) return;

  console.log(`Stopping ${collar.name}`);
  control_collar(collar.id, Collarmodes.STOP, 100, 300);
}

function vibrate_person(collar, intensity, duration = 300) {
  if (!collar.active) return;

  console.log(`Vibrating ${collar.name} with intensity ${intensity}`);
  control_collar(collar.id, Collarmodes.VIBRATE, intensity, duration);
}

function sound_person(collar, intensity, duration = 300) {
  if (!collar.active) return;

  console.log(`Sound for ${collar.name} with intensity ${intensity}`);
  control_collar(collar.id, Collarmodes.SOUND, intensity, duration);
}

/**
 * === Gruppenaktionen ===
 */
function shock_all(collarList, shock_percentage, duration = 300) {
  collarList.forEach((c) => shock_person(c, shock_percentage, duration));
}

function shock_random(collarList, shock_percentage, duration = 300) {
  const activeCollars = getActiveCollars(collarList);
  if (activeCollars.length === 0) return;

  const randomIndex = Math.floor(Math.random() * activeCollars.length);
  shock_person(activeCollars[randomIndex], shock_percentage, duration);
}

function stop_all(collarList) {
  collarList.forEach(stop_person);
}

async function shock_spinning_wheel(collarList, shock_percentage, duration = 300) {
  const activeCollars = getActiveCollars(collarList);
  if (activeCollars.length === 0) return;

  const spins = Math.floor(Math.random() * activeCollars.length * 3) + 3;
  const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  for (let i = 0; i < spins; i++) {
    const collar = activeCollars[i % activeCollars.length];
    const intensity = Math.floor((i * 100) / spins);
    vibrate_person(collar, intensity, 300);
    await wait(500);
  }

  const winner = activeCollars[spins % activeCollars.length];
  sound_person(winner, 100, 600);
  await wait(500);
  shock_person(winner, shock_percentage, duration);
}

export {
  shock_person,
  stop_person,
  vibrate_person,
  sound_person,
  shock_all,
  shock_random,
  shock_spinning_wheel,
  stop_all,
};
