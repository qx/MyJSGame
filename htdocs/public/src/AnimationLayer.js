/**
 * Created by ok on 14-8-10.
 */
var AnimationLayer = cc.Scene.extend({
    spriteSheet: null,
    runningAction: null,
    sprite: null,
    ctor:function () {
        this._super();
        this.init();
    },
    init:function () {
        this._super();
        // create sprite sheet
        cc.spriteFrameCache.addSpriteFrames(res.runner_plist);
        this.spriteSheet = cc.SpriteBatchNode.create(res.runner_png);
        this.addChild(this.spriteSheet);


        // init runningAction
        var animFrames = [];
        for (var i = 0; i < 8; i++) {
            var str = "runner" + i + ".png";
            var frame = cc.spriteFrameCache.getSpriteFrame(str);
            animFrames.push(frame);
        }

        var animation = cc.Animation.create(animFrames, 0.1);
        this.runningAction = cc.RepeatForever.create(cc.Animate.create(animation));
        this.sprite = cc.Sprite.create("#runner0.png");
        this.sprite.attr({x:80, y:85});
        this.sprite.runAction(this.runningAction);
        this.spriteSheet.addChild(this.sprite);
//        var centerPos = cc.p(80, 85);
//        //cerate the hero sprite
//        var spriteRunner = cc.Sprite.create(res.runnning_plist);
//        spriteRunner.setPosition(centerPos);
//
//        //create the move action
//        var actionTo = cc.MoveTo.create(2, cc.p(300, 85));
//        spriteRunner.runAction(cc.Sequence.create(actionTo));
//        this.addChild(spriteRunner);
    }
});