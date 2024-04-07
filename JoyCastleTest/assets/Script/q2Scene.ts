// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.EditBox)
    private aEdit: cc.EditBox = null;
    @property(cc.EditBox)
    private bEdit: cc.EditBox = null;
    @property(cc.EditBox)
    private vEdit: cc.EditBox = null;


    @property(cc.Label)
    private label: cc.Label = null;



    // LIFE-CYCLE CALLBACKS:

    // onLoad () {}

    start() {

    }

    // update (dt) {}

    /********************************************************************/
    private onBtnClickListener(): void {

        let aStrArr = this.aEdit.string.split(`,`);
        let bStrArr = this.bEdit.string.split(`,`);
        let vValue: number = parseInt(this.vEdit.string);

        let res = aStrArr.some((value: string) => {
            return bStrArr.some((v: string) => {
                return parseInt(value) + parseInt(v) == vValue;
            });
        });

        this.label.string = `结果：${res}`;
    }

    /********************************************************************/

    // 时间复杂度分析
    // 最好情况，O(n)
    // 最坏情况，O(n2)
}
