const assert = require("assert");

/**
 * header1とheader2のグラフの交点の座標を求める関数
 * @param {dict} rateData 割合が入った辞書
 * @param {string} header1 安い、安すぎるのいずれか
 * @param {string} header2 高い、高すぎるのいずれかで、header1で選んでいないもの
 * @param {number} diff 何円単位で集計したか。x座標のステップ数
 * @return {number | null} x 交点のx座標
 * @return {number | null} y 交点のy座標
**/
function getIntersection(rateData, header1, header2, diff) {
    // 関数の呼び出しのタイミングで引数がおかしいときは、nullを返す
    if (!(header1 === "安い" || header1 === "安すぎる")) return [null, null];
    if (!(header2 === "高い" || header2 === "高すぎる")) return [null, null];
    
    let intersection = -1;
    for (let i=0; i<rateData.length; i++) {
        // y座標の大小関係が反転するタイミングを見つける
        if (rateData[i][header1] <= rateData[i][header2]) {
            intersection = i;
            break;
        }
    }
    // 必ずグラフの交点は存在するので、intersectionが-1から更新されていない場合はエラーを出す
    assert.notStrictEqual(intersection, -1);

    // PDF9枚目の図と同じ座標の関係
    const x1 = (intersection - 1) * diff;
    const x3 = x1;
    const x2 = (intersection) * diff;
    const x4 = x2;
    const y3 = rateData[intersection-1][header1];
    const y1 = rateData[intersection-1][header2];
    const y4 = rateData[intersection][header1];
    const y2 = rateData[intersection][header2];
    
    // 交点の座標
    const x = (((y3 - y1) * (x1 - x2) * (x3 - x4)) + (x1 * (y1 - y2) * (x3 - x4)) - (x1 * (y3 - y4) * (x1 - x2))) / (((y1 - y2) * (x3 - x4)) - ((x1 - x2) * (y3 - y4)));
    const y = (x * (y1 - y2) / (x1 - x2)) + y1 - (x1 * ((y1 - y2) / (x1 - x2)));

    return [x, y];
}

function main(input) {
    // データの入力受け取り
    const args = input.split("\n");
    const nums = args.map((n) => n.split(","));
    const headers = nums[0];      // csvファイルのヘッダー
    const numSample = nums.length - 2;   // サンプル数

    // データの整形
    const dictData = [];
    let maxPrice = 0;    // csvに書かれている金額の最大値
    for (let i=1; i<=numSample; i++) {
        let tmpDict = new Array();
        for (let j=0; j<headers.length; j++) {
            let num = Number(nums[i][j]);
            tmpDict[headers[j]] = num;
            if (j !== 0 && num >= maxPrice) {
                maxPrice = num;
            }
        }
        if (tmpDict !== undefined) dictData.push(tmpDict);
    }
    
    // 割合を求める
    const diff = 50;     // 何円単位で集計するか(ここを変えると結果の正確さが変わる)
    const rateData = [];
    for (let price=diff; price<=maxPrice; price+=diff) {
        let tmpRate = new Array();
        for (let i=1; i<=4; i++) {
            tmpRate[headers[i]] = 0;
        }
        for (let i=0; i<numSample; i++) {
            if (dictData[i]["高い"] <= price) tmpRate["高い"]++;
            if (dictData[i]["安い"] >= price) tmpRate["安い"]++;
            if (dictData[i]["高すぎる"] <= price) tmpRate["高すぎる"]++;
            if (dictData[i]["安すぎる"] >= price) tmpRate["安すぎる"]++;
        }
        for (let i=1; i<=4; i++) {
            tmpRate[headers[i]] /= (numSample / 100);
        }
        rateData.push(tmpRate);
    }

    // 出力(小数第1位で四捨五入)
    const saiko = getIntersection(rateData, "安い", "高すぎる", diff);
    console.log("最高価格　　　　", Math.round(saiko[0]).toString()+"円");
    const dakyo = getIntersection(rateData, "安い", "高い", diff);
    console.log("妥協価格　　　　", Math.round(dakyo[0]).toString()+"円");
    const riso = getIntersection(rateData, "安すぎる", "高すぎる", diff);
    console.log("理想価格　　　　", Math.round(riso[0]).toString()+"円");
    const hosyo = getIntersection(rateData, "安すぎる", "高い", diff);
    console.log("最低品質保証価格", Math.round(hosyo[0]).toString()+"円");
}

main(require("fs").readFileSync("/dev/stdin", "utf8"));
