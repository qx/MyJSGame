/**
 * Created by ok on 14-8-11.
 */
var GridLayer = cc.Scene.extend({
    ctor:function () {
        this._super();
    },
    title:function () {
        return "No title";
    },
    subtitle:function () {
        return "";
    },
    onRestartCallback:function (sender) {
        var s = new NodeTestScene();
        s.addChild(restartNodeTest());
        director.runScene(s);
    },
    onNextCallback:function (sender) {
        var s = new NodeTestScene();
        s.addChild(nextNodeTest());
        director.runScene(s);
    },
    onBackCallback:function (sender) {
        var s = new NodeTestScene();
        s.addChild(previousNodeTest());
        director.runScene(s);
    },
    // automation
    numberOfPendingTests:function () {
        return ( (arrayOfNodeTest.length - 1) - nodeTestSceneIdx );
    },

    getTestNumber:function () {
        return nodeTestSceneIdx;
    }
});