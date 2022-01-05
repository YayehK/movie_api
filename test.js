console.log('Hello Node!');

console.log('Goodbye!');

setTimeout(() => {
    debugger; // execution will pause on this line
  
    console.log('world');
  }, 3000);

  console.log('hello');

