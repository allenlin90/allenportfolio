const podOptions = document.querySelector('#pod_options');
const podMedia = document.querySelector('#pod_media');
// switch between signature and photo upload
[...podOptions.children].forEach((child) => {
    child.addEventListener('click', function (e) {
        e.stopPropagation();
        switchPanel(this); // this is from navigation.js
        [...podMedia.children].forEach(childNode => {
            if (childNode.id !== `${this.id.split('_')[0]}_upload`) {
                childNode.style.display = 'none';
            } else {
                childNode.style.display = 'grid';
            }
        });
    });
});

// section for signature pad

// section for multiple photo upload
let upload = new FileUploadWithPreview("myUniqueUploadId");
const photoUploadBtn = document.querySelector('#photo_upload_btn');
photoUploadBtn.addEventListener('click', function () { // upload for ajax later when backend is ready
    console.log(upload.cachedFileArray);
});