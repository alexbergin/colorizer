# Colorizer

A javascript library that can apply a multiply color filter to images

## Usage

Include `colorizer.js` in your `head`
    
    <script src="colorizer.js"></script>
    
Then add a `color` attribute to images you want to color

    <img src="example.jpeg" alt="this is our example image" color="ff0000" />
    
When the page loads, all images with the color attribute will have their color applied. If the color attribute is changed or removed, colorizer js will update the image to the new color or original image respectivly.

## Commands

While all you need to do to apply a color multiply filter is set the color attribute in the image, there are a few commands you can issue to modify how colorizer.js runs. 

------------

### color

The color attribute can be defined in RGB:

    <img src="example.jpeg" color="rgb(255,0,0)" />

or hex:

    <img src="example.jpeg" color="#ff0000" />

Color formated as RGB is not space sensitive and hex doesn't require the leading pound symbol.
    
------------

### rate

If `int` is not defined, `colorizer.rate()` will return the current rate at which colorizer.js checks for image color updates in milliseconds. If `int` is defined, then the current rate is set to that number.

    colorizer.rate( int );

The default check rate is `16` milliseconds.
    
------------

### start

This starts the functions in `colorizer`.
    
    colorizer.start();

------------

### stop

Running stop halts the process of checking for color attribute updates. It does not delete the original base image.

    colorizer.stop();
    
------------

### active

This returns a boolean for the current running state of colorizer; `true` for running, `false` for halted.

    colorizer.active();
    
------------