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
