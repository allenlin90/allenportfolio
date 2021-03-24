const endpoint = `https://makesend-driver.herokuapp.com`;
const requestHeader = `${endpoint}/header`;

const localHost = `http://localhost:8080`;
const localEndpoint = `${localHost}/header`;
const localLoginEndpoint = `${localHost}/login`;

export async function userLogin(email = '', password = '', rememberMe = false) {
    let headers = await fetchHeader();
    const response = await fetch(loginEndpoint, {
        method: 'post',
        headers: {
            'Content-type': 'application/json',
            'Client-Token': headers.clientToken,
            'Time-Stamp': headers.timeStamp,
            'Time-Signature': headers.timeSignature
        },
        body: JSON.stringify({
            email,
            password,
            keepAlive: (rememberMe ? 1 : 0)
        })
    })
        .then(res => res.json())
        .then(data => data)
        .catch(err => err);
    if (response.resCode === 200) {
        if (rememberMe) {
            localStorage.setItem('token', response.token);
        } else {
            sessionStorage.setItem('token', response.token);
        }
        return response.token;
    }
    return null;
}

export async function fetchHeader() {
    const state = {
        clientToken: '',
        timeStamp: '',
        timeSignature: ''
    }
    try {
        const response = await fetch(requestHeader, {
            method: 'post',
            mod: 'cors',
            header: {
                'Content-Type': 'application/json',
            }
        }).then(res => res.json()).then(data => data);
        state.clientToken = response['client-token'];
        state.timeStamp = response['time-stamp'];
        state.timeSignature = response['time-signature'];
        return state;
    } catch (err) {
        console.log(err);
        alert(err);
    }
}

export function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}