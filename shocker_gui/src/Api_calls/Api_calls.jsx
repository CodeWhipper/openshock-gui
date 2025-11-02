import { getTestingMode } from "../utils/testing_mode.js";
import { socket } from "../socket";

const openShockApiKey = import.meta.env.VITE_OPEN_SHOCK_API_KEY

function make_api_call(Url, Body) {
    const options = {
        headers: {
            'OpenShockToken': openShockApiKey,
            'Content-Type': 'application/json'
        },
        method: Body ? 'POST' : 'GET'
    };
    if (Body) {
        options.body = JSON.stringify(Body);
    }
    return fetch(Url, options)
        .then(res => {
            if (!res.ok) {
                return Promise.reject('HTTP error ' + res.status);
            }
            return res.json();
        });
}

async function get_hub_id() {
    if (getTestingMode()) {
        console.log("🧪 [TEST MODE] get_hub_id() - would fetch hub ID from API");
        // Return a dummy hub ID for testing
        return "test-hub-id";
    }
    let hub_id = await make_api_call('https://api.openshock.app/1/devices', null)
    hub_id = hub_id.data[0].id
    return hub_id
}


async function get_shockers() {
    if (getTestingMode()) {
        console.log("🧪 [TEST MODE] get_shockers() - would fetch shockers from API");
        // Return empty array - collars are managed by server in test mode
        return Promise.resolve([]);
    }
    const hub_id = await get_hub_id()
    const url = 'https://api.openshock.app/1/devices/' + hub_id + '/shockers'
    const respose = await make_api_call(url, null)
    const shockers = respose.data
    return shockers;
    
}

async function control_collar(shocker_id, type, intensity, duration) {
    if (getTestingMode()) {
        console.log(`🧪 [TEST MODE] control_collar() - Collar: ${shocker_id}, Type: ${type}, Intensity: ${intensity}, Duration: ${duration}ms`);
        // Emit to server for logging
        socket.emit("collarControl", { collarId: shocker_id, type, intensity, duration });
        // Return immediately without making API call
        return Promise.resolve();
    }
    const body = [
        {
            id: shocker_id,
            type: type,
            intensity: intensity,
            duration: duration,
            exclusive: true
        }

    ]
    await make_api_call('https://api.openshock.app/1/shockers/control', body)
}

export { get_shockers, control_collar, get_hub_id}