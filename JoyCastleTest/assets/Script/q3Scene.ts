
const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.Button)
    private btn: cc.Button = null;
    @property(cc.Sprite)
    private btnBg: cc.Sprite = null;


    // onLoad () {}

    start() {

        this.btn.node.opacity = 0;


        this.btn.node.on(cc.Node.EventType.TOUCH_START, () => {
            this.btnBg.spriteFrame = this.btn.pressedSprite;
        });
        this.btn.node.on(cc.Node.EventType.TOUCH_END, () => {
            this.btnBg.spriteFrame = this.btn.normalSprite;
        });
        this.btn.node.on(cc.Node.EventType.TOUCH_CANCEL, () => {
            this.btnBg.spriteFrame = this.btn.normalSprite;
        });


        cc.tween(this.btn.node)
            .repeatForever(cc.tween()
                // .to(0.5, { scaleX: 1.05, scaleY: 1 },)
                // .to(0.5, { scaleX: 1, scaleY: 1.05 },)
                // .to(0.5, { scaleX: 1.05, scaleY: 1 }, cc.easeBounceInOut())
                // .to(0.5, { scaleX: 1, scaleY: 1.05 }, cc.easeBounceInOut())
                .to(0.5, { scaleX: 1.05, scaleY: 1 }, cc.easeQuadraticActionOut())
                .to(0.5, { scaleX: 1, scaleY: 1.05 }, cc.easeQuadraticActionOut())

            )
            .start();
    }

    // update (dt) {}

    /********************************************************************/

    private onBtnClickListener() {

        cc.tween(this.btn.node)
            .to(0.2, { opacity: 255, angle: -1, scale: 1.1 }, cc.easeQuarticActionIn())
            .to(0.1, { opacity: 255, angle: 0, scale: 1 }, cc.easeBounceInOut())
            .start();

    }
}
