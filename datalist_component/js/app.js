window.onload = function () {
    const listInput = document.querySelector('.postcode_list input');
    listInput.onchange = function (event) {
        const inputValue = event.target.value;
        if (inputValue) {
            const areas = event.target.value.split(',');
            const selectedPostcode = document.querySelector(`div[data-name="postcode"]`);
            const selectedsubdistrict = document.querySelector(`div[data-name="sub_district"]`);
            const selectedDistrict = document.querySelector(`div[data-name="district"]`);
            if (areas.length === 3) {
                const postcode = areas[0].trim();
                const subDistrict = areas[1].trim();
                const district = areas[2].trim();
                selectedPostcode.innerText = postcode;
                selectedsubdistrict.innerText = subDistrict;
                selectedDistrict.innerText = district;
            } else {
                selectedPostcode.innerText = `-`;
                selectedsubdistrict.innerText = `-`;
                selectedDistrict.innerText = `-`;
            }
        }
    }
}