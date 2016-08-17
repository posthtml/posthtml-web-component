# posthtml-web-component

[![npm version](https://badge.fury.io/js/posthtml-web-component.svg)](https://badge.fury.io/js/posthtml-web-component)
[![Build Status](https://travis-ci.org/island205/posthtml-web-component.svg?branch=master)](https://travis-ci.org/island205/posthtml-web-component?branch=master)
[![Coverage Status](https://coveralls.io/repos/island205/posthtml-web-component/badge.svg?branch=master)](https://coveralls.io/github/island205/posthtml-web-component)

[PostHTML](https://github.com/posthtml/posthtml) plugin for Server Side Web Component Render.

## Feature

- Base Web Component Server Side Rending
- Component as a Sevice

## Advantage

## Explanation

### Web Component

Must mention that `Web Components` supported by `posthmlt-web-component` don't completely follow the [Web Components](http://www.w3.org/TR/components-intro/) draft.

A typical posthtml web component looks as following:

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

This is a runnable component itself. Consider there is a `index.html`:

```html
<!-- index.html -->
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

We have two types of `LinkImport`, local and remote.

```html
<!-- local LinkImport -->
<link rel="import" href="hello-world.html">

<!-- remote LinkImport -->
<link rel="import" href="http://example.com/hello-world.html">
```

The difference of these two types is that remote `LinkImport` could call a remote service, this is to say remote `LinkImport` could be dynamic.
