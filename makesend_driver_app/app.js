const state = {
    clientToken: '',
    timeStamp: '',
    timeSignature: ''
}

export async function requestOTP() {
    await fetchHeader();
    console.log(state);
    const endpoint = `https://api.airportels.ninja/api/msd/password/recover/requestOTP`;
    const response = await fetch(endpoint, {
        method: 'post',
        mod: 'cors',
        headers: {
            'Content-Type': 'application/json',
            'Client-Token': state.clientToken,
            'Time-Stamp': state.timeStamp,
            'Time-Signature': state.timeSignature
        },
        body: JSON.stringify({
            phone: `+66892666362`
        })
    }).then(res => res.json()).then(data => data).catch(err => err);
    console.log(response);
}

export async function fetchHeader() {
    const endpoint = `http://localhost:8080/header`;
    const response = await fetch(endpoint, {
        method: 'post',
        mod: 'cors',
        header: {
            'Content-Type': 'application/json',
        }
    }).then(res => res.json()).then(data => data).catch(err => err);
    state.clientToken = response['Client-Token'];
    state.timeStamp = response['Time-Stamp'];
    state.timeSignature = response['Time-Signature'];
}