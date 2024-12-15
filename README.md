# StormHaven

## Description

Homebuyers face difficult choices when deciding where to purchase property, especially in regions prone to natural disasters. In light of the recent devastating hurricanes that impacted states on the East Coast of the United States, this application will offer users a tool to make well-informed decisions, balancing housing prices with disaster risks. By integrating real estate listings with disaster data from FEMA, our tool will provide actionable insights into affordability and safety tailored to each user’s criteria. 

## Directories

App.js: Sets up the routing for the app, defining which components should be displayed for each URL path. It imports Dashboard, FindHouses, FindHouses, and DisasterRisks and uses React Router to handle navigation between these pages.

Dashboard.js: Displays an overview of relevant disaster and housing information. 

FindHouses.js: Allows users to filter properties based on criteria such as property id, city, state, price, number of bedrooms/bathrooms, and acre size. Users can click the property id for more detailed information about the house PropertyCard.js. Users can also toggle which properties they want to favorite on this page. 

DisasterRisks.js: Displays a list of disaster events - users can search based on disaster id, number, type code, city, and designated date. To view disaster trends, users can scroll down to view the number of disasters per type code by year. 

PropertyCard.js: When clicking on property information, this card displays the property id, city, state, price, number of bedrooms/bathrooms, and acre size. Additionally, users can view the history of all disasters that have impacted the house's location. We also list the total number of disasters and the most recent disaster that has impacted the property. 

Favorites.js: On this page, users can view the properties they had favorited on the FindHouses.js page. We have provided a button to allow users to remove properties from this list, and also a resizable notes box for users to add a description of the property (the favorited properties and their notes will be saved when the user reloads the page).

PageNavbar.js: Reusable navigation bar used across different pages. Renders navigation links for each page and highlights the active page.

## Instructions

The node modules required for the client and the server are currently not downloaded (files are too large to be stored on GitHub). To ensure they work, we must go through the following process:

### Client

First, open up a new terminal in the VSCode project. Then run the following to navigate into the client:

    cd client

We then run the following:

    npm install --legacy-peer-deps

Finally, start the client:

    npm start

### Server

Next, open up a separate terminal in the VSCode project. Then run the following to navigate into the server:

    cd server

We then run the following:

    npm install

Finally, start the server:

    npm start
