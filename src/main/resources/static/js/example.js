$(document).ready(function () {
    $('.table .eBtn').on('click',function (event) {
        event.preventDefault();
        var href = $(this).attr('href');

        $.get(href,function (user,status) {
            $('.myForm #id').val(user.id);
            $('.myForm #name').val(user.name);
            $('.myForm #lastname').val(user.lastname);
            $('.myForm #age').val(user.age);
            $('.myForm #username').val(user.username);
            $('.myForm #role').val(user.role);
        });

        $('.myForm #exampleModel').modal();
    });
});