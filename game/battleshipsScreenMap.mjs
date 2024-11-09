import { FIRST_PLAYER, GAME_BOARD_DIM } from "../consts.mjs";
import { ANSI } from "../utils/ansi.mjs";
import { print, clearScreen } from "../utils/io.mjs";
import units from "./units.mjs";
import KeyBoardManager from "../utils/io.mjs";
import { create2DArrayWithFill } from "../utils/array.mjs"

ANSI.SEA__AND_SHIPS_HIT = '\x1b[38;5;83;48;5;39m';
ANSI.SEA = '\x1b[48;5;39m';


function createBattleshipMapLayout() {

    const MapLayout = {
        player: null,
        isPlayerReady: false,
        opponentBoard: null,
        isDrawn: false,
        next: null,
        transitionTo: null,
        cursorColumn: 0,
        cursorRow: 0,
        map: create2DArrayWithFill(GAME_BOARD_DIM),
        areasShot: [],

        init: function (player, opponentBoard) {
            this.player = player;
            this.opponentBoard = opponentBoard;
        },

        canAttack: function () {
            const ship = this.ships[this.currentShipIndex];
            const size = ship.size;

            if (this.cursorColumn > GAME_BOARD_DIM) {
                return false;
            } else if (this.cursorRow > GAME_BOARD_DIM) {
                    return false;
            }

            return true;
        },

        attackOpponentBoard: function (x, y) {
            const hit = this.opponentBoard[y][x] !== 0;
            const miss = this.opponentBoard[y][x] == 0;

            if(hit){
                this.areasShot.push({x, y, hit});
            }else if(miss){
                this.areasShot.push({x, y, miss});
            }

        },

        isPositionInMarkerPreview: function (column, row) {
            if (this.cursorRow > GAME_BOARD_DIM || this.cursorColumn || GAME_BOARD_DIM) return false;

            this.cursorRow = row;
            this.cursorColumn = column;
        },


        update: function (dt) {

            if (KeyBoardManager.isUpPressed()) {
                this.cursorRow = Math.max(0, this.cursorRow - 1);
                this.isDrawn = false;
            }
            if (KeyBoardManager.isDownPressed()) {
                this.cursorRow = Math.min(GAME_BOARD_DIM - 1, this.cursorRow + 1);
                this.isDrawn = false;
            }
            if (KeyBoardManager.isLeftPressed()) {
                this.cursorColumn = Math.max(0, this.cursorColumn - 1);
                this.isDrawn = false;
            }
            if (KeyBoardManager.isRightPressed()) {
                this.cursorColumn = Math.min(GAME_BOARD_DIM - 1, this.cursorColumn + 1);
                this.isDrawn = false;
            }

            if(KeyBoardManager.isEnterPressed() && !this.isPlayerReady) {
                this.isPlayerReady = true;
            }else if (KeyBoardManager.isEnterPressed() && this.isPlayerReady){
                const targetX = this.cursorColumn;
                const targetY = this.cursorRow;
                this.attackOpponentBoard(targetX, targetY);
            }
        },

        draw: function (dr) {

            if (this.isDrawn == true) { return; } // We do not want to draw if there is no change. 
            this.isDrawn = true;

            clearScreen();


            let output = `${ANSI.TEXT.BOLD}${ANSI.COLOR.YELLOW}Battleship game\n\n${ANSI.TEXT.BOLD_OFF}${ANSI.RESET}`;

            output += '  ';
            for (let i = 0; i < GAME_BOARD_DIM; i++) {
                output += ` ${String.fromCharCode(65 + i)}`; // ASCII code 65 is A, so 65 +1 = 66 -> B
            }
            output += '\n';

            for (let y = 0; y < GAME_BOARD_DIM; y++) {

                output += `${String(y + 1).padStart(2, ' ')} `;

                for (let x = 0; x < GAME_BOARD_DIM; x++) {
                    const cell = this.map[y][x];
                    const isInPlaceablePreview = this.isPositionInMarkerPreview(x, y);

                    if (isInPlaceablePreview && this.canAttack()) {
                        // Show ship preview in red
                        output += ANSI.COLOR.GREEN + 'X' + ANSI.RESET + ' ';
                    } else if (isInPlaceablePreview) {
                        // Show ship priview in white if it cant be placed. 
                        output += ANSI.COLOR.WHITE + 'X' + ANSI.RESET + ' ';
                    }
                    else if (cell !== 0) {
                        // Show placed ships
                        output += ANSI.SEA__AND_SHIPS_HIT + cell + ANSI.RESET + ' ';
                    } else {
                        // Show waterz
                        output += ANSI.SEA + ' ' + ANSI.RESET + ' ';
                    }
                }
                output += `${y + 1}\n`;
            }

            output += '  ';
            for (let i = 0; i < GAME_BOARD_DIM; i++) {
                output += ` ${String.fromCharCode(65 + i)}`;
            }
            output += '\n\n';

            output += `${ANSI.TEXT.BOLD}${ANSI.COLOR.YELLOW}Controls:${ANSI.TEXT.BOLD_OFF}${ANSI.RESET}\n`;
            output += 'Arrow keys: Move cursor\n';
            output += 'Enter: Attack\n';

            print(output);
        }




    }

    return MapLayout;
}



export default createBattleshipMapLayout;