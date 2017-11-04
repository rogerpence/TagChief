var rp = rp || {};

rp.tagchief = (function() {
    const TAG_TEMPLATE_EDIT = '<span style="order:1" id="tag-{{tag}}" class="tag">{{tag}}<a href="#" class="tag-x"><i data-tag="tag-{{tag}}" class="fa fa-trash"></i></a></span>';
    const TAG_TEMPLATE_READONLY = '<span class="tag">{{tag}}</span>';
    // The following values are set (or changed) with setOptions().
    let onTagRemoved = undefined;
    let onTagAdded = undefined;
    let inputTagIdForServer = "tag-list-for-server";
    let tagTextInputId = 'tag-text-input';

    document.getElementById(tagTextInputId).addEventListener('keydown', function(ev) {
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

        } else if (e.keyCode == ENTERKEY) {
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

            addTag(this.value.toLowerCase());
            this.value = '';
            e.preventDefault();
            this.focus();
            return false;
        }
    });

    var getTagsTextAsArray = () => {
        const tags = document.querySelectorAll('span[id^="tag-"]');
        const tagsList = [];

        for (let i = 0; i < tags.length; i++) {
            const tag = tags[i];
            tagsList.push(tag.textContent.trim());
        };

        return tagsList
    };

    var refreshTagsList = () => {
        const tagsList = getTagsTextAsArray();

        document.getElementById(inputTagIdForServer).value = tagsList.sort().join(',');
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

        let tag = tagOwnerElement.textContent;

        // Remove event listener.
        tagOwnerElement.removeEventListener('click', removeTag);

        // Remove tag element.
        tagOwnerElement.parentElement.removeChild(tagOwnerElement);

        refreshTagsList();
        // Put focus back into input tag. 
        document.getElementById(tagTextInputId).focus();

        if (typeof onTagRemoved == 'function') {
            onTagRemoved(tag);
        }
    };

    var getTagHtml = (tag, template) => {
        let html = template.replace(/{{tag}}/g, tag);

        return html;
    }

    var addTag = (tag) => {
        let html = getTagHtml(tag, TAG_TEMPLATE_EDIT);

        // Insert new tag html immediately before input tag
        ele = document.getElementById(tagTextInputId);
        ele.insertAdjacentHTML('beforebegin', html);

        // Assign remove tag action on tag click. 
        let mytag = document.getElementById('tag-' + tag);
        mytag.addEventListener('click', removeTag);

        refreshTagsList();

        if (typeof onTagAdded == 'function') {
            onTagAdded(tag);
        }
    };

    var addTagsForReadOnly = (targetId, initialTags) => {
        let allTagsHtml = [];

        initialTags.sort().forEach(function(tag) {
            let html = getTagHtml(tag, TAG_TEMPLATE_READONLY);
            allTagsHtml.push(html)
        });

        let target = document.getElementById(targetId);
        target.insertAdjacentHTML('beforebegin', allTagsHtml.join(''));
    };

    var addInitialTags = (initialTags) => {
        initialTags.forEach(function(tag) {
            addTag(tag);
        });
    };

    var setOptions = (options) => {
        if (options.hasOwnProperty('editableTags')) {
            tagTextInputId = options.editableTags.tagTextInputId;
            inputTagIdForServer = options.editableTags.inputTagIdForServer;
            addInitialTags(options.editableTags.initialTags);
            // Note that onTagAdded doesn't fire for tags added with 
            // addInitialTags() method.
            onTagRemoved = options.editableTags.onTagRemovedHandler;
            onTagAdded = options.editableTags.onTagAddedHandler;
        }
        if (options.hasOwnProperty('outputTags')) {
            addTagsForReadOnly(options.outputTags.containerId, options.outputTags.tags);
        }
    };

    return {
        addTagsForReadOnly: addTagsForReadOnly,
        setOptions: setOptions
    };
}());


let options = {
    // Other options to consider:
    //   - mixedCaseTags
    //   - allowDuplicateTags

    // All of the editableTags properties are optional.

    // Spell your keys correctly! An incorrect spelling won't cause an error.     
    editableTags: {
        tagTextInputId: 'tag-text-input', // default is 'tag-text-input'
        inputTagIdForServer: 'tag-list-for-server', // default is 'tag-list-for-server'
        initialTags: [],
        onTagAddedHandler: (tag) => {
            // Add code here to be performed when a tag is added.
            // The tag added is passed as the single argument to this event handler.
            console.log('added: ' + tag);
        },
        onTagRemovedHandler: (tag) => {
            // Add code here to be performed when a tag is removed.
            // The tag removed is passed as the single argument to this event handler.
            console.log('removed: ' + tag);
        }
    },

    // If the outputTags key is provided, it must 
    // provide both the 'tags' key and the 'containerId' key.
    // This set of keys is only required if you're going to call 'addTagsForReadOnly'
    // outputTags: {
    //     tags: ['php', 'laravel', 'eloquent', 'db', 'mysql'],
    //     containerId: 'tag-output-container'
    // }
};

rp.tagchief.setOptions(options);