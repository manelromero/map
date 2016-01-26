# Map project
This is a map example for my [Udacity](http://www.udacity.com) Front End Web Developer Nanodegree.

## Download portfolio
* Click this button to download the portfolio.

[![button](https://raw.github.com/manelromero/game/master/images/download.png)](https://github.com/manelromero/mobile-portfolio/archive/master.zip)

* Copy the `.zip` file to the folder where you want the portfolio.
* Uncompress the `.zip` file.
* Open the `index.html`file in the `dist` folder with your favorite browser.

## Optimizations

### Portfolio
1. Reduced `pizzeria.jpg`image size
2. Add JavasCript code inside `index.html`file
3. Inline CSS code
4. Add JavasCript code for Google Font instead of `link` in the `<head>` section

### Pizzeria
1. Deleted `determineDX()` and `sizeSwitcher()` functions
2. Rewrite `changePizzasSizes()` function to stop calling the DOM inside a loop, creating `randomPizzas` object
3. In `updatePositions` function, created `top` variable out of the `for` loop, so `phase` variable inside the `for` loop doesn't have to access the DOM
4. When pizzas are appended to `pizzasDiv` using `.appendChild`, moved the access to the DOM out of the `for` loop
5. Changed `document.querySelector()` for `document.getElementById()` which is faster
6. Changed `document.querySelectorAll()` for `document.getElementsByClassName()` which is faster
7. Created `randomPizzasLength` variable outside the `for` loop, so the array's length property is not accessed to check its value at each iteration
8. Changed the number of `movingPizzas` generated, depending on `window.innerHeight`
