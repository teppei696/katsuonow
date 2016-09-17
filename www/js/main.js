// This is a JavaScript file
var map;
var users = [];
var now = {};
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

    console.log("===== ajax開始 records.json?app=9 =====");
    $.ajax({
        type: 'GET',
        url: 'https://oas7b.cybozu.com/k/v1/records.json?app=9',
        headers: {
            'X-Cybozu-API-Token': 'wfNWf2oJ0VyZCZCQ1GhgQ92SUO2XI5nc8M2aAzt7'
        },
        dataType: 'json',
        success: function(json) {
            console.log("===== ajax成功 records.json?app=9 =====");
            setUserData(json);
        },
        error : function(XMLHttpRequest, textStatus, errorThrown) {
            console.log("===== ajax失敗 records.json?app=9 =====");
            console.log("XMLHttpRequest : " + XMLHttpRequest.status);
            console.log("textStatus : " + textStatus);
            console.log("errorThrown : " + errorThrown.message);
        }
    });

}


//お気に入りユーザ情報をセット＋勝男なう情報を取得
function setUserData(json) {
    console.log("=====setUserData Start=====");
    var len = json.records.length;
    console.log(len);
    for(var i=0; i < len; i++){
        console.log("user_id: " + json.records[i].user_id.value);
        console.log("favorite_user_id: " + json.records[i].favorite_user_id.value);
        if (json.records[i].user_id.value == "1") {
            users.push(json.records[i].favorite_user_id.value);
        }
    }
    console.log(users);
    console.log("=====setUserData End=====");
    
    console.log("===== ajax開始 records.json?app=8 =====");
    $.ajax({
        type: 'GET',
        url: 'https://oas7b.cybozu.com/k/v1/records.json?app=8',
        headers: {
            'X-Cybozu-API-Token': 'MLXINEYPs48P433mwuU6RchN4Y79KiSSusAhmIoa'
        },
        dataType: 'json',
        success: function(json) {
            console.log("===== ajax成功 records.json?app=8 =====");
            dispNowData(json, users);
        },
        error : function(XMLHttpRequest, textStatus, errorThrown) {
            console.log("===== ajax失敗 records.json?app=8 =====");
            console.log("XMLHttpRequest : " + XMLHttpRequest.status);
            console.log("textStatus : " + textStatus);
            console.log("errorThrown : " + errorThrown.message);
        }
    });
    
}

// 取得したなう情報を元にデータを表示＋勝男情報を取得
function dispNowData(json, users) {
    console.log("=====dispNowData Start=====");
    var len = json.records.length;
    console.log(len);
    for(var i=0; i < len; i++){
        console.log("shop_id: " + json.records[i].shop_id.value);
        console.log("user_id: " + json.records[i].user_id.value);
        console.log("now: " + json.records[i].now.value);
        console.log("availability: " + json.records[i].availability.value);
        if (jQuery.inArray(json.records[i].user_id.value, users)) {
            now[json.records[i].shop_id.value] = json.records[i].availability.value;
        }
    }
    console.log(now);
    console.log("=====dispNowData End=====");
    
    console.log("===== ajax開始 records.json?app=7 =====");
    $.ajax({
        type: 'GET',
        url: 'https://oas7b.cybozu.com/k/v1/records.json?app=7',
        headers: {
            'X-Cybozu-API-Token': 'qBIp2mHcxFcqd5ln86JV8kQKivtYz9SbkhQn652J'
        },
        dataType: 'json',
        success: function(json) {
            console.log("===== ajax成功 records.json?app=7 =====");
            setShopData(json, now);
        },
        error : function(XMLHttpRequest, textStatus, errorThrown) {
            console.log("===== ajax失敗 records.json?app=7 =====");
            console.log("XMLHttpRequest : " + XMLHttpRequest.status);
            console.log("textStatus : " + textStatus);
            console.log("errorThrown : " + errorThrown.message);
        }
    });
}

// お店情報をセット
function setShopData(json,now) {
    console.log("=====setShopData Start=====");
    var len = json.records.length;
    console.log(len);
    for(var i=0; i < len; i++){
        console.log("shop_id: " + json.records[i].shop_id.value);
        console.log("shop_name: " + json.records[i].shop_name.value);
        console.log("longitude: " + json.records[i].longitude.value);
        console.log("latitude: " + json.records[i].latitude.value);

        var isOpen = false;
        //マッピング
        var strContent = "<span>" + json.records[i].shop_name.value + "</span>";
        if (now[json.records[i].shop_id.value]) {
            console.log("空き有り shop_id: " + json.records[i].shop_id.value);
            strContent = strContent + "<br><h5>" + now[json.records[i].shop_id.value] + "人分席が空いてるよ</h5>";
            isOpen = true;
        }
        console.log("strContent: " + strContent);
        var myLatlng = new google.maps.LatLng(json.records[i].latitude.value, json.records[i].longitude.value);
        markToMap(json.records[i].shop_name.value, myLatlng, map, strContent, isOpen);
    }
    console.log("=====setShopData End=====");
}


function markToMap(name, position, map, strContent, open){
    var marker = new google.maps.Marker({
        position: position,
        title:name
    });
    marker.setMap(map);
    var infoWindow = new google.maps.InfoWindow({
        content: strContent
    });
    google.maps.event.addListener(marker, 'click', function() {
        infoWindow.open(map, marker);
    });
    if (open) {
        infoWindow.open(map, marker);
    }
}

