import { Game } from "./scenes/game";
import { GameOver } from "./scenes/GameOver";
import { MainMenu } from "./scenes/MainMenu";
import Phaser from "phaser";
import { Preloader } from "./scenes/Preloader";
import { AudioScene } from "./scenes/AudioScene";
// Find out more information about the Game Config at:
// https://docs.phaser.io/api-documentation/typedef/types-core#gameconfig
const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    parent: "game-container",
    backgroundColor: "#028af8",
    physics: {
        default: "arcade",
        arcade: {
            gravity: { y: 300 },
            debug: false,
        },
    },
    scene: [AudioScene, Preloader, MainMenu, Game, GameOver],
    callbacks: {
        preBoot(game) {
            // Config (including defaults) has been created.
            console.log("game config", game.config);
            // 获取当前操作系统信息
            const osList = Object.entries(game.device.os)
                .filter(([, value]) => value === true)
                .map(([key]) => key)
                .join(", ");
            console.log(
                "%c current os: %c" + osList,
                "color: #fff; background: #007acc; padding:2px 6px; border-radius:4px 0 0 4px; font-weight:bold;",
                "color: #fff; background: #28a745; padding:2px 6px; border-radius:0 4px 4px 0;"
            );
        },
        postBoot(game) {
            // Game canvas has been created.
            console.log("game canvas", game.canvas);
        },
    },
};

const StartGame = (parent) => {
    return new Phaser.Game({ ...config, parent });
};

export default StartGame;
