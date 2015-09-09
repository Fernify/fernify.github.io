var champIDsDiedTo = [];
var summonerObj;
var listOfMatchIds = [];
var listOfMatches = [];
var killers = [];
var globalIndex = 0;

function PrintAllData() {
    GetChampion(killers[0].id, function(champ){
        var name = champ.name;
        $("#worstEnemy").text(name + ", " + champ.title);
        var imageName  = name.toLowerCase().replace(/\b[a-z]/g, function(letter) {
            return letter.toUpperCase();
        });
        imageName = imageName.replace(" ", "");
        $(".constrain").css("background-image", "url('http://ddragon.leagueoflegends.com/cdn/img/champion/splash/" + imageName + "_0.jpg')");
    });
    DisplayKillerChampions(0);
}

function DisplayKillerChampions(index){
    if(index < killers.length){
        var killer = killers[index];
        GetChampion(killer.id, function(kName){
            for(var l = 0; l < killer.vicIDs.length; l++){		
                var killRecord = killer.vicIDs[l];			
                var killText = "<li>" + kName.name + "<ul>";
                GetChampion(killRecord.vID, function(vName){
                    var vString = "<li>" + " killed " + vName.name + " " + killRecord.count + " times</li>";
                    killText +=  vString;
                    if(l == killer.vicIDs.length){
                        $("#matchIdDisplay").append(killText+"</ul></li>");
                        var newIndex = index + 1;
                        DisplayKillerChampions(newIndex);
                    }
                });
            }
        });					
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
            GetAllMatchData(function(listMatches){
                $.each(listMatches, function(index, match){
                    FormatMatchData(match);
                    listOfMatches.push(match);
                    if(listMatches.length-1 == index){
                        console.log("End");
                        PrintAllData();
                    }
                });
            });
                            
            //GetMatchDataFromMatchIds(0, function(){
            //    $.each(listOfMatches, function(index, match){
            //        FormatMatchData(match);
            //        listOfMatches.push(match);
            //        if(matches.length-1 == index){
            //            console.log("End");
            //            PrintAllData();
            //        }
            //    });
            //});
    	});
    });
}

function GetMatchDataFromMatchIds(index, callback){
    if(index < listOfMatchIds.length){
        var matchID = listOfMatchIds[index];
        GetMatchData(matchID, function(matchData){
            listOfMatches.push(matchData);
            var newIndex = index + 1;
            GetMatchDataFromMatchIds(newIndex);
        });			
    } else{
        callback();
    }
}

function FormatMatchData(match){
    var ppIDs = match.participantIdentities;
    var ppChamps = match.participants;
    var playerPPID = ($.grep(ppIDs, function(x){return (x.player.summonerId == 25575262);}))[0].participantId;  
    var playerChampID = ppChamps[playerPPID-1].championId;
    var frames = match.timeline.frames;
    for(var f = 0; f<frames.length; f++){
        var currentFrame = frames[f];
        if(currentFrame.events != undefined){
            var events = currentFrame.events;
            var victimKillEvents = $.grep(events, function(e){ return (e.eventType == "CHAMPION_KILL" && e.victimId == playerPPID);});
            if(victimKillEvents.length > 0){
                $.each(victimKillEvents, function(index, killEvent){
                    champIDsDiedTo.push({ kID: ppChamps[killEvent.killerId-1].championId, vID: playerChampID});
                });
            }
        }
    }
    $.each(champIDsDiedTo, function(index, champDeath){
        var exists = false;
        for(var i = 0; i < killers.length; i++){
            var thisKiller = killers[i];
            if(thisKiller.id == champDeath.kID){
                exists = true;
                for(var v = 0; v < thisKiller.vicIDs.length; v++){
                    if(thisKiller.vicIDs[v].vID == champDeath.vID){
                        thisKiller.vicIDs[v].count = thisKiller.vicIDs[v].count + 1;
                    }
                }
            }
        }
        if(!exists){
            var newItem = {};
            newItem.id = champDeath.kID;
            newItem.vicIDs = [{vID:champDeath.vID, count:1}];
            killers.push(newItem);
        }
    });
    killers = killers.sort(function(a,b){
        var aTot = GetKillCount(a.vicIDs);
        var bTot = GetKillCount(b.vicIDs);
        return (bTot > aTot) ? 1 : ((bTot < aTot) ? -1 : 0);
    });
}
