var mytags = document.querySelectorAll('.tag-x');

function removeTag(ele) {
    ele.removeEventListener('click', () => { removeTag(mytag); });
    //ele.parentElement.parentElement.removeChild(ele.parentElement);
}

[].forEach.call(mytags, function(mytag) {
    mytag.addEventListener('click', () => { removeTag(mytag); }, false);
});

document.querySelector('.tag-input').addEventListener('keydown', function(ev) {
    const TABKEY = 9;

    let e = ev || window.event;

    if (e.keyCode == TABKEY) {
        if (this.value.trim() == '') {
            e.preventDefault();
            this.focus();
            return false;
        }

        e.preventDefault();
        insertTag(this.value);
        this.value = '';
        this.focus();
        return false;
    }
});

function insertTag(tag) {
    const temp = '<span class="tag">{{tag}}<a data-tag="{{tag}}" href="#" class="tag-x"><i class="fa fa-trash"></i></a></span>';

    ele = document.querySelector('.tag-input');

    let html = temp.replace(/{{tag}}/g, tag);
    ele.insertAdjacentHTML('beforebegin', html);

    let mytag = document.querySelector('a[data-tag="' + tag + '"');
    mytag.addEventListener('click', () => { removeTag(mytag); }, false);
}

function insertInitialTags(initialTags) {
    initialTags.forEach(function(tag) {
        insertTag(tag);
    });
};

const initialTags = ['php', 'laravel'];
insertInitialTags(initialTags);