console.log(1);
function test() {
  return new Promise((resolve) => {
    console.log("Test function");
    resolve();
  });

}

async function test5() {
  console.log("Before");
  await test();
  console.log("After");
}
test5();