# Taproot Hero Image Block

A plugin that demonstrates the Gutenberg APIs to create a custom block for setting up a page or post's Hero image with an overlay and some rich text content. I started with the core Gutenberg block "Cover Image" and modified the code to work in the context of the Create Guten Block build tool.  

## Dependencies

To run as a WordPress plugin requires the [Gutenberg feature plugin](https://github.com/WordPress/gutenberg) in order to work. 

## Usage

The hero image block configured in the Gutenberg interface will be filtered out of `the_content`. To output the block markup in your template, use the `tr_print_hero_image_block();` function. 

This is currently meant only as a demonstration and learning project, but may evolve into a production ready plugin at some point. 

## Modification

This project was bootstrapped with [Create Guten Block](https://github.com/ahmadawais/create-guten-block).

To install npm dependencies, run `npm install`

To make your own modifications and build after editing, install the Create Guten Block tool above, and use the below commands to develop and build.

### 👉  `npm start`
- Use to compile and run the block in development mode.
- Watches for any changes and reports back any errors in your code.

### 👉  `npm run build`
- Use to build production code for your block inside `dist` folder.
- Runs once and reports back the gzip file sizes of the produced code.

### 👉  `npm run eject`
- Use to eject your plugin out of `create-guten-block`.
- Provides all the configurations so you can customize the project as you want.
- It's a one-way street, `eject` and you have to maintain everything yourself.
- You don't normally have to `eject` a project because by ejecting you lose the connection with `create-guten-block` and from there onwards you have to update and maintain all the dependencies on your own.