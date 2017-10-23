var mytags = document.querySelectorAll('.tag-x');

[].forEach.call(mytags, function(mytag) {
    mytag.addEventListener('click', function(e) {

        // Should event handler be removed on parent before delete?             
        this.parentElement.parentElement.removeChild(this.parentElement);

    }, false);
});

document.querySelector('.tag-input').addEventListener('keypress', function(ev) {
    const TABKEY = 9;

    let e = ev || window.event;

    if (e.keyCode == TABKEY) {
        // Don't allow blank entry.
        if (this.value.trim() == '') {
            e.preventDefault();
            this.focus();
            return false;
        }
        console.log(e.keyCode);

        e.preventDefault();
        insertTag(this.value);
        this.value = '';
        this.focus();
        return false;
    }
});

function insertTag(tag) {
    const temp = '<span class="tag">{{tag}}<a href="#" class="tag-x"><i class="fa fa-trash"></i></a></span>';

    ele = document.querySelector('.tag-input');

    let html = temp.replace('{{tag}}', tag);

    ele.insertAdjacentHTML('beforebegin', html);
}