document.querySelector('input.tag-text-input').addEventListener('keydown', function(ev) {
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
    const REMOVE_HANDLER_AFTER_FIRST_USE = true;
    const template = '<span id="span-{{tag}}" class="tag">{{tag}}<a href="#" class="tag-x"><i data-tag="span-{{tag}}" class="fa fa-trash"></i></a></span>';   
    let html = template.replace(/{{tag}}/g, tag);

    // Insert new tag html immediately before tag
    ele = document.querySelector('input.tag-text-input');    
    ele.insertAdjacentHTML('beforebegin', html);

    // Assign delete tag action on tag click. 
    let mytag = document.getElementById('span-' + tag);
    mytag.addEventListener('click', 
        function(e) {
            var tagOwnerId = e.target.getAttribute('data-tag');
            var tagOwnerElement = document.getElementById(tagOwnerId);            
            // Remove tag. Its click event handler is removed automatically.
            tagOwnerElement.parentElement.removeChild(tagOwnerElement);       
            // Put focus back into input tag. 
            document.querySelector('input.tag-text-input').focus();
        },
        {'once': REMOVE_HANDLER_AFTER_FIRST_USE}
    );
}    

function insertInitialTags(initialTags) {
    initialTags.forEach(function(tag) {
        insertTag(tag);
    });
};

const initialTags = ['php', 'laravel'];
insertInitialTags(initialTags);