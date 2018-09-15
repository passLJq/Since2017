$(function () {


var count = 0;
var timer = null;
autoMove()
function autoMove() {
    timer = setInterval(function () {
        move();
        slider()
    },2000);
}
function move(){
    count++;
    if(count===$("#slide li").length){
        count=0;
    }
    $("#slide li").eq(count).children("a").fadeIn();
    $("#slide li").eq(count).siblings("li").children("a").fadeOut();
}
$("#slide").on("mouseenter",function () { clearInterval(timer) });
$("#slide").on("mouseleave",function () { autoMove() });
//点击左右按键轮播
$("#left").click(function () {
    count--;
    if(count<0){
        count = $("#slide li").length-1;
    }
    $("#slide li").eq(count).children("a").fadeIn();
    $("#slide li").eq(count).siblings("li").children("a").fadeOut();
    slider()
});
$("#right").click(function () { move();slider() });
$("#slide span").mouseenter(function () {
    $(this).css("opacity",0.8);
});
$("#slide span").mouseleave(function () {
    $(this).css("opacity",0.4);
});
//防止点击左右按键时选择文字
$("#slide").mousemove(function () {
    window.getSelection?window.getSelection().removeAllRanges():document.selection.empty();
});
//小图标点亮
(function () {
    for(var i=0;i<$("#slide li").length;i++){
        $("#slider").append($("<i></i>"));
        $("#slide i").css("cursor","pointer");
        $("#slide i").eq(count).addClass("active").siblings("i").removeClass("active");
    }
    $("#slider i").mouseenter(function () {
        count=$(this).index()-1;
        move();
        slider()
    })
}());
function slider(){
    $("#slider i").eq(count).addClass("active").siblings("i").removeClass("active");
}

})