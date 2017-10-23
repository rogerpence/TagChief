var mytags = document.querySelectorAll('.tag-x');

[].forEach.call(mytags, function(mytag) {

    mytag.addEventListener('click', function(e) {
        console.log('clicked');
        console.log(this.parentElement.innerHTML);

        this.parentElement.removeChild(this);
    }, false);

});