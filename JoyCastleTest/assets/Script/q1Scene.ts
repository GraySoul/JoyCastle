
const { ccclass, property } = cc._decorator;

@ccclass
export default class NewClass extends cc.Component {

    @property(cc.EditBox)
    private xEdit: cc.EditBox = null;
    @property(cc.EditBox)
    private yEdit: cc.EditBox = null;

    @property([cc.Color])
    private colorArr: cc.Color[] = [];

    @property(cc.Node)
    private content: cc.Node = null;
    @property(cc.Node)
    private contentText: cc.Node = null;
    @property(cc.Prefab)
    private itemPrefab: cc.Prefab = null;

    @property({ type: cc.Float, tooltip: `(m, n - 1)或(m - 1, n)增加的概率` })
    private add1Per: number = 0.1;
    @property({ type: cc.Float, tooltip: `(m, n - 1)和(m - 1, n)同色，增加的概率` })
    private add2Per: number = 0.05;

    private colorResPre: number[] = null;
    private mn1PosColor: Record<string, number> = {};
    private m1nPosColor: Record<string, number> = {};

    // onLoad () {}

    start() {

    }

    // update (dt) {}

    /********************************************************************/
    private onCreateBtnClickListener() {

        if (this.xEdit == null || this.xEdit.string == null || this.yEdit == null || this.yEdit.string == null)
            return;
        let x = parseInt(this.xEdit.string);
        let y = parseInt(this.yEdit.string);

        if (isNaN(x) || isNaN(y))
            return;


        if (!this.checkPos(cc.v2(x, y))) {
            if (alert) alert(`坐标值超出范围，在 0~10之内`);
            return;
        }

        this.content.removeAllChildren();
        this.contentText.removeAllChildren();

        let mn1 = cc.v2(x, y - 1),
            m1n = cc.v2(x - 1, y);

        mn1 = this.checkPos(mn1) ? mn1 : null;
        m1n = this.checkPos(m1n) ? m1n : null;

        let mn1ColorIdx = mn1 ? this.getRandomColorIdx() : -1;
        let m1nColorIdx = m1n ? this.getRandomColorIdx() : -1;

        this.setColorPer(mn1ColorIdx, m1nColorIdx, mn1, m1n);

        this.generateFunc();
    }
    /********************************************************************/

    private generateFunc() {

        for (let i = 0; i < 10; ++i) {
            for (let j = 0; j < 10; ++j) {

                let node: cc.Node = cc.instantiate(this.itemPrefab);
                node.color = this.getColor(i + 1, j + 1);
                this.content.addChild(node);

                let nodeText: cc.Node = new cc.Node(),
                    nodeTextLabel: cc.Label = nodeText.addComponent(cc.Label);

                nodeText.anchorX = nodeText.anchorY = 0.5;
                nodeText.color = cc.Color.BLACK;
                nodeTextLabel.fontSize = 10;
                nodeTextLabel.string = `(${i + 1},${j + 1})`;
                nodeTextLabel.cacheMode = cc.Label.CacheMode.CHAR;

                this.scheduleOnce(() => {
                    nodeText.x = node.x;
                    nodeText.y = node.y - node.height / 2;
                    this.contentText.addChild(nodeText);
                }, 0.1);
            }
        }

    }

    private setColorPer(mn1ColorIdx: number, m1nColorIdx: number, mn1: cc.Vec2, m1n: cc.Vec2): void {

        if (mn1ColorIdx == -1 && m1nColorIdx == -1)
            return;

        let basePer = 1 / this.colorArr.length, res = [], num = 0;

        cc.log(`mn1ColorIdx => ` + mn1ColorIdx);
        cc.log(`m1nColorIdx => ` + m1nColorIdx);

        if (mn1ColorIdx == m1nColorIdx) {
            res[mn1ColorIdx] = this.add2Per;
            num = 1;
            this.mn1PosColor = { x: mn1.x, y: mn1.y, c: mn1ColorIdx };
            this.m1nPosColor = { x: m1n.x, y: m1n.y, c: m1nColorIdx };
        } else {
            if (mn1ColorIdx != -1) {
                res[mn1ColorIdx] = this.add1Per + basePer;
                ++num;
                this.mn1PosColor = { x: mn1.x, y: mn1.y, c: mn1ColorIdx };
            }

            if (m1nColorIdx != -1) {
                res[m1nColorIdx] = this.add1Per + basePer;
                ++num;
                this.m1nPosColor = { x: m1n.x, y: m1n.y, c: m1nColorIdx };
            }
        }

        let totalPre = 0;
        for (let i = 0, length = res.length; i < length; ++i) {
            if (!isNaN(res[i])) totalPre += res[i];
        }

        let otherPre = (1 - totalPre) / (this.colorArr.length - num)

        cc.log(`otherPre => ` + otherPre);

        for (let i = 0, length = this.colorArr.length; i < length; ++i) {
            if (res[i] == null) res[i] = otherPre;
        }

        cc.log(`res => ` + res);

        this.colorResPre = res;
    }

    private checkPos(p: cc.Vec2): boolean {

        if (p == null) return false;

        if (p.x < 1 || p.x > 10 || p.y < 0 || p.y > 10)
            return false;
        return true;
    }

    private getRandomColorIdx(): number {
        return Math.floor(Math.random() * this.colorArr.length);
    }

    private getColorIdx() {

        let i = 0, weights = this.colorResPre.concat();

        for (let length = weights.length; i < length; ++i)
            weights[i] += weights[i - 1] || 0;

        let random = Math.random() * weights[weights.length - 1];

        for (i = 0; i < weights.length; i++)
            if (weights[i] > random) break;

        cc.log(`getColorIdx idx = > ${i}`);

        return i;
    }

    private getColor(x: number, y: number): cc.Color {

        let idx = 0;

        switch (true) {
            case x == 1 && y == 1:
                idx = this.getRandomColorIdx();
                break;

            case this.mn1PosColor.x == x && this.mn1PosColor.y == y:
                idx = this.mn1PosColor.c;
                break;
            case this.m1nPosColor.x == x && this.m1nPosColor.y == y:
                idx = this.m1nPosColor.c;
                break;

            default:
                idx = this.getColorIdx();
                break;
        }

        return this.colorArr[idx];
    }
}

