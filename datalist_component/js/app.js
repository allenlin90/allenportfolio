window.onload = function () {
    const listInput = document.querySelector('.postcode_list input');
    listInput.onchange = function (event) {
        const inputValue = event.target.value;
        if (inputValue) {
            const areas = event.target.value.split(',');
            const selectedPostcode = document.querySelector(`div[data-name="postcode"]`);
            const selectedsubdistrict = document.querySelector(`div[data-name="sub_district"]`);
            const selectedDistrict = document.querySelector(`div[data-name="district"]`);
            const selectedProvince = document.querySelector(`div[data-name="province"]`);
            if (areas.length === 4) {
                const postcode = areas[3].trim();
                const subDistrict = areas[0].trim();
                const district = areas[1].trim();
                const province = areas[2].trim();
                selectedPostcode.innerText = postcode;
                selectedsubdistrict.innerText = subDistrict;
                selectedDistrict.innerText = district;
                selectedProvince.innerText = province;
            } else {
                selectedPostcode.innerText = `-`;
                selectedsubdistrict.innerText = `-`;
                selectedDistrict.innerText = `-`;
                selectedProvince.innerText = `-`;
            }
        }
    }

    const removeInputBtn = document.querySelector('.input_container--remove');
    removeInputBtn.onclick = function () {
        listInput.value = '';
        const selectedPostcode = document.querySelector(`div[data-name="postcode"]`);
        const selectedsubdistrict = document.querySelector(`div[data-name="sub_district"]`);
        const selectedDistrict = document.querySelector(`div[data-name="district"]`);
        const selectedProvince = document.querySelector(`div[data-name="province"]`);
        selectedPostcode.innerText = `-`;
        selectedsubdistrict.innerText = `-`;
        selectedDistrict.innerText = `-`;
        selectedProvince.innerText = `-`;
    }
}