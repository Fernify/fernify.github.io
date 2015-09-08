		function GetSummonerId(name, callback){
			var summID = "";
			var ajaxUrl = "https://euw.api.pvp.net/api/lol/euw/v1.4/summoner/by-name/" + name + "?api_key=cf2f4773-debd-499b-b4c8-daf1634f7fa1";
			$.ajax({
				type: "GET",
				url: ajaxUrl,
				dataType: "json",
				crossDomain: true,
				success: function(result){
					callback(result[name]);
				}				
			});
		}

		function GetSummonerMatches(summonerId, callback){
			var matchIds = [];
			$.ajax({
				type: "GET",
				url: "https://euw.api.pvp.net/api/lol/euw/v2.2/matchlist/by-summoner/" + summonerId + "?api_key=cf2f4773-debd-499b-b4c8-daf1634f7fa1",
				dataType: "json",
				crossDomain: true,
				success: function(result){
					$.each(result.matches, function(key){
						matchIds.push(this.matchId);
					});
					callback(matchIds);
				}
			});
		}

		function GetChampionName(championId, callback){
			$.ajax({
				type: "GET",
				url: "https://global.api.pvp.net/api/lol/static-data/euw/v1.2/champion/" + championId + "?api_key=cf2f4773-debd-499b-b4c8-daf1634f7fa1",
				dataType: "json",
				crossDomain: true,
				success: function(result){
					callback(result.name);
				}
			});
		}

		function GetMatchData(matchId, callback){
			$.ajax({
				type: "GET",
				url: "https://euw.api.pvp.net/api/lol/euw/v2.2/match/"+ matchId + "?includeTimeline=true&api_key=cf2f4773-debd-499b-b4c8-daf1634f7fa1",
				dataType: "json",
				crossDomain: true,
				success: function(result){
					callback(result);
				}
			});
		}