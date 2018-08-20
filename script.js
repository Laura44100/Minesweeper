$(document).ready(function(){
    
    /*
        Game initialization
    */    
    
    var map3 = generateMap(8);
    var numberOfClearCells3 = 8*8 - 10;

    generateHtmlTable(map3);
    initializeGameValues(map3, numberOfClearCells3);
    initialiseGame();

    
    /*
        Event listeners
    */
    
    $("td").click(function(){  // left click on cell
        if($(this).attr("canClick") == 1){
            var value = $(this).attr("gameValue");
            if(value == -1){ // mine
                $("td").attr("canClick", 0);
            }
            else{ // not mine
                $(this).html(value); // showing value into cell
                $("#cheat").attr("uncoveredCells", parseInt($("#cheat").attr("uncoveredCells")) +1); // incrementing uncoredCells
                if(parseInt($("#cheat").attr("uncoveredCells")) >= parseInt($("#cheat").attr("cellsToUncover"))){ // if uncovered all clear cells then win
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

function generateMap(numberOfLines){
    var map = [];
    var currentLine;

    for(var i=0; i<numberOfLines; i++){
        currentLine = [];
        for(var j=0; j<numberOfLines; j++){
            currentLine.push(0);
        }
        map.push(currentLine);
    }
    var map = initializeMapWithMines(map, numberOfLines);
    map = fillMapEmptyCells(map);
    return map;
}

function initializeMapWithMines(map){
    var numberOfMines = 10;
    for(var i=0; i<numberOfMines; i++){
        var minePosition = getRadomPositionInMap(map.length);
        while(map[minePosition[0]][minePosition[1]] == -1){ // if already a mine, then select another random cell
            minePosition = getRadomPositionInMap(map.length);
        }
        map[minePosition[0]][minePosition[1]] = -1; // place the mine
    }
    return map;
}

function getRadomPositionInMap(mapLength){
    var a = Math.trunc(Math.random()*mapLength);
    var b = Math.trunc(Math.random()*mapLength);
    if(a==8){ // dont want to include 8 but want to include 0 in the random
        a=0;
    }
    if(b==8){
        b=0;
    }
    return [a,b];
}

function fillMapEmptyCells(map){
    for(var i=0; i<map.length; i++){
        for(var j=0; j<map.length; j++){
            if(map[i][j] != -1){ // not mine
                map[i][j] = numberOfMinesAround(map, i, j);
            }
        }
    }
    return map;
}

function numberOfMinesAround(map, i, j){
    var n = 0;
    var leftOK, rightOK, upOK, downOK;
    // left
    if((j-1) >= 0 && (j-1) < map.length){
        leftOK = true;
    }
    else{
        leftOK = false;
    }
    // right
    if((j+1) >= 0 && (j+1) < map.length){
        rightOK = true;
    }
    else{
        rightOK = false;
    }
    // up
    if((i-1) >= 0 && (i-1) < map.length){
        upOK = true;
    }
    else{
        upOK = false;
    }
    // down
    if((i+1) >= 0 && (i+1) < map.length){
        downOK = true;
    }
    else{
        downOK = false;
    }
    //up left
    if(upOK && leftOK){
        if(map[i-1][j-1] == -1){
            n++;
        }
    }
    // up
    if(upOK){
        if(map[i-1][j] == -1){
            n++;
        }
    }
    // up right
    if(upOK && rightOK){
        if(map[i-1][j+1] == -1){
            n++;
        }
    }
    // left
    if(leftOK){
        if(map[i][j-1] == -1){
            n++;
        }
    }
    // right
    if(rightOK){
        if(map[i][j+1] == -1){
            n++;
        }
    }
    // down left
    if(downOK && leftOK){
        if(map[i+1][j-1] == -1){
            n++;
        }
    }
    // down
    if(downOK){
        if(map[i+1][j] == -1){
            n++;
        }
    }
    // down right
    if(downOK && rightOK){
        if(map[i+1][j+1] == -1){
            n++;
        }
    }
    return n;
}