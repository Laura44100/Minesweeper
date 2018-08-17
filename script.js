$(document).ready(function(){
    
    /*
        Game initialization
    */
    
    var gameMap1 = [ [ "-1", "2", "1"], // num of mines around, -1 = mine
                    [ "2", "-1", "2"],
                    [ "1", "2", "-1"] ];
    var numberOfClearCells1 = 6;
    
    var gameMap2 = [ [ "-1", "2" , "1" , "1" , "1" , "-1", "1" , "0" ], // num of mines around, -1 = mine
                     [ "1" , "2" , "-1", "1" , "1" , "2" , "2" , "1" ],
                     [ "1" , "2" , "2" , "1" , "0" , "1" , "-1", "1" ],
                     [ "1" , "-1", "1" , "0" , "0" , "1" , "1" , "1" ],
                     [ "2" , "2" , "3" , "1" , "1" , "0" , "1" , "1" ],
                     [ "1" , "-1", "2" , "-1", "1" , "0" , "1" , "-1"],
                     [ "1" , "2" , "2" , "2" , "2" , "1" , "1" , "1" ],
                     [ "-1", "1" , "0" , "1" , "-1", "1" , "0" , "0" ] ];
    var numberOfClearCells2 = 8*8 - 10;
    
    
    generateHtmlTable(gameMap2);
    initializeGameValues(gameMap2, numberOfClearCells2);
    initialiseGame();
    
    /*
        Event listeners
    */
    
    $("td").click(function(){  // left click on cell
        if($(this).attr("canClick") == 1){
            var value = $(this).attr("gameValue");
            if(value == -1){ // mine
                $(this).html("x");
                $("#lost").css("display", "block");
                $("td").attr("canClick", 0);
            }
            else{ // not mine
                $(this).html(value);
                $("#cheat").attr("uncoveredCells", parseInt($("#cheat").attr("uncoveredCells")) +1);
                if(parseInt($("#cheat").attr("uncoveredCells")) >= parseInt($("#cheat").attr("cellsToUncover"))){
                    $("#won").css("display", "block");
                    $("td").attr("canClick", 0);
                }
            }
            $(this).attr("canClick", 0);
        }
    });
    
    $("td").contextmenu(function(){ // right click on cell
        switch($(this).html()) {
            case "":
                $(this).html("M");
                $(this).css("color", "red");
                $(this).attr("canClick", 0);
                break;
            case "M":
                $(this).html("?");
                $(this).attr("canClick", 0);
                 $(this).css("color", "#ba560b");
                break;
            case "?":
                $(this).html("");
                 $(this).css("color", "black");
                $(this).attr("canClick", 1);
                break;
            default:
                break;
        }
        return false;
    });
    
    $("#restart").click(function(){
        initialiseGame();
    });
    
});

/*
    generates the html table that will define the game matrix
    gameMap MUST be a square array of array
*/
function generateHtmlTable(gameMap){
    var id = 0
    for(var i=0; i<gameMap.length; i++){
        $("#gameMatrix").append("<tr>");
        for(var j=0; j<gameMap[0].length; j++){
            $("#gameMatrix").append($("<td></td>").attr("id", id));
            id++;
        }
        $("#gameMatrix").append("</tr>");
    }
}

function initializeGameValues(gameMap, numberOfClearCells){
    for(var i=0; i<gameMap.length ; i++){
        for(var j=0; j<gameMap[0].length ; j++){
            var n = i * gameMap[0].length + j;
            $("td#" + n).attr("gameValue", gameMap[i][j]);
        }
    }
    $("#cheat").attr("cellsToUncover", numberOfClearCells);
}

function initialiseGame(){
    $("td").html("");
     $("td").css("color", "black");
    $("td").attr("canClick", 1);
    $("#lost").css("display", "none");
    $("#won").css("display", "none");
    $("#cheat").attr("uncoveredCells", 0);
}

function generateMap(numberLines){
    var map = [];
    
    return map;
}