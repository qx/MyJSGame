/**
 * Created by ok on 14-8-10.
 */
var PlayScene = cc.Scene.extend({
    onEnter:function() {
        this._super();
        this.addChild(new BackgroundGridLayer());
        this.addChild(new GridLayer());

//        this.addChild(new BackgroundLayer());
//        this.addChild(new AnimationLayer());
//        this.addChild(new StatusLayer());
    }
});