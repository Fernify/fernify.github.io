var champIDsDiedTo = [];
var summonerObj;
var listOfMatchIds = [];
var listOfMatches = [];
var killers = [];
var globalIndex = 0;
var victimChampIDs = [];
var uniqueChamps = [];

function GetSplashUrl(champName){
    var imageName  = champName.toLowerCase().replace(/\b[a-z]/g, function(letter) {
        return letter.toUpperCase();
    });
    imageName = imageName.replace(" ", "");
    if (imageName == "Wukong") {
        imageName = "MonkeyKing";
    }
    return "http://ddragon.leagueoflegends.com/cdn/img/champion/splash/" + imageName + "_0.jpg";
}
http://ddragon.leagueoflegends.com/cdn/5.2.1/img/champion/Aatrox.png 

function GetSqProfileUrl(champName){
    var imageName  = champName.toLowerCase().replace(/\b[a-z]/g, function(letter) {
        return letter.toUpperCase();
    });
    imageName = imageName.replace(" ", "").replace("'", "");
    return "http://ddragon.leagueoflegends.com/cdn/5.2.1/img/champion/" + imageName + ".png";
}

function PrintAllData() {
    killers = killers.sort(function (a, b) {
        var aTot = GetKillCount(a.vicIDs);
        var bTot = GetKillCount(b.vicIDs);
        return (bTot > aTot) ? 1 : ((bTot < aTot) ? -1 : 0);
    });

    var worstEnemy = LookupChampData(killers[0].id);
    $("#worstEnemy").text(worstEnemy.cName + ", " + worstEnemy.cTitle);
    $(".constrain").css("background-image", "url('" + GetSplashUrl(worstEnemy.cName) + "')");

    $.each(killers, function (index, killer) {
        var killerChamp = LookupChampData(killer.id);
        var text = "";
        $.each(killer.vicIDs, function (index, victim) {
            var champ = LookupChampData(victim.vID);
            text += ("<li>killed " + champ.cName + " " + victim.count + " times</li>");
        });
        $("#matchIdDisplay").append("<li>" + killerChamp.cName + "<ul>" + text + "</ul></li>");
    });
    $.each(victimChampIDs, function (index, champID) {
        var victim = LookupChampData(champID);
        $("#victimChampionContainer").append("<div class=\"champ\"><img src=\"" + GetSqProfileUrl(victim.cName) + "\" /></div>");
    });
}

function LookupChampData(id) {
    var champs = $.grep(uniqueChamps, function (x) { return x.cID == id; });
    if (champs.length > 0) {
        return champs[0];
    } else {
        return { cID: id, cName: id, cTitle: id };
    }
    return [0];
}

function GetAllChampionData(index) {
    if (index < uniqueChamps.length) {
        GetChampion(uniqueChamps[index].cID, function (champData) {
            console.log("Got " + champData.name + ", " + champData.title);
            uniqueChamps[index].cName = champData.name;
            uniqueChamps[index].cTitle = champData.title;
            var newIndex = index + 1;
            GetAllChampionData(newIndex);
        });
    } else {
        PrintAllData();
    }
}

function GetKillCount(vicObjs){
    var total = 0;
    $.each(vicObjs, function(index, vicObj){
        total += vicObj.count;
    });
    return total;
}

function GetAllData(){
    GetSummonerId($("#nameText").val(), function(summoner){
    	summonerObj = summoner;
    	GetSummonerMatches(summoner.id, function(matches){
    		listOfMatchIds = matches;
            GetMatchDataFromMatchIds(0);
    	});
    });
}

function GetMatchDataFromMatchIds(index){
    if (index < listOfMatchIds.length) {
        setTimeout(function () {
            console.log("Getting Match " + index + " of " + listOfMatchIds.length);
            var matchID = listOfMatchIds[index];
            var newIndex = index + 1;
            GetMatchData(matchID, function (matchData) {
                listOfMatches.push(matchData);
                FormatMatchData(matchData);
                GetMatchDataFromMatchIds(newIndex);
            });
        }, 2800);
    } else {
        //GetAllChampionData(0);
        PrintAllData();
    }
}

function FormatMatchData(match){
    var ppIDs = match.participantIdentities;
    var ppChamps = match.participants;
    var playerPPID = ($.grep(ppIDs, function (x) { return (x.player.summonerId == summonerObj.id); }))[0].participantId;
    var playerChampID = ppChamps[playerPPID-1].championId;
    var frames = match.timeline.frames;
    for(var f = 0; f<frames.length; f++){
        var currentFrame = frames[f];
        if(currentFrame.events != undefined){
            var events = currentFrame.events;
            var victimKillEvents = $.grep(events, function(e){ return (e.eventType == "CHAMPION_KILL" && e.victimId == playerPPID);});
            if(victimKillEvents.length > 0){
                $.each(victimKillEvents, function (index, killEvent) {
                    if (killEvent.killerId > 0) {
                        champIDsDiedTo.push({ kID: ppChamps[killEvent.killerId - 1].championId, vID: playerChampID });
                        var champDeath = { kID: ppChamps[killEvent.killerId - 1].championId, vID: playerChampID };
                        var matchingKillerObjs = $.grep(killers, function (x) { return x.id == champDeath.kID });
                        if (matchingKillerObjs.length == 0) {
                            var newItem = {};
                            newItem.id = champDeath.kID;
                            newItem.vicIDs = [{ vID: champDeath.vID, count: 1 }];
                            killers.push(newItem);
                        } else {
                            var matchingKillerObj = matchingKillerObjs[0];
                            var matchVicObjs = $.grep(matchingKillerObj.vicIDs, function (y) { return y.vID == champDeath.vID });
                            if (matchVicObjs.length == 0) {
                                matchingKillerObj.vicIDs.push({ vID: champDeath.vID, count: 1 });
                            } else {
                                var matchVicObj = matchVicObjs[0];
                                matchVicObj.count = matchVicObj.count + 1;
                            }
                        }

                        var uniqueChampList = $.grep(uniqueChamps, function (x) { return (x.cID == champDeath.kID || x.cID == champDeath.vID) });
                        if (uniqueChampList.length == 0) {
                            GetChampion(champDeath.kID, function (kChamp) {
                                GetChampion(champDeath.vID, function (vChamp) {
                                    uniqueChamps.push({ cID: kChamp.id, cName: kChamp.name, cTitle: kChamp.title });
                                    uniqueChamps.push({ cID: vChamp.id, cName: vChamp.name, cTitle: vChamp.title });
                                });
                            });
                        } else if (uniqueChampList.length == 1) {
                            if (uniqueChampList[0].cID == champDeath.kID) {
                                GetChampion(champDeath.vID, function (vChamp) {
                                    uniqueChamps.push({ cID: vChamp.id, cName: vChamp.name, cTitle: vChamp.title });
                                });
                            } else {
                                GetChampion(champDeath.kID, function (kChamp) {
                                    uniqueChamps.push({ cID: kChamp.id, cName: kChamp.name, cTitle: kChamp.title });
                                });
                            }
                        }


                        if (victimChampIDs.indexOf(champDeath.vID) == -1) {
                            victimChampIDs.push(champDeath.vID);
                        }
                    }
                });
            }
        }
    }
}
