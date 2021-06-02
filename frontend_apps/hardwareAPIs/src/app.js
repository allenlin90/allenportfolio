function switchPanel(node) {
    node.classList.add('btn-warning');
    node.classList.remove('btn-secondary');
    [...node.parentNode.children].forEach(child => {
        if (node !== child) {
            child.classList.add('btn-secondary');
            child.classList.remove('btn-warning');
        }
    });
}

function selectDefault(option) {
    const container = document.querySelector('.container');
    switchPanel(document.querySelector(`#${option}_nav`));
    [...container.children].forEach(child => {
        if (child.id === option) {
            child.style.display = 'block';
        } else {
            child.style.display = 'none';
        }
    })
}