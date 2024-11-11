# StormHaven

## Description

Homebuyers face difficult choices when deciding where to purchase property, especially in regions prone to natural disasters. In light of the recent devastating hurricanes that impacted states on the East Coast of the United States, this application will offer users a tool to make well-informed decisions, balancing housing prices with disaster risks. By integrating real estate listings with disaster data from FEMA, our tool will provide actionable insights into affordability and safety tailored to each user’s criteria. 

## Directories

App.js: Sets up the routing for the app, defining which components should be displayed for each URL path. It imports Dashboard, FindHouses, PropertySearch, and DisasterRisks and uses React Router to handle navigation between these pages.

Dashboard.js: Displays an overview of relevant disaster and housing information. 

DisasterRisks.js: Displays a list of disaster events and affected properties. Users can search based on disaster type, date, and location.

PropertySearch.js: Alows users to filter properties based on criteria such as location, price, number of bedrooms/bathrooms, and disaster type.

PageNavbar.js: Reusable navigation bar used across different pages. Renders navigation links for each page and highlights the active page.
