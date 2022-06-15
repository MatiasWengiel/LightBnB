# LightBnB

A basic BnB rental website created as a Lighthouse Labs assignment by Matias Wengiel. The focus of this project was creating SQL queries and linking the back-end to the database. All student work was done on `database.js`, `pglink.js` and `queryBuilderFunctions.js`, the rest of the code was provided.

## Project Structure

```
├── public
│   ├── index.html
│   ├── javascript
│   │   ├── components 
│   │   │   ├── header.js
│   │   │   ├── login_form.js
│   │   │   ├── new_property_form.js
│   │   │   ├── property_listing.js
│   │   │   ├── property_listings.js
│   │   │   ├── search_form.js
│   │   │   └── signup_form.js
│   │   ├── index.js
│   │   ├── libraries
│   │   ├── network.js
│   │   └── views_manager.js
│   └── styles
├── sass
└── server
  ├── apiRoutes.js
  ├── database.js
  ├── pglink.js
  ├── queryBuilderFunctions.js
  ├── json
  ├── server.js
  └── userRoutes.js
```

* `public` contains all of the HTML, CSS, and client side JavaScript. 
  * `index.html` is the entry point to the application. It's the only html page because this is a single page application.
  * `javascript` contains all of the client side javascript files.
    * `index.js` starts up the application by rendering the listings.
    * `network.js` manages all ajax requests to the server.
    * `views_manager.js` manages which components appear on screen.
    * `components` contains all of the individual html components. They are all created using jQuery.
* `sass` contains all of the sass files. 
* `server` contains all of the server side and database code. 
  * `apiRoutes.js` and `userRoutes.js` are responsible for any HTTP requests to `/users/something` or `/api/something`. 
  * `database.js` is responsible for all queries to the database. Currently connects to a psql database hosted on localhost.
  * `pglink.js` is the access point to the database (note: credentials are stored in plain text for ease of use for the grader for this project. If this were real production code, they would be stored in a separate file that is .gitignore'd).
  * `queryBuilderFunctions.js` contains helper functions for building DRYer queries.
  * `server.js` is the entry point to the application. This connects the routes to the database.
  * DEPRECATED: `json` is a directory that contains a dummy data in `.json` files.
