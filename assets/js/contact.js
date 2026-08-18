$(function () {

    $(".contact-form").on("submit", function (e) {

        e.preventDefault();

        alert("문의가 완료되었습니다");

        this.reset();

    });

});