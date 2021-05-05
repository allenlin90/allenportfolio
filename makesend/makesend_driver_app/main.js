const requestOTPEndpoint = `https://api.airportels.ninja/api/msd/password/recover/requestOTP`;
const verifyOTPEndpoint = `https://api.airportels.ninja/api/msd/user/password/recover/verifyOTP`;
const changePasswordEndpoint = `https://api.airportels.ninja/api/msd/user/password/recover`;
const endpoint = `http://localhost:8080/header`;
const loginEndpoint = `http://localhost:8080/login`;
// const endpoint = `https://makesend-driver.herokuapp.com/header`;

export async function changePassword(otp = '', ref = '', password = '', confirmPassword = '') {
    const state = await fetchHeader();
    if (password) {
        const response = await fetch(changePasswordEndpoint, {
            method: 'post',
            mod: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Client-Token': state.clientToken,
                'Time-Stamp': state.timeStamp,
                'Time-Signature': state.timeSignature
            },
            body: JSON.stringify({
                otp,
                ref,
                password,
                confirmPassword
            })
        }).then(res => res.json()).then(data => data).catch(err => err);
        return response;
    }
    return null;
}

export async function verifyOTP(otp = '', ref = '') {
    const state = await fetchHeader();
    if (otp && ref) {
        const response = await fetch(verifyOTPEndpoint, {
            method: 'post',
            mod: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Client-Token': state.clientToken,
                'Time-Stamp': state.timeStamp,
                'Time-Signature': state.timeSignature
            },
            body: JSON.stringify({
                otp,
                ref
            })
        }).then(res => res.json()).then(data => data).catch(err => err);
        return response;
    }
    return null;
}

export async function requestOTP(phone = '') {
    const state = await fetchHeader();
    const number = /[06](\d{9})/g.exec(phone);
    if (number) {
        const response = await fetch(requestOTPEndpoint, {
            method: 'post',
            mod: 'cors',
            headers: {
                'Content-Type': 'application/json',
                'Client-Token': state.clientToken,
                'Time-Stamp': state.timeStamp,
                'Time-Signature': state.timeSignature
            },
            body: JSON.stringify({
                phone: `+66${number[1]}`
            })
        }).then(res => res.json()).then(data => data).catch(err => err);
        return response;
    }
    return null;
}

export async function fetchHeader() {
    const state = {
        clientToken: '',
        timeStamp: '',
        timeSignature: ''
    }
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
    return state;
}

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

export function getParameterByName(name, url = window.location.href) {
    name = name.replace(/[\[\]]/g, '\\$&');
    const regex = new RegExp('[?&]' + name + '(=([^&#]*)|&|#|$)'),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, ' '));
}