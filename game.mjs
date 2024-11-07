import { ANSI } from "./utils/ansi.mjs";
import KeyBoardManager, {  print, clearScreen } from "./utils/io.mjs";
import SplashScreen from "./game/splash.mjs";
import { FIRST_PLAYER, SECOND_PLAYER } from "./consts.mjs";
import createMenu from "./utils/menu.mjs";
import createMapLayoutScreen from "./game/mapLayoutScreen.mjs";
import createInnBetweenScreen from "./game/innbetweenScreen.mjs";
import createBattleshipScreen from "./game/battleshipsScreen.mjs";
import { setTimeout } from "timers/promises";
import {languageTexts} from "./utils/languages.mjs";

const MAIN_MENU_ITEMS = buildMenu();

const GAME_FPS = 1000 / 60; // The theoretical refresh rate of our game engine
let currentState = null;    // The current active state in our finite-state machine.
let gameLoop = null;        // Variable that keeps a refrence to the interval id assigned to our game loop 
let mainMenuScene = null;
let currentLanguage = 0;

const languageOptions = [
  { language: "English", position: 0 },
  { language: "Norwegian", position: 1 }
];

(function initialize() {
    print(ANSI.HIDE_CURSOR);
    clearScreen();
    mainMenuScene = createMenu(MAIN_MENU_ITEMS);
    SplashScreen.next = mainMenuScene;
    currentState = SplashScreen  // This is where we decide what state our finite-state machine will start in. 
    gameLoop = setInterval(update, GAME_FPS); // The game is started.
})();

function update() {
    if (process.stdout.rows >= 27){
            currentState.update(GAME_FPS);
            currentState.draw(GAME_FPS);
            if (currentState.transitionTo != null) {
                currentState = currentState.next;
                print(ANSI.CLEAR_SCREEN, ANSI.CURSOR_HOME);
            }
        
    } else {
        console.log("Your window is too small");
        process.exit();
    };
}

// Support / Utility functions ---------------------------------------------------------------
function buildMenu(currentLanguage) {
    let menuItemCount = 0;
    if(currentLanguage == 1){
        currentLanguage = 1;
    }else{
        currentLanguage = 0;
    }
    return [
        {
            text: languageTexts[currentLanguage].start_game, id: menuItemCount++, action: function () {
                //openWindow();
                clearScreen();
                let innbetween = createInnBetweenScreen();
                innbetween.init(`SHIP PLACMENT\nFirst player get ready.\nPlayer two look away`, () => {

                    let p1map = createMapLayoutScreen();
                    p1map.init(FIRST_PLAYER, (player1ShipMap) => {

                        let innbetween = createInnBetweenScreen();
                        innbetween.init(`SHIP PLACMENT\nSecond player get ready.\nPlayer one look away`, () => {
                            let p2map = createMapLayoutScreen();
                            p2map.init(SECOND_PLAYER, (player2ShipMap) => {
                                return createBattleshipScreen(player1ShipMap, player2ShipMap);
                            })
                            return p2map;
                        });
                        return innbetween;
                    });

                    return p1map;

                }, 3);
                currentState.next = innbetween;
                currentState.transitionTo = "Map layout";
            }
        },
        { text: languageTexts[currentLanguage].languages, id: menuItemCount++, action: function () {
            (function createLanguageMenu() {
                const languageMenuItems = languageOptions.map((option, index) => ({
                    text: option.language,
                    id: index,
                    action: () => {
                        currentLanguage = option.position;
                        mainMenuScene = createMenu(buildMenu(currentLanguage));
                        currentState.next = mainMenuScene;
                        currentState.transitionTo = "Main Menu";
                    }
                }));

                const languageMenu = createMenu(languageMenuItems);
                currentState.next = languageMenu;
                currentState.transitionTo = "Language Menu";
                })();
            }
        },
        { text: languageTexts[currentLanguage].exit_game, id: menuItemCount++, action: function () { print(ANSI.SHOW_CURSOR); clearScreen(); process.exit(); } },
    ];
}
