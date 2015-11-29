# posthtml-web-component

[PostHTML](https://github.com/posthtml/posthtml) plugin for Server Side Web Component Render.

## Feature

- Base Web Component Server Side Rending
- Component as Sevice

## Advantage

## Explanation

### Web Component

Must mention that `Web Components` supported by `posthmlt-web-compoent` don't completely follow the [Web Components](http://www.w3.org/TR/components-intro/) draft.

A typical posthtml web compnent look as following:

```html
<!-- clock.html -->
<style>
  .clock {
    display: inline-flex;
    justify-content: space-around;
    background: white;
    font-size: 8rem;
    box-shadow: 2px 2px 4px -1px grey;
    border: 1px solid green;
    font-family: Helvetica, sans-serif;
    width: 100%;
  }
  .clock .hour,
  .clock .minute,
  .clock .second {
    color: orange;
    padding: 1.5rem;
    text-shadow: 0px 2px black;
  }
</style>
<div class="clock">
  <div class="hour">HH</div>
  <div class="minute">MM</div>
  <div class="second">SS</div>
</div>
<script>
(function() {
  Array.prototype.forEach.call(document.querySelectorAll('.clock'), function (clock) {
    var hourElement = clock.querySelector('.hour'),
      minuteElement = clock.querySelector('.minute'),
      secondElement = clock.querySelector('.second');

    window.setInterval(function() {
      var date = new Date();
      hourElement.innerText = date.getHours();
      minuteElement.innerText = date.getMinutes();
      secondElement.innerText = date.getSeconds();
    }, 1000);
  })
})()
</script>
```

This is a runable component itself. Consider There is a `index.html`:

```
html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title></title>
    <link rel="import" href="./clock.html">
  </head>
  <body>
    <clock></clock>
    <clock></clock>
  </body>
</html>
```

After `posthtml-web-component`'s transforming:

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title></title>
    <link rel="import" href="./clock.html">
    <style>
      .clock {
        display: inline-flex;
        justify-content: space-around;
        background: white;
        font-size: 8rem;
        box-shadow: 2px 2px 4px -1px grey;
        border: 1px solid green;
        font-family: Helvetica, sans-serif;
        width: 100%;
      }
      .clock .hour,
      .clock .minute,
      .clock .second {
        color: orange;
        padding: 1.5rem;
        text-shadow: 0px 2px black;
      }
    </style>
  </head>
  <body>
    <div class="clock">
      <div class="hour">HH</div>
      <div class="minute">MM</div>
      <div class="second">SS</div>
    </div>
    <div class="clock">
      <div class="hour">HH</div>
      <div class="minute">MM</div>
      <div class="second">SS</div>
    </div>
    <script>
    (function() {
      Array.prototype.forEach.call(document.querySelectorAll('.clock'), function (clock) {
        var hourElement = clock.querySelector('.hour'),
          minuteElement = clock.querySelector('.minute'),
          secondElement = clock.querySelector('.second');

        window.setInterval(function() {
          var date = new Date();
          hourElement.innerText = date.getHours();
          minuteElement.innerText = date.getMinutes();
          secondElement.innerText = date.getSeconds();
        }, 1000);
      })
    })()
    </script>
  </body>
</html>
```

Work fine!

### LinkImport

We have two type `LinkImport`, local and remote.

```html
<!-- local LinkImport -->
<link rel="import" href="hello-world.html">

<!-- remote LinkImport -->
<link rel="import" href="http://example.com/hello-world.html">
```

The difference of these two type is remote `LinkImport` could call an remote service, this is to say remote `LinkImport` could be dynamic.

### Custom Element

For the remote `LinkImport`, The attributes on it could be pass to the remote dynamic service, so you have more control on Custom Element.

```html
<link rel="import" href="http://example.com/hello-world.html">

<hello-world who='PostHTML'></hello-world>

<!--http://example.com/hello-world.html?who=PostHTML could return-->
<div class="hello-world">hello PostHTML!</div>
```
