# TinyApp Project

TinyApp is a full stack web application built with Node and Express that allows users to shorten long URLs into unique short URLs (similar to bit.ly)

## Dependencies

- Node.js
- Express
- EJS
- bcryptjs
- cookie-session *** replaces the use of cookie-parser ***
- chai-http *** for app testing purposes ***

## Getting Started

- Install all dependencies (using the `npm install` command)

- Run the development web server using the `node express_server.js` command

- You will be lead to the Login page by default, but will first need to create an account by clicking the link to the Register page in order to use the functionality of the app
![Preview of Register Page](<imgs_for_readme/Register TA.png>)

## Using TinyApp

- After registering or logging in, you can create a new Tiny URL by clicking the 'Create New URL' 
![Preview of the Create TinyURL page](<imgs_for_readme/Create TA.png>)

- Input a valid URL that you wish to shorten and hit submit

- You can view the details about your Tiny URL and update the URL on the individual Tiny URL page
![Preview of Tiny URL page](<imgs_for_readme/Tiny Page TA.png>)

- You can manage your Tiny URLs on the main My URLs page. You can delete or edit your URLs from here
![Preview of My URLs page](<imgs_for_readme/My URLs TA.png>)

- Only the user who created the URL may Edit or Delete it, but anyone can access the Long URL ID from the Short URL ID generated 