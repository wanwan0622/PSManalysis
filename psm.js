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
        dict_data.push(tmp_dict);
    }
    console.log(max_price);
    console.log(dict_data);
}

main(require("fs").readFileSync("/dev/stdin", "utf8"));
