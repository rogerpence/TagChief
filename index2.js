var rp = rp || {};

rp.tagchief = (function() {

    let INPUT_TAG_ID_FOR_SERVER = "test-input";

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

            if (isDuplicate(this.value.trim().toLowerCase())) {
                this.value = '';
                e.preventDefault();
                this.focus();
                return false;
            }

            insertTag(this.value.toLowerCase());
            this.value = '';
            e.preventDefault();
            this.focus();
            return false;
        }
    });

    var getTagsTextAsArray = () => {
        const tags = document.querySelectorAll('span[id^="tag-"]');
        const tagsList = [];

        let i = 0;

        for (i = 0; i < tags.length; i++) {
            const tag = tags[i];
            tagsList.push(tag.textContent.trim());
        };

        return tagsList
    };

    var refreshTagsList = () => {
        const tagsList = getTagsTextAsArray();

        document.getElementById(INPUT_TAG_ID_FOR_SERVER).value = tagsList.sort().join(',');
        let i = 1;
        tagsList.sort().forEach(function(element) {
            tagElement = document.getElementById('tag-' + element);
            tagElement.setAttribute('style', 'order:' + i);
            tagElement.setAttribute('tabindex', i + 100);
            i++;
        });
    };

    var isDuplicate = (tagText) => {
        const tagsList = getTagsTextAsArray();

        const isDupe = tagsList.includes(tagText);

        if (isDupe) {
            let dupedTag = document.getElementById('tag-' + tagText);
            dupedTag.classList.add('dupe-flash');
            window.setTimeout(function() {
                dupedTag.classList.remove('dupe-flash');
            }, 800);
        }

        return isDupe;
    };

    var removeTag = (e) => {
        let tagOwnerId = e.target.getAttribute('data-tag');
        let tagOwnerElement = document.getElementById(tagOwnerId);

        // Remove event listener.
        tagOwnerElement.removeEventListener('click', removeTag);

        // Remove tag element.
        tagOwnerElement.parentElement.removeChild(tagOwnerElement);

        refreshTagsList();
        // Put focus back into input tag. 
        document.querySelector('input.tag-text-input').focus();
    };

    var getTagHtml = (tag) => {
        const template = '<span style="order:1" id="tag-{{tag}}" class="tag">{{tag}}<a href="#" class="tag-x"><i data-tag="tag-{{tag}}" class="fa fa-trash"></i></a></span>';
        // @todo: hmmm. Why doesn't this work?
        // const template = '<span style="order:1" id="tag-{{tag}}" class="tag">{{tag}}<a href="#" class="tag-x"><span data-tag="tag-{{tag}}">x</span></a></span>';
        let html = template.replace(/{{tag}}/g, tag);

        return html;
    }

    var insertTag = (tag) => {
        //const template = '<span style="order:1" id="tag-{{tag}}" class="tag">{{tag}}<a href="#" class="tag-x"><i data-tag="tag-{{tag}}" class="fa fa-trash"></i></a></span>';
        // @todo: hmmm. Why doesn't this work?
        // const template = '<span style="order:1" id="tag-{{tag}}" class="tag">{{tag}}<a href="#" class="tag-x"><span data-tag="tag-{{tag}}">x</span></a></span>';
        let html = getTagHtml(tag);

        // Insert new tag html immediately before tag
        ele = document.querySelector('input.tag-text-input');
        ele.insertAdjacentHTML('beforebegin', html);

        // Assign remove tag action on tag click. 
        let mytag = document.getElementById('tag-' + tag);
        mytag.addEventListener('click', removeTag);

        refreshTagsList();
    };

    var insertInitialTags = (initialTags) => {
        initialTags.forEach(function(tag) {
            insertTag(tag);
        });
    };

    return {
        insertInitialTags: insertInitialTags
    };
}());

const initialTags = ['php', 'laravel'];
rp.tagchief.insertInitialTags(initialTags);