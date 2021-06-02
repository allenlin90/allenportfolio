window.addEventListener('load', function () {
    [...document.querySelector('nav').children].forEach(child => {
        child.addEventListener('click', function (e) {
            e.stopPropagation();
            switchPanel(this);
            selectDefault(child.dataset.value);
        });
    });
})