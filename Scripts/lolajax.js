function GetSummonerId(name, callback) {
    $.ajax({
        type: "GET",
        url: "https://euw.api.pvp.net/api/lol/euw/v1.4/summoner/by-name/" + name + "?api_key=cf2f4773-debd-499b-b4c8-daf1634f7fa1",
        dataType: "json",
        success: function (result) {
            callback(result[name]);
        }				
    });
}

function GetSummonerMatches(summonerId, callback) {
    var matchIds = [];
    $.ajax({
        type: "GET",
        url: "https://euw.api.pvp.net/api/lol/euw/v2.2/matchlist/by-summoner/" + summonerId + "?beginIndex=0&endIndex=25&api_key=cf2f4773-debd-499b-b4c8-daf1634f7fa1",
        dataType: "json",
        crossDomain: true,
        success: function (result) {
            $.each(result.matches, function (key) {
                matchIds.push(this.matchId);
            });
            callback(matchIds);
        }
    });
}

function GetChampion(championId, callback) {
    $.ajax({
        type: "GET",
        url: "https://global.api.pvp.net/api/lol/static-data/euw/v1.2/champion/" + championId + "?api_key=cf2f4773-debd-499b-b4c8-daf1634f7fa1",
        dataType: "json",
        success: function (result) {
            callback(result);
        }
    });
}

function GetMatchData(matchId, callback) {
    $.ajax({
        type: "GET",
        url: "https://euw.api.pvp.net/api/lol/euw/v2.2/match/" + matchId + "?includeTimeline=true&api_key=cf2f4773-debd-499b-b4c8-daf1634f7fa1",
        dataType: "json",
        crossDomain: true,
        statusCode: {
            429: function (jqxhr, status, errorThrown) {
                console.log("ISSUE");
                console.log(jqxhr);
                console.log(status);
                console.log(errorThrown);
            },
            200: function (result) {
                callback(result);
            }
        }
    });
}

//success: function (result) {
//    callback(result);
//},
//error : function (jqXHR, textStatus, errorThrown) {
//    console.log(jqXHR.status);
//}