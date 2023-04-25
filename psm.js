function main(input) {
    const args = input.split("\n");
    const nums = args.map((n) => n.split(","));
  //   console.log(nums);
    const headers = nums[0];      // csvファイルのヘッダー
    console.log(headers);
    const num_sample = nums.length - 2;   // サンプル数
    console.log(num_sample);
  }
  
  main(require("fs").readFileSync("/dev/stdin", "utf8"));
