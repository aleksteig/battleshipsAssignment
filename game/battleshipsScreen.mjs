import { GAME_BOARD_DIM, FIRST_PLAYER, SECOND_PLAYER } from "../consts.mjs";
import KeyBoardManager, { print } from "../utils/io.mjs";
import createBattleshipMapLayout from "./battleshipsScreenMap.mjs";

const createBattleshipScreen = () => {

    let currentPlayer = FIRST_PLAYER;
    let firstPlayerBoard = null;
    let secondPlayerBoard = null;
    let firstPlayerGuessBoard = null;
    let secondPlayerGuessBoard = null;


    function swapPlayer() {
        currentPlayer *= -1;
        if (currentPlayer == FIRST_PLAYER) {
            currentBoard = firstPlayerBoard;
            oponentBoard = secondPlayerBoard;
        } else {
            currentBoard = secondPlayerBoard;
            oponentBoard = firstPlayerBoard;
        }
    }



    return {
        isDrawn: false,
        next: null,
        transitionTo: null,


        init: function (firstPBoard, secondPBoard) {
            firstPlayerBoard = firstPBoard;
            secondPlayerBoard = secondPBoard;
            firstPlayerGuessBoard = createBattleshipMapLayout(currentPlayer, secondPBoard);
            secondPlayerGuessBoard = createBattleshipMapLayout(currentPlayer *= -1, secondPBoard);
        },

        update: function (dt) {
            //this.isDrawn = false;
            if(KeyBoardManager.isEnterPressed()){
                const targetX = cursorRow;
                const targetY = cursorColumn;

                const hit = oponentBoard.attack(targetX, targetY);

                if (hit){

                } else {
                    swapPlayer();
                }



            }
        },

        draw: function (dr) {
            if (this.isDrawn == false) {
                this.isDrawn = true;
                print(firstPlayerGuessBoard);

            }
        }

    }
}



export default createBattleshipScreen;