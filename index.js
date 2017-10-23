var mytags = document.querySelectorAll('.tag-x');

[].forEach.call(mytags, function(mytag) {

    mytag.addEventListener('click', function(e) {
        this.parentElement.parentElement.removeChild(this.parentElement); 
    }, false);

});