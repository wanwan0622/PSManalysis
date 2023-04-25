function main(input) {
    const args = input.split("\n");
    const nums = args.map((n) => n.split(","));
  //   console.log(nums);
    const headers = nums[0];      // csvファイルのヘッダー
  //   console.log(headers);
    const num_sample = nums.length - 2;   // サンプル数
  //   console.log(num_sample);
    const dict_data = [];
    for (let i=1; i<=num_sample; i++) {
        let tmp_dict = new Array();
        for (let j=0; j<headers.length; j++) {
            tmp_dict[headers[j]] = nums[i][j];
        }
        dict_data.push(tmp_dict);
    }
    console.log(dict_data);
  }
  
  main(require("fs").readFileSync("/dev/stdin", "utf8"));
  