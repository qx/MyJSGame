/**
 * Created by ok on 14-8-11.
 */
var OFFSET_X = 0,
    OFFSET_Y = 160,
    ROW = COL = 8,
    BLOCK_W = 60,
    BLOCK_H = 60,
    BLOCK_XREGION = 60,
    BLOCK_YREGION = 60,
    OFFSET_ODD = 0,
    BLOCK1_RECT = cc.rect(0, 0, BLOCK_W, BLOCK_H),
    BLOCK2_RECT = cc.rect(BLOCK_W, 0, BLOCK_W, BLOCK_H),
    PLAYER_W = 66,
    PLAYER_H = 118,
    PLAYER_OX = 0,
    MOVING_OY = 118,
    TRAPPED_OY = 0,
    START_UI_SIZE = cc.size(256, 454),
    FAIL_UI_SIZE = cc.size(292, 277),
    WIN_UI_SIZE = cc.size(308, 276);
//var BackgroundGridLayer = cc.Scene.extend({
//    ctor: function () {
//        this._super();
//        this.init();
//    },
//
//    init: function () {
//        this._super();
//        var winsize = cc.director.getWinSize();
//        //create the background image and position it at the center of screen
//        var centerPos = cc.p(winsize.width / 2, winsize.height / 2);
//        var spriteBG = cc.Sprite.create(res.PlayBG_png);
//        spriteBG.setPosition(centerPos);
//        this.addChild(spriteBG);
//    }
//});
var BackgroundGridLayer = cc.Layer.extend({
    blocks: null,
    batch: null,
    block_tex: null,
    player: null,
    player_r: 4,
    player_c: 4,
    moving_action: null,
    trapped_action: null,
    active_blocks: null,
    trapped: false,
    inited: false,
    active_nodes: null,
    step: 0,

    ctor: function () {
        this._super();

        this.anchorX = 0;
        this.anchorY = 0;
        this.active_nodes = [];
        this.active_blocks = [];
        for (var r = 0; r < ROW; r++) {
            this.active_blocks.push([]);
            for (var c = 0; c < COL; c++) {
                this.active_blocks[r][c] = false;
            }
        }

        this.blocks = new cc.Layer();
        this.blocks.x = OFFSET_X;
        this.blocks.y = OFFSET_Y;
        this.addChild(this.blocks);

        this.batch = new cc.SpriteBatchNode(res.hit_init, 64);
        this.block_tex = this.batch.texture;
        var ox = x = y = 0, odd = false, block, tex = this.batch.texture;
        for (var r = 0; r < ROW; r++) {
            y = BLOCK_YREGION * r;
            ox = odd * OFFSET_ODD;
            for (var c = 0; c < COL; c++) {
                x = ox + BLOCK_XREGION * c;
                block = new cc.Sprite(tex, cc.rect(0, 0, BLOCK_W, BLOCK_H));
                block.attr({
                    anchorX: 0,
                    anchorY: 0,
                    x: x,
                    y: y,
                    width: BLOCK_W,
                    height: BLOCK_H
                });
                this.batch.addChild(block);
            }
//            odd = !odd;
        }
//        this.blocks.begin();
//        this.batch.visit();
//        this.blocks.end();
        this.blocks.addChild(this.batch);
        this.blocks.bake();
//
//        tex = cc.textureCache.addImage(res.player);
//        var frame,
//            rect = cc.rect(0, 0, PLAYER_W, PLAYER_H),
//            moving_frames = [], trapped_frames = [];
//        for (var i = 0; i < 6; i++) {
//            rect.x = PLAYER_OX + i * PLAYER_W;
//            frame = new cc.SpriteFrame(tex, rect);
//            trapped_frames.push(frame);
//        }
//        rect.y = MOVING_OY;
//        for (var i = 0; i < 4; i++) {
//            rect.x = PLAYER_OX + i * PLAYER_W;
//            frame = new cc.SpriteFrame(tex, rect);
//            moving_frames.push(frame);
//        }
//
//        var moving_animation = new cc.Animation(moving_frames, 0.2);
//        this.moving_action = cc.animate(moving_animation).repeatForever();
//        var trapped_animation = new cc.Animation(trapped_frames, 0.2);
//        this.trapped_action = cc.animate(trapped_animation).repeatForever();
//
//        this.player = new cc.Sprite(moving_frames[0]);
//        this.addChild(this.player, 10);

        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ALL_AT_ONCE,
            onTouchesBegan: function (touches, event) {
                var touch = touches[0];
                var pos = touch.getLocation();
                cc.log("clicked:" + pos.x + "(:)" + pos.y);
                var target = event.getCurrentTarget();
                cc.log("clicked result:" + !target.inited);
                if (!target.inited) return;

                pos.y -= OFFSET_Y;
                var r = Math.floor(pos.y / BLOCK_YREGION);
                pos.x -= OFFSET_X + (r % 2 == 1) * OFFSET_ODD;
                var c = Math.floor(pos.x / BLOCK_XREGION);
                if (c >= 0 && r >= 0 && c < COL && r < ROW) {
                    if (target.activateBlock(r, c)) {
                        target.step++;
                        cc.log("clicked move:" + target.step);

//                        target.movePlayer();
                    }
                }
            }
        }, this);
        this.initGame();
    },

    initGame: function () {


        if (this.inited) return;

//        this.player_c = this.player_r = 4;
        this.step = 0;

        for (var i = 0, l = this.active_nodes.length; i < l; i++) {
            this.active_nodes[i].removeFromParent();
        }
        this.active_nodes = [];
        for (var r = 0; r < ROW; r++) {
            for (var c = 0; c < COL; c++) {
                this.active_blocks[r][c] = false;
            }
        }

        this.randomBlocks();

//        this.player.attr({
//            anchorX: 0.5,
//            anchorY: 0,
//            x: OFFSET_X + BLOCK_XREGION * this.player_c + BLOCK_W / 2,
//            y: OFFSET_Y + BLOCK_YREGION * this.player_r - 5
//        });
//        this.player.stopAllActions();
//        this.player.runAction(this.moving_action);

        this.inited = true;
    },

    randomBlocks: function () {
        var nb = Math.round(cc.random0To1() * 13) + 7, r, nbc;
        cc.log("nb  ==" + nb);
        for (var i = 0; i < nb; i++) {
            r = Math.floor(cc.random0To1() * 8);
            c = Math.floor(cc.random0To1() * 8);
            this.activateBlock(r, c);
        }
    },

    activateBlock: function (r, c) {
        if (!this.active_blocks[r][c]) {
//            var block = new cc.Sprite(this.block_tex, BLOCK1_RECT);
            var block = new cc.Sprite(res.hit_, BLOCK1_RECT);
            block.attr({
                anchorX: 0,
                anchorY: 0,
                x: OFFSET_X + (r % 2 == 1) * OFFSET_ODD + BLOCK_XREGION * c,
                y: OFFSET_Y + BLOCK_YREGION * r,
                width: BLOCK_W,
                height: BLOCK_H
            });
            cc.log("block==" + block);
            this.active_nodes.push(block);
            this.addChild(block, 2);
            this.active_blocks[r][c] = true;
            return true;
        }
        return false;
    },

    movePlayer: function () {
        var r = this.player_r, c = this.player_c, result = -1, temp;
        temp = getDistance(r, c, l_choices, this.active_blocks, hori_passed, 0);
        //console.log(temp[2]);
        if (result == -1 || (temp != -1 && temp[2] < result[2]))
            result = temp;
        temp = getDistance(r, c, t_choices, this.active_blocks, vert_passed, 0);
        //console.log(temp[2]);
        if (result == -1 || (temp != -1 && temp[2] < result[2]))
            result = temp;
        temp = getDistance(r, c, b_choices, this.active_blocks, vert_passed, 0);
        //console.log(temp[2]);
        if (result == -1 || (temp != -1 && temp[2] < result[2]))
            result = temp;
        temp = getDistance(r, c, r_choices, this.active_blocks, hori_passed, 0);
        //console.log(temp[2]);
        if (result == -1 || (temp != -1 && temp[2] < result[2]))
            result = temp;
        reinit_passed(hori_passed);
        reinit_passed(vert_passed);

        if (result == -1) {
            if (!this.trapped) {
                this.trapped = true;
                this.player.stopAction(this.moving_action);
                this.player.runAction(this.trapped_action);
            }

            if (!this.active_blocks[r][c - 1])
                this.player_c = c - 1;
            else if (!this.active_blocks[r][c + 1])
                this.player_c = c + 1;
            else {
                var odd = (r % 2 == 1);
                var dr = r - 1, tr = r + 1, nc = c + (odd ? 0 : -1);

                if (!this.active_blocks[dr][nc]) {
                    this.player_r = dr;
                    this.player_c = nc;
                }
                else if (!this.active_blocks[dr][nc + 1]) {
                    this.player_r = dr;
                    this.player_c = nc + 1;
                }
                else if (!this.active_blocks[tr][nc]) {
                    this.player_r = tr;
                    this.player_c = nc;
                }
                else if (!this.active_blocks[tr][nc + 1]) {
                    this.player_r = tr;
                    this.player_c = nc + 1;
                }
                // WIN
                else {
                    gameScene.addChild(layers.winUI);
                    this.inited = false;
                }
            }
        }
        // LOST
        else if (result[2] == 0) {
            gameScene.addChild(layers.loseUI);
            this.inited = false;
        }
        else {
            this.player_r = result[0];
            this.player_c = result[1];
        }
        this.player.attr({
            anchorX: 0.5,
            anchorY: 0,
            x: OFFSET_X + (this.player_r % 2 == 1) * OFFSET_ODD + BLOCK_XREGION * this.player_c + BLOCK_W / 2,
            y: OFFSET_Y + BLOCK_YREGION * this.player_r - 5
        });
        //console.log(result);
    }
});
