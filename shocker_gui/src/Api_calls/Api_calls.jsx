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
    let hub_id = await make_api_call('https://api.openshock.app/1/devices', null)
    hub_id = hub_id.data[0].id
    return hub_id
}


async function get_shockers() {
    const hub_id = await get_hub_id()
    const url = 'https://api.openshock.app/1/devices/' + hub_id + '/shockers'
    const respose = await make_api_call(url, null)
    const shockers = respose.data
    return shockers;
    
}

async function control_collar(shocker_id, type, intensity, duration) {
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