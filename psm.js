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
    if (!(header1 === "安い" || header1 === "安すぎる")) return [null, null];
    if (!(header2 === "高い" || header2 === "高すぎる")) return [null, null];
    
    let intersection = -1;
    for (let i=0; i<rateData.length; i++) {
        if (rateData[i][header1] <= rateData[i][header2]) {
            intersection = i;
            break;
        }
    }
    console.log(intersection);
    assert.notStrictEqual(intersection, -1);    // 絶対に交わるので
    const x1 = (intersection - 1) * diff;
    const x3 = x1;
    const x2 = (intersection) * diff;
    const x4 = x2;
    const y3 = rateData[intersection-1][header1];
    const y1 = rateData[intersection-1][header2];
    const y4 = rateData[intersection][header1];
    const y2 = rateData[intersection][header2];
    // const x1 = 0; const x2 = 2; const x3 = 0; const x4 = 2;
    // const y1 = 0; const y2 = 2; const y3 = 2; const y4 = 0
    
    const x = (((y3 - y1) * (x1 - x2) * (x3 - x4)) + (x1 * (y1 - y2) * (x3 - x4)) - (x1 * (y3 - y4) * (x1 - x2))) / (((y1 - y2) * (x3 - x4)) - ((x1 - x2) * (y3 - y4)));
    const y = (x * (y1 - y2) / (x1 - x2)) + y1 - (x1 * ((y1 - y2) / (x1 - x2)));
    console.log(x, y);
    return [x, y];
}

function main(input) {
    // データの入力受け取り
    const args = input.split("\n");
    const nums = args.map((n) => n.split(","));
    // console.log(nums);
    const headers = nums[0];      // csvファイルのヘッダー
    // console.log(headers);
    const numSample = nums.length - 2;   // サンプル数
    // console.log(numSample);

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
    // console.log(maxPrice);
    // console.log(dictData);
    // console.log(dictData[0]["高い"]);
    
    // 割合を求める
    const diff = 50;     // 何円単位で集計するか
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
    // console.log(rateData);
}

main(require("fs").readFileSync("/dev/stdin", "utf8"));
