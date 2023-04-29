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
    const num_sample = nums.length - 2;   // サンプル数
    // console.log(num_sample);

    // データの整形
    const dict_data = [];
    let max_price = 0;    // csvに書かれている金額の最大値
    for (let i=1; i<=num_sample; i++) {
        let tmp_dict = new Array();
        for (let j=0; j<headers.length; j++) {
            let num = Number(nums[i][j]);
            tmp_dict[headers[j]] = num;
            if (j !== 0 && num >= max_price) {
                max_price = num;
            }
        }
        if (tmp_dict !== undefined) dict_data.push(tmp_dict);
    }
    // console.log(max_price);
    // console.log(dict_data);
    // console.log(dict_data[0]["高い"]);
    
    // 割合を求める
    const diff = 50;     // 何円単位で集計するか
    const rate_data = new Array();
    for (let price=diff; price<=max_price; price+=diff) {
        let tmp_rate = new Array();
        for (let i=1; i<=4; i++) {
            tmp_rate[headers[i]] = 0;
        }
        for (let i=0; i<num_sample; i++) {
            if (dict_data[i]["高い"] <= price) tmp_rate["高い"]++;
            if (dict_data[i]["安い"] >= price) tmp_rate["安い"]++;
            if (dict_data[i]["高すぎる"] <= price) tmp_rate["高すぎる"]++;
            if (dict_data[i]["安すぎる"] >= price) tmp_rate["安すぎる"]++;
        }
        for (let i=1; i<=4; i++) {
            tmp_rate[headers[i]] /= (num_sample / 100);
        }
        rate_data[price] = tmp_rate;
    }
    console.log(rate_data);
}

main(require("fs").readFileSync("/dev/stdin", "utf8"));
