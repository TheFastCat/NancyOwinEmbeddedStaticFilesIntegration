$(document).ready(function(){
    $("#switcher").themeswitcher({
            imgpath: "images/",
            loadTheme: "cupertino"
    });
    
    // Sample UI widgets
    $( "#progressbar" ).progressbar({
                value: 37
        });
        $( "#slider" ).slider();
});