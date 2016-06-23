$(function(){
    $("#logo").click(function (e) {
        e.preventDefault();
        $('html,body').animate({ scrollTop: $("#landing").offset().top }, 500);
    });
    $("#aboutLink").click(function (e) {
        e.preventDefault();
        $('html,body').animate({ scrollTop: $("#about").offset().top }, 500);
    });
    $("#galleryLink").click(function (e) {
        e.preventDefault();
        $('html,body').animate({ scrollTop: $("#gallery").offset().top }, 500);
    });
    $("#contactLink").click(function (e) {
        e.preventDefault();
        $('html,body').animate({ scrollTop: $("#contact").offset().top }, 500);
    });
    
    $(window).resize(function(){
        //if($(window).)
    });
});
