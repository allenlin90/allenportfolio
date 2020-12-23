window.onload = function () {
    setTimeout(function () {
        document.querySelector('.spinner').style.display = 'none';
        setTimeout(function () {
            // document.querySelector('.order_details').style.cssText = `display: flex; justify-content: space-between;`;
            document.querySelector('.delivery').style.cssText = `display: block`;
        }, 500);
    }, 2000);
}