$(document).ready(function(){
    // Game initialization 
    initIntermediateGame();
    
    // buttons event listeners
    addButtonsEventListeners();
    
    // Timer
    var x = setInterval(updateTimer, 1000);
});


function updateTimer(){
    if(parseInt($("#cheat").attr("timerOn"))){
        // get time now
        var now = new Date().getTime();
        
        // find the distance between starting time and now
        var distance = now - $("#cheat").attr("startingTime");
        var minutes = Math.floor(distance / (1000 * 60));
        var seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // display the result
        $("#chrono").html(minutes + "m " + seconds + "s"); 
    }
}

function addEventListeners(){
    // left click on cell
    $("td").click(function(){
        // if first cell discovered of the game
        if(!parseInt($("#cheat").attr("timerOn")) && $("#won").css("display") == "none" && $("#lost").css("display") == "none"){
            // start timer
            $("#cheat").attr("startingTime", new Date().getTime())
                       .attr("timerOn", 1);
        }
        if($(this).attr("canClick") == 1){
            var value = $(this).attr("gameValue");
            if(value == -1){ // mine - LOST
                $("td").attr("canClick", 0); // stop the game, cant click on any cell
                $("#cheat").attr("timerOn", 0); // stop timer
                showAllMines($(this));
                crossWrongFlags();
                $("#lost").css("display", "block"); // showing You Lost message
            }
            else{ // not mine
                $(this).html(value); // showing value into cell
                beautifyCellWhenClicked($(this));
                $(this).attr("canClick", 0); // prevent cell fro, clicking again
                $("#cheat").attr("uncoveredCells", parseInt($("#cheat").attr("uncoveredCells")) +1); // incrementing uncoredCells
                // if uncovered all clear cells, WIN
                if(parseInt($("#cheat").attr("uncoveredCells")) >= parseInt($("#cheat").attr("cellsToUncover"))){ 
                    $("#won").css("display", "block");
                    $("td").attr("canClick", 0); // stop the game, cant click on any cell
                    fillEmptyCellsWithFlags();
                    $("#cheat").attr("timerOn", 0); // stop timer
                    $("#wonInARow").html(parseInt($("#wonInARow").html())+1); // increment won in a row counter
                }
                if(value == 0){
                    clickOnCellsAround(parseInt($(this).attr("id")));
                }
            }
            $(this).attr("canClick", 0); //cell already clicked
        }
    });
    
    // right click on cell
    $("td").contextmenu(function(){ 
        if($("#lost").css("display") != "block" && $("#won").css("display") != "block") // if game still in play
        {
            switch($(this).html()) {
                case "":
                    // updating UI
                    $(this).html("M");
                    $(this).css({"font-size": "0", "background-image": "url('minesweeper/images/flag.png')", "background-size": "100%"});
                    
                    // updating mines left counter
                    var minesGuessed = parseInt($("#cheat").attr("minesGuessed")) + 1;
                    $("#cheat").attr("minesGuessed", minesGuessed);
                    var minesLeft = parseInt($("#cheat").attr("numberOfMines")) - minesGuessed;
                    if(minesLeft < 0) minesLeft = 0;
                    $("#minesLeft").html(minesLeft);
                    
                    // blocking cell
                    $(this).attr("canClick", 0);
                    break;
                case "M":
                    // updating UI
                    $(this).html("?");
                    $(this).css({"font-size": "14px", "background-image": "none"});
                    
                    // if it was a mine's cell, preload again mine background
                    if($(this).attr("gameValue") == "-1"){
                        $(this).css({"background-image": "url('minesweeper/images/mine.png')", "background-size": "0%"});
                    }
                    
                    // updating mines left counter
                    var minesGuessed = parseInt($("#cheat").attr("minesGuessed")) - 1;
                    $("#cheat").attr("minesGuessed", minesGuessed);
                    var minesLeft = parseInt($("#cheat").attr("numberOfMines")) - minesGuessed;
                    if(minesLeft < 0) minesLeft = 0;
                    $("#minesLeft").html(minesLeft);
                    
                    // blocking cell
                    $(this).attr("canClick", 0);
                    break;
                case "?":
                    // updating UI
                    $(this).html("");
                    $(this).css("color", "black");
                    
                    // freeing cell
                    $(this).attr("canClick", 1);
                    break;
                default:
                    break;
            }
        }
        return false;
    });
    
    // double click
    $("td").dblclick(function(){ 
        var cellId = parseInt($(this).attr("id"));
        var minesGuessedAround = numberOfMinesGuessedAroundMatrixCell(cellId);
        var val = $(this).html();
        if(val!="M" && val!="?" && val!="" && minesGuessedAround >= val){
            clickOnCellsAround(cellId);
        }
    });
}

function initEasyGame(){
    initialiseGame(8, 10);
}
function initIntermediateGame(){
    initialiseGame(16, 40);
}
function initExpertGame(){
    initialiseGame(24, 90);
}


function initialiseGame(matrixSize, nbMines){
    if($("#won").css("display") == "none"){ // if not just won
        $("#wonInARow").html(0); // resert won in a row counter
    }
    var map = generateMap(matrixSize, nbMines);
    var numberOfClearCells = matrixSize*matrixSize - nbMines;
    generateHtmlTable(map);
    initializeGameValues(map, numberOfClearCells);
    initialiseGameCss(nbMines);
    addEventListeners();
}

function generateMap(numberOfLines, numberOfMines){
    var map = [];
    var currentLine;

    for(var i=0; i<numberOfLines; i++){
        currentLine = [];
        for(var j=0; j<numberOfLines; j++){
            currentLine.push(0);
        }
        map.push(currentLine);
    }
    var map = initializeMapWithMines(map, numberOfMines);
    map = fillMapEmptyCells(map);
    return map;
}

function initializeMapWithMines(map, numberOfMines){
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
                map[i][j] = numberOfMinesAroundMap(map, i, j);
            }
        }
    }
    return map;
}

function numberOfMinesAroundMap(map, i, j){
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

function generateHtmlTable(gameMap){
    $("#gameMatrix").html("");  // clear previous html table if any
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

function initialiseGameCss(numberOfMines){
    $("td").html("")
           .css({"size": "14px", "color": "black", "background-color": "#b3b3b3", "background-image": "none"})
           .attr("canClick", 1)
           .addClass("noselect");  // clearing matrix cells and enabling them
    $("td[gameValue='-1']").css({"background-image": "url('minesweeper/images/mine.png')", "background-size": "0%"}); //pre-loading mines background image but not showing them (size:0)
    $("#lost").css("display", "none"); // hiding you won message
    $("#won").css("display", "none"); // hiding you lost message
    $("#cheat").attr("uncoveredCells", 0) // 0 uncovered cells yet
               .attr("numberOfMines", numberOfMines) // initializing total number of mines in the game
               .attr("minesGuessed", 0) // 0 mines guessed yet
               .attr("startingTime", -1) 
               .attr("timerOn", 0); // timer off
    $("#minesLeft").html(numberOfMines);
    $("#chrono").html("0m 0s"); 
}

function addButtonsEventListeners(){
    // click on Easy
    $("#easy").click(function(){
        initEasyGame(); // initialise small matrix game
        $("#easy").addClass("selected");
        $("#intermediate").removeClass("selected");
        $("#expert").removeClass("selected");
        
    });
    
    // click on Interediate
    $("#intermediate").click(function(){
        initIntermediateGame(); // initialise medium matrix game
        $("#easy").removeClass("selected");
        $("#intermediate").addClass("selected");
        $("#expert").removeClass("selected");
    });
    
    // click on Expert
    $("#expert").click(function(){
        initExpertGame(); // initialise large matrix game
        $("#easy").removeClass("selected");
        $("#intermediate").removeClass("selected");
        $("#expert").addClass("selected");
    });
    
    // click on restart
    $("#restart").click(function(){
        if($("#easy").hasClass("selected")){
            initEasyGame();
        }
        else if($("#intermediate").hasClass("selected")){
            initIntermediateGame();
        }
        else if($("#expert").hasClass("selected")){
            initExpertGame();
        }
        else{
            initEasyGame();
        }
    });
}


function numberOfMinesGuessedAroundMatrixCell(cellId){
    var matrixLength = parseInt($("#gameMatrix").find("tr").length);
    var upLeftId = cellId - matrixLength -1,
        upId = cellId - matrixLength,
        upRightId = cellId - matrixLength + 1,
        leftId = cellId - 1,
        rightId = cellId + 1,
        downLeftId = cellId + matrixLength - 1,
        downId = cellId + matrixLength,
        downRightId = cellId + matrixLength + 1;
    var [leftOK, rightOK, upOK, downOK] = cellsAvailableAround(cellId);
    var n=0;
    //up left
    if(upOK && leftOK){
        if($("#"+upLeftId).html() == "M"){
            n++;
        }
    }
    // up
    if(upOK){
        if($("#"+upId).html() == "M"){
            n++;
        }
    }
    // up right
    if(upOK && rightOK){
        if($("#"+upRightId).html() == "M"){
            n++;
        }
    }
    // left
    if(leftOK){
        if($("#"+leftId).html() == "M"){
            n++;
        }
    }
    // right
    if(rightOK){
        if($("#"+rightId).html() == "M"){
            n++;
        }
    }
    // down left
    if(downOK && leftOK){
        if($("#"+downLeftId).html() == "M"){
            n++;
        }
    }
    // down
    if(downOK){
        if($("#"+downId).html() == "M"){
            n++;
        }
    }
    // down right
    if(downOK && rightOK){
        if($("#"+downRightId).html() == "M"){
            n++;
        }
    }
    return n;
}

function clickOnCellsAround(cellId){
    
    var matrixLength = parseInt($("#gameMatrix").find("tr").length);
    var upLeftId = cellId - matrixLength -1,
        upId = cellId - matrixLength,
        upRightId = cellId - matrixLength + 1,
        leftId = cellId - 1,
        rightId = cellId + 1,
        downLeftId = cellId + matrixLength - 1,
        downId = cellId + matrixLength,
        downRightId = cellId + matrixLength + 1;

    var [leftOK, rightOK, upOK, downOK] = cellsAvailableAround(cellId);

    //up left
    if(upOK && leftOK){
        $("#"+upLeftId).click();
    }
    // up
    if(upOK){
        $("#"+upId).click();
    }
    // up right
    if(upOK && rightOK){
        $("#"+upRightId).click();
    }
    // left
    if(leftOK){
        $("#"+leftId).click();
    }
    // right
    if(rightOK){
        $("#"+rightId).click();
    }
    // down left
    if(downOK && leftOK){
        $("#"+downLeftId).click();
    }
    // down
    if(downOK){
        $("#"+downId).click();
    }
    // down right
    if(downOK && rightOK){
        $("#"+downRightId).click();
    }
}

function cellsAvailableAround(cellId){
    var matrixLength = parseInt($("#gameMatrix").find("tr").length);
    var leftOK, rightOK, upOK, downOK;
    if(cellId%matrixLength != 0){ 
        leftOK = true;
    }
    else{
        leftOK = false;
    }
    if(cellId%matrixLength != (matrixLength-1)){ 
        rightOK = true;
    }
    else{
        rightOK = false;
    }
    if(cellId >= matrixLength){ 
        upOK = true;
    }
    else{
        upOK = false;
    }
    if(cellId <= matrixLength*matrixLength-matrixLength){
        downOK = true;
    }
    else{
        downOK = false;
    }
    return [leftOK, rightOK, upOK, downOK];
}

function fillEmptyCellsWithFlags(){
    $(":empty").css({"background-image": "url('minesweeper/images/flag.png')", "background-size": "100%"});
}

function showAllMines(cell){
    $("td[gameValue='-1']:not(:contains('M'))").css({"background-size": "100%", "background-color": "#e6e6e6"}); // all other mines except those marked with flag (html text 'M')
    cell.css("background-color", "#e56464");
}

function crossWrongFlags(){
    $("td[gameValue!='-1']:contains('M')").css("background-image", "url(minesweeper/images/flag.png), linear-gradient(to bottom right, transparent calc(50% - 3px), red, transparent calc(50% + 3px))")
                                          .css("background-size", "100%, 100%");
}

function beautifyCellWhenClicked(cell){
    cell.css("background-color", "#e6e6e6");
    switch(cell.attr("gameValue")){
        case "0":
            cell.css("color", "#808080");
            break;
        case "1":
            cell.css("color", "#0000ff");
            break;
        case "2":
            cell.css("color", "#008000");
            break;
        case "3":
            cell.css("color", "#e60000");
            break;
        case "4":
            cell.css("color", "#000099");
            break;
        case "5":
            cell.css("color", "#800000");
            break;
        case "6":
            cell.css("color", "#006680");
            break;
        case "7":
            cell.css("color", "#800000");
            break;
        case "8":
            cell.css("color", "#400080");
            break;
        case "9":
            cell.css("color", "#992600");
            break;
        case "-1":
            cell.css("color", "black");
            break;
    }
}