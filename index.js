var refreshTagsList = () => {
    const tags = document.querySelectorAll('span[id^="tag-"]');
    const tagsList = [];

    let i = 0;

    for (i = 0; i < tags.length; i++) {
        const tag = tags[i];
        tagsList.push(tag.textContent.trim());
    };

    document.getElementById('test-input').value = tagsList.sort().join(',');
    i = 1;
    tagsList.sort().forEach(function(element) {
        tagElement = document.getElementById('tag-' + element);
        tagElement.setAttribute('style', 'order:' + i++);
    });
};

var isDuplicate = function(tagText) {
    const tags = document.querySelectorAll('span[id^="tag-"]');
    const tagsList = [];

    let i = 0;

    for (i = 0; i < tags.length; i++) {
        const tag = tags[i];
        tagsList.push(tag.textContent.trim());
    };

    return tagsList.includes(tagText);
}


document.querySelector('#test-button').addEventListener('click', function(ev) {
    refreshTagsList();
});

document.querySelector('input.tag-text-input').addEventListener('keydown', function(ev) {
    const BACKSPACEKEY = 8;
    const TABKEY = 9;
    const ENTERKEY = 13;
    const ESCAPEKEY = 27;

    let e = ev || window.event;

    // Half-assed attempt to delete last tag with backspace key. 
    // if (e.keyCode==BACKSPACEKEY) {
    //     var j = document.querySelector('input.tag-text-input').previousElementSibling;    
    //     if (j !== null) {
    //         j.previousElementSibling.click();
    //     }        

    //     e.preventDefault();
    //     this.focus();
    //     return false;
    // }

    if (e.keyCode == ESCAPEKEY) {
        this.value = '';
        e.preventDefault();
        this.focus();
        return false;
    } else if (e.keyCode == TABKEY || e.keyCode == ENTERKEY) {
        if (this.value.trim() == '') {
            e.preventDefault();
            this.focus();
            return false;
        }

        if (isDuplicate(this.value.trim())) {
            this.value = '';
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
    const template = '<span style="order:1" id="tag-{{tag}}" class="tag">{{tag}}<a href="#" class="tag-x"><i data-tag="tag-{{tag}}" class="fa fa-trash"></i></a></span>';
    //const template = '<span style="order:1" id="tag-{{tag}}" class="tag">{{tag}}<a href="#" class="tag-x"><span data-tag="tag-{{tag}}">x</span></a></span>';
    let html = template.replace(/{{tag}}/g, tag);

    // Insert new tag html immediately before tag
    ele = document.querySelector('input.tag-text-input');
    ele.insertAdjacentHTML('beforebegin', html);

    refreshTagsList();

    // Assign delete tag action on tag click. 
    let mytag = document.getElementById('tag-' + tag);
    mytag.addEventListener('click',
        function(e) {
            var tagOwnerId = e.target.getAttribute('data-tag');
            var tagOwnerElement = document.getElementById(tagOwnerId);
            // Remove tag. Its click event handler is removed automatically.
            tagOwnerElement.parentElement.removeChild(tagOwnerElement);
            refreshTagsList();
            // Put focus back into input tag. 
            document.querySelector('input.tag-text-input').focus();
        }, { 'once': REMOVE_HANDLER_AFTER_FIRST_USE }
    );
}

function insertInitialTags(initialTags) {
    initialTags.forEach(function(tag) {
        insertTag(tag);
    });
};

const initialTags = ['php', 'laravel'];
insertInitialTags(initialTags);