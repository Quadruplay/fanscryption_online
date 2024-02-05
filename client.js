addEventListener("DOMContentLoaded", async () => {
    let gameCanvas = document.getElementById("game");
    gameCanvas.width = window.innerWidth;
    gameCanvas.height = window.innerHeight;
    let gameCtx = gameCanvas.getContext("2d");
    gameCtx.imageSmoothingEnabled = false;

    let backgroundCanvas = document.getElementById("background");
    backgroundCanvas.width = window.innerWidth;
    backgroundCanvas.height = window.innerHeight;
    let backgroundCtx = backgroundCanvas.getContext("2d");
    backgroundCtx.imageSmoothingEnabled = false;

    class Card {
        constructor(data) {
            for (let key of Object.keys(data)) {
                this[key] = data[key];
            }
            this.sprite = new OffscreenCanvas(44, 58);
            this.spriteCtx = this.sprite.getContext("2d");
            this.updateImage = async () => {
                return new Promise(async (resolve, reject) => {
                    await generateCardImage(this, this.spriteCtx).then(() => {
                        resolve();
                    });
                });
            }
            this.updateImage();
        }
    }

    async function generateCardImage(data, cardCtx) {
        return new Promise((resolve, reject) => {
            cardCtx.clearRect(0, 0, 44, 58);
            if (data.rarity == "rare" && data.terrain == true) {
                cardCtx.drawImage(cardDeco["empty_rare_terrain"], 0, 0);
            } else if (data.rarity == "rare") {
                cardCtx.drawImage(cardDeco["empty_rare"], 0, 0);
            } else if (data.terrain == true) {
                cardCtx.drawImage(cardDeco["empty_terrain"], 1, 1);
            } else {
                cardCtx.drawImage(cardDeco["empty"], 1, 1);
            }

            cardCtx.drawImage(portraits[data.spriteID], 2, 2);

            cardCtx.drawImage(cardInfo["stat_" + data.attack], 3, 49);
            cardCtx.drawImage(cardInfo["stat_" + data.health], 36, 49);

            switch (data.cost.type) {
                case "blood":
                    cardCtx.drawImage(cardInfo["blood" + data.cost.amount], 18, 2);
                    break;
                case "bones":
                    cardCtx.drawImage(cardInfo["bone" + data.cost.amount], 18, 2);
                    break;
            }

            switch (data.sigils.length) {
                case 1:
                    cardCtx.drawImage(sigils[data.sigils[0]], 14, 32);
                    break;
                case 2:
                    cardCtx.drawImage(sigils[data.sigils[0]], 5, 32);
                    cardCtx.drawImage(sigils[data.sigils[1]], 23, 32);
                    break;
            }

            if (data.merged) {
                cardCtx.drawImage(cardDeco["stitches"], 20, 2);
            }

            if (data.rarity == "rare") {
                switch (data.scribe) {
                    case "alchemy":
                        cardCtx.drawImage(cardDeco["rare_frame_alchemy"], 0, 0);
                        break;
                    case "nature":
                        cardCtx.drawImage(cardDeco["rare_frame_nature"], 0, 0);
                        break;
                    case "tech":
                        cardCtx.drawImage(cardDeco["rare_frame_tech"], 0, 0);
                        break;
                    case "undead":
                        cardCtx.drawImage(cardDeco["rare_frame_undead"], 0, 0);
                        break;
                    case "wizard":
                        cardCtx.drawImage(cardDeco["rare_frame_wizard"], 0, 0);
                        break;
                }
            }

            resolve();
        });
    }

    async function loadParseJSON(path) {
        return new Promise((resolve, reject) => {
            fetch(path)
                .then(response => response.json())
                .then(data => resolve(data))
                .catch(err => reject(err));
        });
    }

    const cardDecoList = ["back", "empty_rare_terrain", "empty_rare", "empty_terrain",
                            "empty", "rare_frame_alchemy", "rare_frame_nature", "rare_frame_tech",
                            "rare_frame_undead", "rare_frame_wizard", "submerge", "stitches"];

    const cardInfoList = ["alchemy_elixir0", "alchemy_elixir1", "alchemy_elixir2", "alchemy_elixir3",
                            "alchemy_elixir4", "alchemy_elixir5", "alchemy_elixir6", "alchemy_elixir7",
                            "alchemy_elixir8", "alchemy_elixir9", "alchemy_elixir10", "alchemy_empty",
                            "alchemy_flesh0", "alchemy_flesh1", "alchemy_flesh2", "alchemy_flesh3",
                            "alchemy_flesh4", "alchemy_flesh5", "alchemy_flesh6", "alchemy_flesh7",
                            "alchemy_flesh8", "alchemy_flesh9", "alchemy_flesh10", "alchemy_metal0",
                            "alchemy_metal1", "alchemy_metal2", "alchemy_metal3", "alchemy_metal4",
                            "alchemy_metal5", "alchemy_metal6", "alchemy_metal7", "alchemy_metal8",
                            "alchemy_metal9", "alchemy_metal10", "blood1", "blood2", "blood3", "blood4",
                            "bone1", "bone2", "bone3", "bone4", "bone5", "bone6", "bone7", "bone8",
                            "bone9", "bone10", "bone11", "bone12", "bone13", "energy1", "energy2",
                            "energy3", "energy4", "energy5", "energy6", "mana1", "mana2", "mana3",
                            "mana4", "mox_blue_blue", "mox_blue_green_orange", "mox_blue_green",
                            "mox_blue_orange", "mox_blue_white", "mox_blue", "mox_green_green",
                            "mox_green_orange", "mox_green_white", "mox_green", "mox_orange_orange",
                            "mox_orange_white", "mox_orange", "mox_white_white", "mox_white", "stat_0",
                            "stat_1", "stat_2", "stat_3", "stat_4", "stat_5", "stat_6", "stat_7", "stat_8",
                            "stat_9", "stat_bones", "stat_blood", "stat_ants"]

    const sigilList = ["activated_dealdamage","activated_dicerollbone","activated_dicerollenergy","activated_drawskeleton",
                        "activated_energytobones","activated_heal","activated_sacrificedraw","activated_statsup",
                        "activated_statsupenergy","bombspawner","bonedigger","brittle","buffgems","buffneighbours",
                        "conduitbuffattack","conduitenergy","conduithealing","conduitspawner","createegg","deathshield",
                        "deathtouch","doubledeath","doublestrike","drawant","drawcopy","drawcopyondeath","drawnewhand",
                        "drawrabbits","droprubyondeath","evolve","explodeondeath","explodeondeath_flipped","flying",
                        "gainattackonkill","gainbattery","gaingem_all","gaingem_blue","gaingem_green","gaingem_orange",
                        "gemdependant","gemsdraw","guarddog","hydraegg","icecube","loot","morsel","opponentbones","ourodeath",
                        "preventattack","quadruplebones","blockflying","sacrificial","sentry","sharp","skeletonstrafe","splitstrike",
                        "squirrelstrafe","steeltrap","stinky","strafe","strafepush","strafeswap","submerge","tentacle",
                        "tripleblood","tristrike","tutor","whackamole"];

    async function loadImage(path) {
        return new Promise((resolve, reject) => {
            let img = new Image();
            img.src = path;
            img.onload = () => resolve(img);
            img.onerror = err => reject(err);
        });
    }

    let techCards = {};
    let wizardCards = {};
    let natureCards = {};
    let undeadCards = {};
    let alchemyCards = {};
    let portraits = {};
    let cardDeco = {};
    let cardInfo = {};
    let sigils = {};

    await new Promise((resolve, reject) => {
        loadParseJSON("/data/cards/list.json").then(data => {
            data.nature.forEach(async (card, index) => {
                natureCards[card] = await loadParseJSON(`/data/cards/nature/${card}.json`);
                portraits[card] = await loadImage(`/assets/portraits/nature/${card}.png`);
                if (index == data.nature.length - 1) resolve();
            });
        });
    });

    {
        let array = [];
        let obj = {};
        for (let key of Object.keys(natureCards)) {
            array.push([key, natureCards[key].rarity]);
        }
        array.sort((a, b) => {
            return a[1] > b[1] ? 1 : -1;
        });
        array.forEach((card, index) => {
            obj[card[0]] = natureCards[card[0]];
        });
        natureCards = obj;
    }

    await new Promise((resolve, reject) => {
        let amount = 0;
        cardDecoList.forEach(async (deco, index) => {
            cardDeco[deco] = await loadImage(`/assets/card_deco/${deco}.png`);
            amount++;
        });
        let interval = setInterval(() => {
            if (amount == cardDecoList.length) {
                clearInterval(interval);
                resolve();
            }
        }, 10);
    });

    await new Promise((resolve, reject) => {
        let amount = 0;
        cardInfoList.forEach(async (info, index) => {
            cardInfo[info] = await loadImage(`/assets/card_info/${info}.png`);
            amount++;
        });
        let interval = setInterval(() => {
            if (amount == cardInfoList.length) {
                clearInterval(interval);
                resolve();
            }
        }, 10);
    });

    await new Promise((resolve, reject) => {
        let amount = 0;
        sigilList.forEach(async (sigil, index) => {
            sigils[sigil] = await loadImage(`/assets/sigils/${sigil}.png`);
            amount++;
        });
        let interval = setInterval(() => {
            if (amount == sigilList.length) {
                clearInterval(interval);
                resolve();
            }
        }, 10);
    });

    // let i = 0;
    // for (let key of Object.keys(natureCards)) {
    //     let card = new Card(natureCards[key]);
    //     let y;
    //     switch (card.rarity) {
    //         case "side":
    //             y = 0;
    //             break;
    //         case "common":
    //             y = 58;
    //             break;
    //         case "rare":
    //             y = 116;
    //             break;
    //         case "token":
    //             y = 174;
    //             break;
    //     }
    //     gameCtx.drawImage(card.sprite, i*58, y);
    //     i++;
    // }

    const socket = io('http://localhost:3000');

    let sessionID = socket.id;

    backgroundCtx.fillStyle = "#d7e2a3";
    backgroundCtx.fillRect(0, 0, window.innerWidth, window.innerHeight);

    let loginAreaX = window.innerWidth / 2 - 200;
    let loginAreaY = window.innerHeight / 2 - 200;
    let passwordAreaX = loginAreaX;
    let passwordAreaY = loginAreaY + 100;
    let areaWidth = 400;
    let areaHeight = 50;

    backgroundCtx.fillStyle = "#ffffff";
    backgroundCtx.strokeStyle = "#000000";
    backgroundCtx.fillRect(loginAreaX, loginAreaY, areaWidth, areaHeight);
    backgroundCtx.strokeRect(loginAreaX, loginAreaY, areaWidth, areaHeight);
    backgroundCtx.fillRect(passwordAreaX, passwordAreaY, areaWidth, areaHeight);
    backgroundCtx.strokeRect(passwordAreaX, passwordAreaY, areaWidth, areaHeight);

    socket.on('id', (message) => {
      gameCtx.fillText(message, 10, 10);
    });

});