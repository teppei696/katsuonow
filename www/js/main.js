// This is a JavaScript file
var map;
function onLoad() {
    document.addEventListener("deviceready", initialize, false);
}

function initialize() {
    map = null;
    var mapOptions = {
        center: new google.maps.LatLng(34.7055613, 135.4939923),    //地図上で表示させる緯度経度
        zoom: 16,                                                 //地図の倍率
        disableDefaultUI : 'disable',
        disableDoubleClickZoom : 'disable',
        mapTypeId: google.maps.MapTypeId.ROADMAP                  //地図の種類
    };
    map = new google.maps.Map(document.getElementById("map_canvas"), mapOptions);

    //マッピング
    var myLatlng;
    var infoWindow;
    // 勝男 梅田店
    myLatlng = new google.maps.LatLng(34.7067564, 135.4956247);
    infowindow = new google.maps.InfoWindow({
        content: "<h4>19:30から2人</h4><br>"
    });
    markToMap("勝男 梅田店", myLatlng, map, infoWindow);
}

function markToMap(name, position, map, infoWindow){
    var marker = new google.maps.Marker({
        position: position,
        title:name
    });
    marker.setMap(map);
    google.maps.event.addListener(marker, 'click', function() {
        infowindow.open(map, marker);
    });
}

