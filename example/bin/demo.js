$(document).ready(function(){
$("#scrap").on("click",function(){
$("#scrapped").text($("#text").val());
$("#scrapped").show();
$("#scrapped").textscrapper({
maxLength:50
});
});

$("#text").val("Lorem ipsum dolor sit amet, consectetuer adipiscing elit. Aenean commodo ligula eget dolor.");
$("#scrap").click();
});