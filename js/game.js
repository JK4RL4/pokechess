document.addEventListener('DOMContentLoaded', () => {
    let gameConfig = localStorage.getItem("gameConfig");
    gameConfig = JSON.parse(gameConfig);
    let dragTarget, dragTargetPlayer, dragTargetPiece;
    let game = {
        "player1": {},
        "player2": {}
    }

    gameId = getParameterByName("game");

    if (gameId) {
        let savedGames = localStorage.getItem("savedGames");
        savedGames = JSON.parse(savedGames);

        game.player1 = createPieces(1, null, savedGames[gameId].player1.pieces);
        game.player2 = createPieces(2, null, savedGames[gameId].player2.pieces);
        
        document.querySelector("#game-player1-name").innerHTML = savedGames[gameId].player1.name;
        document.querySelector("#game-player2-name").innerHTML = savedGames[gameId].player2.name;
        document.querySelector("#game-player1-turn").innerHTML = "Turno de " + savedGames[gameId].player1.name;
        document.querySelector("#game-player2-turn").innerHTML = "Turno de " + savedGames[gameId].player2.name;
        document.querySelector("#game-player1-avatar").src = savedGames[gameId].player1.avatar;
        document.querySelector("#game-player2-avatar").src = savedGames[gameId].player2.avatar;
        
        createChessboard(savedGames[gameId].tiles);
        putPiecesOnBoard("player1", game.player1);
        putPiecesOnBoard("player2", game.player2);
        updateTurn(savedGames[gameId].gameTurn);
    } else {
        game.player1 = createPieces(1, gameConfig.player1.pieces);
        game.player2 = createPieces(2, gameConfig.player2.pieces);
        
        document.querySelector("#game-player1-name").innerHTML = gameConfig.player1.name;
        document.querySelector("#game-player2-name").innerHTML = gameConfig.player2.name;
        document.querySelector("#game-player1-turn").innerHTML = "Turno de " + gameConfig.player1.name;
        document.querySelector("#game-player2-turn").innerHTML = "Turno de " + gameConfig.player2.name;
        document.querySelector("#game-player1-avatar").src = gameConfig.player1.avatar;
        document.querySelector("#game-player2-avatar").src = gameConfig.player2.avatar;
        
        createChessboard(gameConfig.tiles);
        putPiecesOnBoard("player1", game.player1);
        putPiecesOnBoard("player2", game.player2);
    }

    document.querySelectorAll(".chess-piece").forEach(element => {
        element.addEventListener("drag", function(e){
            e.preventDefault();
                if (e.target.classList.contains("enabled")) {
                    dragTarget = e.target.id;
                    dragTargetPlayer = dragTarget.substring(0, dragTarget.indexOf("-"));
                    dragTargetPiece = dragTarget.substring(dragTarget.indexOf("-")+1);
                    game[dragTargetPlayer][dragTargetPiece].move(dragTargetPlayer);
                    clearAllyAttacks(dragTargetPlayer);
                    checkPawn(dragTargetPlayer, game[dragTargetPlayer][dragTargetPiece]);
                }
        })
    })

    document.querySelectorAll(".chess-tile").forEach(element => {
        element.addEventListener("drop", function(e){
            e.preventDefault();
            let newTile = e.target.parentNode;
            if (newTile.classList.contains("enabled")) {
                movePiece(newTile, dragTargetPlayer, game[dragTargetPlayer][dragTargetPiece]);
                checkPawnTransform(game, dragTargetPlayer, game[dragTargetPlayer][dragTargetPiece]);
                finishTurn();
            } else if (newTile.classList.contains("attack")) {
                attackPiece(game, newTile, dragTargetPlayer);
                movePiece(newTile, dragTargetPlayer, game[dragTargetPlayer][dragTargetPiece]);
                finishTurn();
            }
        })
    })

    document.querySelectorAll(".chess-piece").forEach(element => {
        element.addEventListener("dragleave", function(e){
            e.preventDefault();
            clear();
        })
    })

    document.querySelectorAll(".chess-tile").forEach(element => {
        element.addEventListener("dragover", function(e){
            e.preventDefault();
        })
    })

    document.querySelector("#save-button").addEventListener("click", function (){
        let savedGames = localStorage.getItem("savedGames");
        let today = new Date();
        let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        let dateTime = date + " " + time;
        let turn = document.querySelector("#game-player1-turn");

        if (turn.classList.contains("hidden")) {
            turn = "player2";
        } else { 
            turn = "player1"
        }

        let currentGame = {
            "gameName": gameConfig.player1.name + " Vs " + gameConfig.player2.name + " " + dateTime,
            "gameTurn": turn,
            "player1": {
                "name": gameConfig.player1.name,
                "avatar": gameConfig.player1.avatar,
                "pieces": game.player1
            },
            "player2": {
                "name": gameConfig.player2.name,
                "avatar": gameConfig.player2.avatar,
                "pieces": game.player2
            },
            "tiles": {
                "tile1": gameConfig.tiles.tile1,
                "tile2": gameConfig.tiles.tile2
            }
        }

        if(savedGames) {
            savedGames = JSON.parse(savedGames);
        } else {
            savedGames = [];
        }

        savedGames.push(currentGame);
        savedGames = JSON.stringify(savedGames);
        localStorage.setItem("savedGames", savedGames);

        let container = document.querySelector(".container");
        feedbackPanel(container);
        let feedbackContent = document.querySelector(".feedback-content");
        feedbackContent.addElement("p", "id= class=", "Partida guardada");
    })

    document.querySelector("#credits-button").addEventListener("click", function (){
        let button = this;
        let container = document.querySelector(".container");
        let credits = feedbackPanel(container, button);
        let feedbackContent = document.querySelector(".feedback-content");
        button.disabled = true;
        feedbackContent.addElement("p", "id= class=credits-title", "Realizado por:");
        feedbackContent.addElement("p", "id= class=credits-p", "Jon Karla Somoza");
        feedbackContent.addElement("img", "id= class=credits-img", "./img/bbk_logo.png");
        credits.addElement("img", "id= class=credits-background", "./img/credits_background.png");
    })

    document.querySelector(".mobile-nav-link").addEventListener("click", function(){
        document.querySelector(".mobile-nav-dropdown").style.display = "block";
      })
    
    // document.querySelector(".mobile-nav-dropdown").addEventListener("mouseout", function(){
    //     document.querySelector(".mobile-nav-dropdown").style.display = "none";
    // })

})

function createChessboard(tiles){
    let tilesList = document.querySelectorAll(".chess-tile");
    let tile1url = "url(./img/tiles/" + tiles.tile1 + ")";
    let tile2url = "url(./img/tiles/" + tiles.tile2 + ")";

    tilesList.forEach(element => {
        if (element.classList.contains("white")) {
             element.style.backgroundImage = tile1url;
         } else if (element.classList.contains("black")) {
             element.style.backgroundImage = tile2url;
         }
        element.style.backgroundSize = "100% 100%";
    })
}

function createPieces(player, set, existingPieces){
    let pieceRow = [];
    let pieces = {
        "king": {},
        "queen": {},
        "rook1": {},
        "rook2": {},
        "bishop1": {},
        "bishop2": {},
        "knight1": {},
        "knight2": {},
        "pawn1": {},
        "pawn2": {},
        "pawn3": {},
        "pawn4": {},
        "pawn5": {},
        "pawn6": {},
        "pawn7": {},
        "pawn8": {},
    }

    if (player === 1) {
        pieceRow = [1, 2];
    } else if (player === 2) {
        pieceRow = [8, 7];
    }

    if (set) {
        pieces.king = new Piece("king", "king", set.king.front, set.king.back, pieceRow[0], 5, 0);
        pieces.queen = new Piece("queen", "queen", set.queen.front, set.queen.back, pieceRow[0], 4, 0);
        pieces.rook1 = new Piece("rook1", "rook", set.rook.front, set.rook.back, pieceRow[0], 1, 0);
        pieces.rook2 = new Piece("rook2", "rook", set.rook.front, set.rook.back, pieceRow[0], 8, 0);
        pieces.bishop1 = new Piece("bishop1", "bishop", set.bishop.front, set.bishop.back, pieceRow[0], 3, 0);
        pieces.bishop2 = new Piece("bishop2", "bishop", set.bishop.front, set.bishop.back, pieceRow[0], 6, 0);
        pieces.knight1 = new Piece("knight1", "knight", set.knight.front, set.knight.back, pieceRow[0], 2, 0);
        pieces.knight2 = new Piece("knight2", "knight", set.knight.front, set.knight.back, pieceRow[0], 7, 0);
        pieces.pawn1 = new Piece("pawn1", "pawn", set.pawn.front, set.pawn.back, pieceRow[1], 1, 0);
        pieces.pawn2 = new Piece("pawn2", "pawn", set.pawn.front, set.pawn.back, pieceRow[1], 2, 0);
        pieces.pawn3 = new Piece("pawn3", "pawn", set.pawn.front, set.pawn.back, pieceRow[1], 3, 0);
        pieces.pawn4 = new Piece("pawn4", "pawn", set.pawn.front, set.pawn.back, pieceRow[1], 4, 0);
        pieces.pawn5 = new Piece("pawn5", "pawn", set.pawn.front, set.pawn.back, pieceRow[1], 5, 0);
        pieces.pawn6 = new Piece("pawn6", "pawn", set.pawn.front, set.pawn.back, pieceRow[1], 6, 0);
        pieces.pawn7 = new Piece("pawn7", "pawn", set.pawn.front, set.pawn.back, pieceRow[1], 7, 0);
        pieces.pawn8 = new Piece("pawn8", "pawn", set.pawn.front, set.pawn.back, pieceRow[1], 8, 0);
    }

    if (existingPieces) {
        pieces.king = new Piece("king", "king", existingPieces.king.front, existingPieces.king.back, existingPieces.king.row, existingPieces.king.column, existingPieces.king.moves);
        pieces.queen = new Piece("queen", "queen", existingPieces.queen.front, existingPieces.queen.back, existingPieces.queen.row, existingPieces.queen.column, existingPieces.queen.moves);
        pieces.rook1 = new Piece("rook1", "rook", existingPieces.rook1.front, existingPieces.rook1.back, existingPieces.rook1.row, existingPieces.rook1.column, existingPieces.rook1.moves);
        pieces.rook2 = new Piece("rook2", "rook", existingPieces.rook2.front, existingPieces.rook2.back, existingPieces.rook2.row, existingPieces.rook2.column, existingPieces.rook2.moves);
        pieces.bishop1 = new Piece("bishop1", "bishop", existingPieces.bishop1.front, existingPieces.bishop1.back, existingPieces.bishop1.row, existingPieces.bishop1.column, existingPieces.bishop1.moves);
        pieces.bishop2 = new Piece("bishop2", "bishop", existingPieces.bishop2.front, existingPieces.bishop2.back, existingPieces.bishop2.row, existingPieces.bishop2.column, existingPieces.bishop2.moves);
        pieces.knight1 = new Piece("knight1", "knight", existingPieces.knight1.front, existingPieces.knight1.back, existingPieces.knight1.row, existingPieces.knight1.column, existingPieces.knight1.moves);
        pieces.knight2 = new Piece("knight2", "knight", existingPieces.knight2.front, existingPieces.knight2.back, existingPieces.knight2.row, existingPieces.knight2.column, existingPieces.knight2.moves);
        pieces.pawn1 = new Piece("pawn1", existingPieces.pawn1.type, existingPieces.pawn1.front, existingPieces.pawn1.back, existingPieces.pawn1.row, existingPieces.pawn1.column, existingPieces.pawn1.moves);
        pieces.pawn2 = new Piece("pawn2", existingPieces.pawn2.type, existingPieces.pawn2.front, existingPieces.pawn2.back, existingPieces.pawn2.row, existingPieces.pawn2.column, existingPieces.pawn2.moves);
        pieces.pawn3 = new Piece("pawn3", existingPieces.pawn3.type, existingPieces.pawn3.front, existingPieces.pawn3.back, existingPieces.pawn3row, existingPieces.pawn3column, existingPieces.pawn3.moves);
        pieces.pawn4 = new Piece("pawn4", existingPieces.pawn4.type, existingPieces.pawn4.front, existingPieces.pawn4.back, existingPieces.pawn4.row, existingPieces.pawn4.column, existingPieces.pawn4.moves);
        pieces.pawn5 = new Piece("pawn5", existingPieces.pawn5.type, existingPieces.pawn5.front, existingPieces.pawn5.back, existingPieces.pawn5.row, existingPieces.pawn5.column, existingPieces.pawn5.moves);
        pieces.pawn6 = new Piece("pawn6", existingPieces.pawn6.type, existingPieces.pawn6.front, existingPieces.pawn6.back, existingPieces.pawn6.row, existingPieces.pawn6.column, existingPieces.pawn6.moves);
        pieces.pawn7 = new Piece("pawn7", existingPieces.pawn7.type, existingPieces.pawn7.front, existingPieces.pawn7.back, existingPieces.pawn7.row, existingPieces.pawn7.column, existingPieces.pawn7.moves);
        pieces.pawn8 = new Piece("pawn8", existingPieces.pawn8.type, existingPieces.pawn8.front, existingPieces.pawn8.back, existingPieces.pawn8.row, existingPieces.pawn8.column, existingPieces.pawn8.moves); 
    }

    
    return pieces;
}

function updateTurn (turn) {
    if (turn === "player2") {
        document.querySelectorAll(".game-turn").forEach(element => {
            element.classList.toggle("hidden");
        })
        document.querySelectorAll(".chess-piece").forEach(element => {
            element.classList.toggle("enabled");
        })
    }
}

function Piece(id, type, front, back, row, column, moves) {
    this.id = id;
    this.type = type;
    this.front = front;
    this.back = back;
    this.row = row;
    this.column = column;
    this.status = "alive";
    this.moves = moves;
    this.move =  function (player) {
        let piece = this;
        pieceMoves = calculateMoves(player, piece);
        enableTiles(pieceMoves);
        attackTiles(pieceMoves);
    }
}

function putPiecesOnBoard(player, pieces) {
    let pieceCounter = 0;

    for (piece in pieces) {
        if(pieceCounter < 16) {
            if (pieces[piece].row > 0 && pieces[piece].column > 0) {
                let chessTile = document.querySelector("#tile-" + pieces[piece].row + pieces[piece].column);
                let chessPiece;
                
                if (player === "player1") {
                    chessPiece = chessTile.addElement("img", "id=" + player + "-" + piece + " class=chess-piece player1-piece enabled", pieces[piece].front);
                } else if (player === "player2") {
                    chessPiece = chessTile.addElement("img", "id=" + player + "-" + piece + " class=chess-piece player2-piece", pieces[piece].back);
                }
                
                chessPiece.draggable="true";
            } else {
                let graveyard = document.querySelector("#" + player + "-graveyard");
                chessPiece = graveyard.addElement("img", "id=" + player + "-" + piece + " class=chess-piece " + player + "-piece", pieces[piece].front);
            }
        }
        pieceCounter++;
    }
}

function enableTiles(pieceMoves){
    pieceMoves.forEach(element => {
        tile = document.querySelector("#tile-" + element);
        if (tile.children.length === 0) {
            tile.addElement("div", "id= class=pulsating-circle");
            tile.classList.add("enabled");
        }
    })
}

function attackTiles(pieceMoves){
    pieceMoves.forEach(element => {
        tile = document.querySelector("#tile-" + element);
        tileChildren = tile.children;
        if (tileChildren.length != 0) {
            for (attribute in tileChildren) {
                if (typeof(tileChildren[attribute]) === "object") {
                    if (tileChildren[attribute].classList.contains("chess-piece")) {
                        if (checkAttackTile(tile)) {
                            tile.addElement("div", "id= class=pulsating-circle-red");
                            tile.classList.add("attack");
                        }
                    }
                }
            }
        }
    })
}

function checkAttackTile (tile) {
    tileChildren = tile.children;
    for (attribute in tileChildren) {
        if (typeof(tileChildren[attribute]) === "object") {
            if (tileChildren[attribute].classList.contains("pulsating-circle-red")) {
                return false;
            }
        }
    }
    return true;
}

function movePiece(newTile, player, piece) {
    if (newTile) {
        let currentTile = document.querySelector("#tile-" + piece.row + piece.column);
        let child = document.querySelector("#" + player + "-" + piece.id);
        let pieceImg = currentTile.removeChild(child);
        newTile.appendChild(pieceImg);
        newTile.appendChild(child);
        updatePiecePosition(piece, newTile.id);
    }
}

function calculateMoves(player, piece){
    let row, column, j;
    switch (piece.type) {
        case "king":
            let kingMoves = [];
            king = piece;
            row = parseInt(king.row);
            column = parseInt(king.column);
            kingMoves.push(String(row + 1) + String(column));
            kingMoves.push(String(row - 1) + String(column));
            kingMoves.push(String(row) + String(column + 1));
            kingMoves.push(String(row) + String(column - 1));
            return checkMoves(player, king, kingMoves);
        case "queen":
            let queenMoves = [];
            queen = piece;
            row = parseInt(queen.row);
            column = parseInt(queen.column);
            j = 1;
            for (let i = row + 1; i < 9; i++) {
                queenMoves.push(String(i) + String(column + j));
                queenMoves.push(String(i) + String(column - j));
                j++;
            }
            j = 1;
            for (let i = row - 1; i > 0; i--) {
                queenMoves.push(String(i) + String(column + j));
                queenMoves.push(String(i) + String(column - j));
                j++;
            }
            for (let i = row + 1; i < 9; i++) {
                queenMoves.push(String(i) + String(column));
            }
            for (let i = row; i > 0; i--) {
                queenMoves.push(String(i) + String(column));
            }
            for (let i = column + 1; i < 9; i++) {
                queenMoves.push(String(row) + String(i));
            }
            for (let i = column - 1; i > 0; i--) {
                queenMoves.push(String(row) + String(i));
            }
            return checkMoves(player, queen, queenMoves);
        case "rook":
            let rookMoves = [];
            rook = piece;
            row = parseInt(rook.row);
            column = parseInt(rook.column);
            for (let i = row + 1; i < 9; i++) {
                rookMoves.push(String(i) + String(column));
            }
            for (let i = row; i > 0; i--) {
                rookMoves.push(String(i) + String(column));
            }
            for (let i = column + 1; i < 9; i++) {
                rookMoves.push(String(row) + String(i));
            }
            for (let i = column - 1; i > 0; i--) {
                rookMoves.push(String(row) + String(i));
            }
            return checkMoves(player, rook, rookMoves);
        case "bishop":
            let bishopMoves = [];
            bishop = piece;
            row = parseInt(bishop.row);
            column = parseInt(bishop.column);
            j = 1;
            for (let i = row + 1; i < 9; i++) {
                bishopMoves.push(String(i) + String(column + j));
                bishopMoves.push(String(i) + String(column - j));
                j++;
            }
            j = 1;
            for (let i = row - 1; i > 0; i--) {
                bishopMoves.push(String(i) + String(column + j));
                bishopMoves.push(String(i) + String(column - j));
                j++;
            }
            return checkMoves(player, bishop, bishopMoves);
        case "knight":
            let knightMoves = [];
            knight = piece;
            row = parseInt(knight.row);
            column = parseInt(knight.column);
            knightMoves.push(String(row + 2) + String(column - 1));
            knightMoves.push(String(row + 2) + String(column + 1));
            knightMoves.push(String(row - 2) + String(column - 1));
            knightMoves.push(String(row - 2) + String(column + 1));
            knightMoves.push(String(row - 1) + String(column + 2));
            knightMoves.push(String(row + 1) + String(column + 2));
            knightMoves.push(String(row - 1) + String(column - 2));
            knightMoves.push(String(row + 1) + String(column - 2));
            return checkMoves(player, knight, knightMoves);
        case "pawn":
            let pawnMoves = [];
            pawn = piece;
            row = parseInt(pawn.row);
            column = parseInt(pawn.column);
            switch (player) {
                case "player1":                
                    if (pawn.moves > 0) {
                        pawnMoves.push(String(row + 1) + String(column));
                    } else {
                        pawnMoves.push(String(row + 1) + String(column));
                        pawnMoves.push(String(row + 2) + String(column));
                    }
                    pawnMoves = pawnDiagonal (pawnMoves, row + 1, column + 1);
                    pawnMoves = pawnDiagonal (pawnMoves, row + 1, column - 1);
                    break;
                case "player2":
                    if (pawn.moves > 0) {
                        pawnMoves.push(String(row - 1) + String(column));
                    } else {
                        pawnMoves.push(String(row - 1) + String(column));
                        pawnMoves.push(String(row - 2) + String(column));
                    }
                    pawnMoves = pawnDiagonal (pawnMoves, row - 1, column + 1);
                    pawnMoves = pawnDiagonal (pawnMoves, row - 1, column - 1);
                    break;
            }
            return checkMoves(player, pawn, pawnMoves);
    }
}

function checkMoves (player, piece, moves) {
    let validatedMoves = [];
    moves.forEach(element => {
        if (validMoves.includes(element)) {
            validatedMoves.push(element);
        }
    }) 

    return checkTiles(player, piece, validatedMoves);
}

function checkTiles(player, piece, moves)  {
    let queenMoves, queenDiagonal;

    if (piece.type === "bishop" || piece.type === "queen") {
        moves = diagonalCollision(player, piece, moves);
    }

    if (piece.type === "king" || piece.type === "queen" || piece.type === "rook" || piece.type === "pawn") {
        moves = verticalCollision(player, piece, moves);
        moves = horizontalCollision(player, piece, moves);
    }
    
    return moves;
}

function updatePiecePosition(piece, tile) {
    let tileId = tile.substring(tile.indexOf("-")+1);
    let newRow = tileId[0];
    let newColumn = tileId[1];
    piece.row = newRow;
    piece.column = newColumn;
    piece.moves++;
}

function pawnDiagonal(pawnMoves, row, column) {
    if (row > 0 && row < 9 && column > 0 && column < 9) {
        let piece = document.querySelector("#tile-" + String(row) + String(column)).children;
        if (piece.length != 0) {
            for (attribute in piece) {
                if (typeof(piece[attribute]) === "object") {
                    if (piece[attribute].classList.contains("chess-piece")) {
                        pawnMoves.push(String(row) + String(column));
                    }
                }
            }
        }
    }
    return pawnMoves;
}

function clearAllyAttacks (player) {
    document.querySelectorAll("." + player + "-piece").forEach(element => {
        let tile = element.parentNode;
        tile.classList.remove("attack");
    })
    document.querySelectorAll(".pulsating-circle-red").forEach(element => {
        let tile = element.parentNode;
        let tileChildren = tile.children;

        for (attribute in tileChildren) {
            if (typeof(tileChildren[attribute]) === "object") {
                if (tileChildren[attribute].classList.contains(player + "-piece")) {
                    element.remove();
                }
            }
        }
    })
}

function finishTurn () {
    clear();
    document.querySelectorAll(".game-turn").forEach(element => {
        element.classList.toggle("hidden");
    })
    document.querySelectorAll(".chess-piece").forEach(element => {
        element.classList.toggle("enabled");
    })

}

function attackPiece (game, tile, player) {
    let tileId = tile.id;
    let tileCode = tileId.substring(tileId.indexOf("-") + 1);
    let row = parseInt(tileCode.substring(0, 1));
    let column = parseInt(tileCode.substring(1));
    let target;

    switch (player) {
        case "player1":
            target = "player2";
            break;
        case "player2":
            target = "player1";
            break;
    }

    let piece = findPiece (game, target, row, column);
    piece.row = 0;
    piece.column = 0;
    piece.status = "dead"; 

    if (piece.type === "king") {
        endgame(player);
    }

    let child = document.querySelector("#" + target + "-" + piece.id);
    let pieceImg = tile.removeChild(child);
    pieceImg.src = piece.front;
    let graveyard = document.querySelector("#" + target + "-graveyard");
    graveyard.appendChild(pieceImg);
}

function findPiece(game, player, row, column) {
    let pieceFound;
    for (piece in game[player]) {
        if (parseInt(game[player][piece].row) === row && parseInt(game[player][piece].column) === column) {
            pieceFound = game[player][piece];
        }
    }
    return pieceFound;
}


function endgame(player) {
    let container = document.querySelector(".container");
    let playerAvatar = document.querySelector("#game-" + player + "-avatar").src;
    let playerName = document.querySelector("#game-" + player + "-name").innerHTML;
    let victoryPanel = feedbackPanel(container);
    victoryPanel.classList.add("victory-panel");
    let feedbackContent = document.querySelector(".feedback-content");
    feedbackContent.classList.add("victory-content");
    let feedbackButton = document.querySelector(".feedbackButton");
    feedbackButton.classList.add("hidden");
    feedbackContent.addElement("img", "id= class=victory-avatar", playerAvatar);
    feedbackContent.addElement("p", "id= class=victory-title", "!" + playerName + " ha ganado!");
    let finishButton = victoryPanel.addElement("button", "id= class=", "Finalizar");
    finishButton.addEventListener("click", function () {
        window.location.href = "./index.html";
    })
}

function checkPawn(player, piece) {
    if (piece.type === "pawn") {
        let row = parseInt(piece.row);
        let column = parseInt(piece.column);
        let move = [];

        move = pawnMove(player, row);
        removePawnAttack(move[0], move[1], column);
        move = pawnMove(player, move[1]);
        removePawnAttack(move[0], move[1], column);
    }
}

function removePawnAttack (target, row, column) {
    if (row < 9 && row > 0 && column < 9 && column > 0) {
        let tile = document.querySelector("#tile-" + row + column);
        let tileChildren = tile.children;
        
        for (attribute in tileChildren) {
            if (typeof(tileChildren[attribute]) === "object") {
                if (tileChildren[attribute].classList.contains(target + "-piece")) {
                    let pulseRed = document.querySelector("#tile-" + row + column + " .pulsating-circle-red");
                    if (pulseRed) {
                        pulseRed.remove();    
                    }
                    tile.classList.remove("attack");
                }
            }
        }
    }
}

function pawnMove (player, row) {
    switch (player) {
        case "player1":
            target = "player2";
            row++;
            break;
        case "player2":
            target = "player1";
            row--;
            break;
    }
    return [target, row];
}

function checkPawnTransform(game, player, pawn) {
    if (pawn.type === "pawn") {
        switch (player) {
            case "player1":
                if (parseInt(pawn.row) === 8) {
                    transformPawn(game[player], player, pawn);
                }
                break;
            case "player2":
                if (parseInt(pawn.row) === 1) {
                    transformPawn(game[player], player, pawn);
                }
            break;
        }
    }
}

function transformPawn (pieces, player, pawn) {
    let container = document.querySelector(".container");
    let feedback = feedbackPanel(container);
    feedback.classList.add("pawn-transform-list");
    let feedbackContent = document.querySelector(".feedback-content");
    feedbackContent.addElement("p", "id= class=", "Selecciona pieza:");
    let transformList = feedbackContent.addElement("ul");
    transformList.addElement("li", "id=transform-queen class=pawn-transform");
    transformList.addElement("li", "id=transform-rook class=pawn-transform");
    transformList.addElement("li", "id=transform-bishop class=pawn-transform");
    transformList.addElement("li", "id=transform-knight class=pawn-transform");

    document.querySelectorAll(".pawn-transform").forEach(element => {
        element.addEventListener("click", function (event) {
            let target = event.target;
            document.querySelectorAll(".pawn-transform").forEach(element => {
                element.classList.remove("transform-selected");
            })
            target.classList.add("transform-selected");
        })
    })

    let feedbackButton = feedback.addElement("button", "id= class=", "Transformar");
    feedbackButton.addEventListener("click", function () {
        let transform = document.querySelector(".transform-selected").id;
        transform = transform.substring(transform.indexOf("-") + 1);
        pawn.type = transform;
        if (transform === "queen") {
            pawn.front = pieces[transform].front;
            pawn.back = pieces[transform].back;
        } else {
            pawn.front = pieces[transform + "1"].front;
            pawn.back = pieces[transform + "1"].back;
        }

        pieceImg = document.querySelector("#tile-" + String(pawn.row) + String(pawn.column) + " .chess-piece");

        switch (player) {
            case "player1":
                pieceImg.src = pawn.front;
                break;
            case "player2":
                pieceImg.src = pawn.back;
                break;
        }

        feedback.remove();
    })
}

function verticalCollision(player, piece, moves) {
    let tileIsOccupied = false;
    let i = parseInt(piece.row) + 1;

    switch (player) {
        case "player1":
            moves.sort();
            break;
        case "player2":
            moves.sort();
            moves.reverse();
            break;
    }
    
    while (!tileIsOccupied && i < 9) {
        tileIsOccupied = document.querySelector("#tile-" + String(i) + String(piece.column) + " .chess-piece");
        if (tileIsOccupied) {
            for (let j = i + 1; j < 9; j++) {
                let position = moves.indexOf(String(j + String(piece.column)));
                if(position > -1) {
                    moves.splice(position, 1);
                }
            }
        }
        i++;
    } 

    tileIsOccupied = false;
    i = parseInt(piece.row) - 1;
    while (!tileIsOccupied && i > 0) {
        tileIsOccupied = document.querySelector("#tile-" + String(i) + String(piece.column) + " .chess-piece");
        if (tileIsOccupied) {
            for (let j = i - 1; j > 0; j--) {
                let position = moves.indexOf(String(j + String(piece.column)));
                if(position > -1) {
                    moves.splice(position, 1);
                }
            }
        }
        i--;
    } 

    return moves;
}

function horizontalCollision(player, piece, moves) {
    let tileIsOccupied = false;
    let i = parseInt(piece.column) + 1;

    switch (player) {
        case "player1":
            moves.sort();
            break;
        case "player2":
            moves.sort();
            moves.reverse();
            break;
    }

    while (!tileIsOccupied && i < 9) {
        tileIsOccupied = document.querySelector("#tile-" + String(piece.row) + String(i) + " .chess-piece");
        if (tileIsOccupied) {
            for (let j = i + 1; j < 9; j++) {
                let position = moves.indexOf(String(String(piece.row) + j));
                if(position > -1) {
                    moves.splice(position, 1);
                }
            }
        }
        i++;
    } 

    tileIsOccupied = false;
    i = piece.column - 1;
    while (!tileIsOccupied && i > 0) {
        tileIsOccupied = document.querySelector("#tile-" + String(piece.row) + String(i) + " .chess-piece");
        if (tileIsOccupied) {
            for (let j = i - 1; j > 0; j--) {
                let position = moves.indexOf(String(String(piece.row) + j));
                if(position > -1) {
                    moves.splice(position, 1);
                }
            }
        }
        i--;
    } 
    return moves;
}

function diagonalCollision(player, piece, moves) {
    let tileIsOccupied = false;
    let i = parseInt(piece.row) + 1;
    let j = parseInt(piece.column) + 1;
    let k = 0;
    let positions = [];

    switch (player) {
        case "player1":
            moves.sort();
            break;
        case "player2":
            moves.sort();
            moves.reverse();
            break;
    }

    while (!tileIsOccupied && i < 9 && j < 9) {
        tileIsOccupied = document.querySelector("#tile-" + String(i) + String(j) + " .chess-piece");
        if (tileIsOccupied) {
            x = i + 1;
            y = j + 1;
            while (x < 9 && y < 9) {
                positions[k] = String(x) + String(y);
                x++;
                y++;
                k++;
            }
        }
        i++;
        j++;
    } 

    tileIsOccupied = false;
    i = parseInt(piece.row) + 1;
    j = parseInt(piece.column) - 1;

    while (!tileIsOccupied && i < 9 && j > 0) {
        tileIsOccupied = document.querySelector("#tile-" + String(i) + String(j) + " .chess-piece");
        if (tileIsOccupied) {
            x = i + 1;
            y = j - 1;

            while (x < 9 && y > 0) {
                positions[k] = String(x) + String(y);
                positions[k];
                x++;
                y--;
                k++;
            }
        }
        i++;
        j--;
    }

    tileIsOccupied = false;
    i = parseInt(piece.row) - 1;
    j = parseInt(piece.column) + 1;
    while (!tileIsOccupied && i > 0 && j < 9) {
        tileIsOccupied = document.querySelector("#tile-" + String(i) + String(j) + " .chess-piece");
        if (tileIsOccupied) {
            x = i - 1;
            y = j + 1;

            while (x > 0 && y < 9) {
                positions[k] = String(x) + String(y);
                x--;
                y++;
                k++;
            }
        }
        i--;
        j++;
    } 

    tileIsOccupied = false;
    i = parseInt(piece.row) - 1;
    j = parseInt(piece.column) - 1;
    while (!tileIsOccupied && i > 0 && j > 0) {
        tileIsOccupied = document.querySelector("#tile-" + String(i) + String(j) + " .chess-piece");
        if (tileIsOccupied) {
            x = i - 1;
            y = j - 1;

            while (x > 0 && y > 0) {
                positions[k] = String(x) + String(y);
                x--;
                y--;
                k++;
            }
        }
        i--;
        j--;
    } 

    positions.forEach(element => {
        let position = moves.indexOf(element);
        moves.splice(position, 1);
    })

    return moves;
}

function clear () {
    document.querySelectorAll(".chess-tile").forEach(element => {
        element.classList.remove("enabled");
        element.classList.remove("attack");
    })
    document.querySelectorAll(".pulsating-circle").forEach(element => {
        element.remove();
    })
    document.querySelectorAll(".pulsating-circle-red").forEach(element => {
        element.remove();
    })
}

function getParameterByName(name) {
    name = name.replace(/[\[]/, "\\[").replace(/[\]]/, "\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
    results = regex.exec(location.search);
    return results === null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
}


