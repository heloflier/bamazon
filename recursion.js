// function factorial(num) {
//   if (num < 0) {
//     return -1;
//   } else if (num == 0) {
//    return 1;
//   }

//   var tmp = num;

//   while (num-- > 2) {
//     tmp *= num;
//   }
//   return tmp;
// }

// function factorial(num) {
// 	if (num < 0) {
// 		return -1;
// 	} else if (num == 0) {
// 	 return 1;
// 	} else {
//     return (num * factorial(num - 1));
//   }
// }

// var result = factorial(8);
// document.write(result);

// //


// function stuff(things) {
//   var moreThings = things;
//   function moreStuff {
//     things + moreThings;
//   }
// }

function sum(x, y) {
  if (y > 0) {
    console.log('x', x);
    console.log('y', y);

    return sum(x + 1, y - 1);
  } else {
    return x;
  }
}

sum (1, 100000);