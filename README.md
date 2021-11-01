## Project Name
#### Simply Phresh

An application that allows the user to add meals to their cart, add their name and address and returns a receipt of the items along with
a dummy expected time. Built with React, Context, JavaScript, and CSS.

## Project Status

This project is currently still in development, User can add items to cart, checkout, and order. Functionality to display the receipt is in progress.

## Project Screen Shots
![Picture of application featuring food](https://github.com/CharliePine22/react-simply-fresh/blob/main/github-screenshot-1.png?raw=true "Simply Fresh")

## Installation and Setup Instructions
Clone down this repository. You will need node and npm installed globally on your machine.
Installation:

`npm install`

To Start Server:

`npm start`  

To Visit App:

`localhost:3000/`  

## Reflection
This was a weekend project built while taking Maximilian Schwarzmüller "React - The Complete Guide (incl Hooks, React Router, Redux)". Project goals included using the languages that we were learning up until that point and familiarizing myself with Async functions by fetching and retrieving data. The name Phresh stems from an old Social Media handle that's a play on the word Fresh.

In the class, we had a very basic design and stopped after sending the data, but I wanted to be sure that i really understood hooks and side effects from fetching the data, so I decided to implement a receipt component as well as create a dummy time to represent the order time and order pickup/delivery time.

One of the main challenges I ran into was dealing with errors stemming from input verification. I solved this by learning how to create custom hooks. I built a hook that implemented different verification techniques and would affect the input style accordingly.
