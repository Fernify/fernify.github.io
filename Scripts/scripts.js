		var champIDsDiedTo = [];
			var summonerObj;
			var listOfMatchIds = [];
			var listOfMatches = [];
			var killers = [];
			var globalIndex = 0;
			function PrintAllData(){

				killers = killers.sort(function(a,b){
					var aTot = GetKillCount(a.vicIDs);
					var bTot = GetKillCount(b.vicIDs);
					return (bTot > aTot) ? 1 : ((bTot < aTot) ? -1 : 0);
				});
				GetChampionName(killers[0].id, function(name){
					$("#worstEnemy").text(name);
				});
				GetChampionNameCall(0);
				//$.each(killers, function(index, killer){
				//	console.log(index + " " + killer.id);
				//	GetChampionName(killer.id, function(kName){
				//		for(var l = 0; l < killer.vicIDs.length; l++){		
				//			var killRecord = killer.vicIDs[l];			
				//			var killText = "<li>" + kName + "<ul>";
				//			GetChampionName(killRecord.vID, function(vName){
				//				var vString = "<li>" + " killed " + vName + " " + killRecord.count + " times</li>";
				//				killText +=  vString;
				//				if(l == killer.vicIDs.length){
				//					$("#matchIdDisplay").append(killText+"</ul></li>");
				//				}
				//			});
				//		}
				//	});
				//	
				//});
			}

			function GetChampionNameCall(index){
				if(index < killers.length){
					var killer = killers[index];
					GetChampionName(killer.id, function(kName){
						for(var l = 0; l < killer.vicIDs.length; l++){		
							var killRecord = killer.vicIDs[l];			
							var killText = "<li>" + kName + "<ul>";
							GetChampionName(killRecord.vID, function(vName){
								var vString = "<li>" + " killed " + vName + " " + killRecord.count + " times</li>";
								killText +=  vString;
								if(l == killer.vicIDs.length){
									$("#matchIdDisplay").append(killText+"</ul></li>");
									var newIndex = index + 1;
									GetChampionNameCall(newIndex);
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
						GetAllMatchData(function(matches){
							$.each(matches, function(index, match){
								FormatMatchData(match);
								listOfMatches.push(match);
								if(matches.length-1 == index){
									console.log("End");
									PrintAllData();
								}
							});
						});


				//GetSummonerId($("#nameText").val(), function(summoner){
				//	summonerObj = summoner;
				//	GetSummonerMatches(summoner.id, function(matches){
				//		listOfMatchIds = matches;
				//		var maxIndex = matches.length;
				//		var index = 0;

						//var myInterval = setInterval(function(){
						//	if(index == maxIndex){
						//		console.log("Data gotten");
						//		clearInterval(myInterval);
						//	}else{
						//		console.log("Match " + (index +1));
						//		GetMatchData(matches[index], function(match){
						//		FormatMatchData(match);
						//		listOfMatches.push(match);
						//		index++;
						//	});
						//	}
						//}, 2200);
				//	});
				//});
			}

			function FormatMatchData(match){
				var ppIDs = match.participantIdentities;
				var ppChamps = match.participants;
				var playerPPID = ($.grep(ppIDs, function(x){return (x.player.summonerId == 25575262);}))[0].participantId;  
				var playerChampID = ppChamps[playerPPID-1].championId;
				var frames = match.timeline.frames;
				//var killerFrames = $.grep(frames, function)
				for(var f = 0; f<frames.length; f++){
					var currentFrame = frames[f];
					if(currentFrame.events != undefined){
						for(var e = 0; e<currentFrame.events.length; e++){
							var currentEvent = currentFrame.events[e];
							if(currentEvent.eventType == "CHAMPION_KILL"){
								if(currentEvent.victimId == playerPPID){
									champIDsDiedTo.push({ kID: ppChamps[currentEvent.killerId-1].championId, vID: playerChampID});
								}	
							}
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
			}
