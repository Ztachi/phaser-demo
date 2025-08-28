/*
 * @Author: ztachi(legendryztachi@gmail.com)
 * @Date: 2025-08-22 11:48:16
 * @LastEditors: ztachi(legendryztachi@gmail.com)
 * @LastEditTime: 2025-08-25 12:08:11
 * @FilePath: /my-phaser-game/src/game/scenes/MainMenu.js
 * @Description:
 */
import { EventBus } from "../EventBus";
import { Scene } from "phaser";
import { AUDIO_EVENTS } from "../../const/audioEvents";

export class MainMenu extends Scene {
    logoTween;
    logo;

    constructor() {
        super("MainMenu");
    }

    create() {
        this.add.image(400, 300, "sky");
        this.logo = this.add.image(400, 300, "logo");

        this.moveLogo();

        this.add
            .text(400, 400, "Press Enter to start", {
                fontSize: "32px",
                fill: "#ffffff",
            })
            .setOrigin(0.5);

        this.input.keyboard.on("keydown-ENTER", this.changeScene, this);

        // 发送音频事件 - 进入主菜单时停止背景音乐
        EventBus.emit(AUDIO_EVENTS.BGM_STOP);

        EventBus.emit("current-scene-ready", this);
    }

    changeScene() {
        this.logoTween.stop();
        this.logoTween = null;
        this.input.keyboard.off("keydown-ENTER", this.changeScene, this);
        this.scene.start("Game");
    }

    moveLogo(vueCallback) {
        if (this.logoTween) {
            if (this.logoTween.isPlaying()) {
                this.logoTween.pause();
            } else {
                this.logoTween.play();
            }
        } else {
            this.logoTween = this.tweens.add({
                targets: this.logo,
                x: { value: 400, duration: 3000, ease: "Back.easeInOut" },
                y: { value: 250, duration: 1500, ease: "Sine.easeOut" },
                yoyo: true,
                repeat: -1,
                onUpdate: () => {
                    vueCallback &&
                        vueCallback({
                            x: Math.floor(this.logo.x),
                            y: Math.floor(this.logo.y),
                        });
                },
            });
        }
    }
}

