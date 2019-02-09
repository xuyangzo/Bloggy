# Bloggy

Bloggy is a Blog Engine powered by various web technologes including but not limited to React, Node, MongoDB, Express, Cloudinary and Redis. It has following functionalities:

- Complete and secure CMS with encrytion, full access to dashboard
- Basic workflow of a blog editor including create/delete/edit/forward blog posts
- Complete comment system with onsite message board and like/dislike/favorite
- Complete search filter and global search with autocompletion
- For more details please refer to the documentation below

### Preparation

Bloggy requires predefined `.env` file to start building
Below is one example of the `.env` file
You need to modify the `.example.env` file based on this and rename it to `.env`

```
MONGO_URI=mongodb+srv://Username:password@bloggy-umw0a.mongodb.net/test?retryWrites=true
SECRET_OR_KEY=secret
MAIL_SERVICE_TYPE=Gmail
MAIL_USER=bloggy233@gmail.com
MAIL_PASSWORD=yourpassword
REDIS_HOST=redis-10859.xxxx.xxxx.xxxx.cloud.redislabs.com
REDIS_PORT=10859
REDIS_AUTH_PASSWORD=sadhjsadygGSDAGH8235
ELASTICSEARCH_HOST=https://search-bloggy-xxxx.xxxx.xxx.amazonaws.com
ELASTICSEARCH_LOG=trace
```

`MONGO_URI` refers to `SRV Connection String` if you are using [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
`SECRET_OR_KEY` specifies the key type for [passport.js](http://www.passportjs.org/)
`MAIL_SERVICE_TYPE` specifies the mailbox type you want to use
`MAIL_USER` and `MAIL_PASSWORD` are your regular mailbox account info
`REDIS_HOST` refers to your Redis host
`REDIS_PORT` specifies which port you want to use for Redis
`REDIS_AUTH_PASSWORD` is your password for Redis
`ELASTICSEARCH_HOST` refers to your Elasticsearch host
`ELASTICSEARCH_LOG` specifies your Elasticsearch log type

### Installation

Bloggy requires [Node.js](https://nodejs.org/) v4+ to run.
For npm user:

```sh
$ cd Bloggy
$ npm install
$ npm run start-concurrent
```

For yarn user:

```sh
$ cd Bloggy
$ yarn install
$ yarn run start-concurrent
```

### Debug

If your React/Node server fails to start with the following error message

```sh
events.js:167
       throw er; // Unhandled 'error' event
```

Please check your port `8080` (where React runs) and `8081` (where Node runs)
And make sure there is no other app running on the same port(s)

### Dependencies

Bloggy uses a number of open source libraries to work properly.
Below are all the key dependencies/technologies in this project.
For all dependencies, please refer to `package.json`

| Dependency                | Description                                                                                                               |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------- |
| [react]                   | A JavaScript library for building user interfaces. Serve as front-end.                                                    |
| [node]                    | A JavaScript runtime built on Chrome's V8 JavaScript engine. Serve as back-end.                                           |
| [express]                 | Fast, unopinionated, minimalist web framework for node.js                                                                 |
| [mongoose]                | Elegant mongodb object modeling for node.js                                                                               |
| [axios]                   | Promise based HTTP client for the browser and node.js                                                                     |
| [babel]                   | A JavaScript compiler                                                                                                     |
| [bcrypt]                  | A node.js library for encryption                                                                                          |
| [bootstrap]               | An open source toolkit for developing with HTML, CSS, and JS                                                              |
| [cloudinary]              | Image management and manipulation in the cloud                                                                            |
| [elasticsearch]           | Elasticsearch is a distributed, RESTful search and analytics engine capable of solving a growing number of use cases      |
| [font-awesome]            | Get vector icons and social logos on your website with Font Awesome, the web's most popular icon set and toolkit          |
| [history]                 | A JavaScript library that lets you easily manage session history anywhere JavaScript runs                                 |
| [jsonwebtoken]            | An implementation of JSON Web Tokens                                                                                      |
| [moment]                  | Parse, validate, manipulate, and display dates and times in JavaScript                                                    |
| [nodemailer]              | A module for Node.js applications to allow easy as cake email sending                                                     |
| [nodemon]                 | A utility that will monitor for any changes in your source and automatically restart your server. Perfect for development |
| [passport]                | Simple, unobtrusive authentication for Node.js                                                                            |
| [quill]                   | A free, open source WYSIWYG editor built for the modern web                                                               |
| [react-infinite-scroller] | Infinitely load content using a React Component                                                                           |
| [react-modal]             | Accessible modal dialog component for React.JS                                                                            |
| [redis]                   | An open source (BSD licensed), in-memory data structure store, used as a database, cache and message broker               |
| [webpack]                 | A static module bundler for modern JavaScript applications                                                                |

### Development Team

- `Xuyang Zou (Lynch)`: Team Leader, CS major junior at USC
- `Hao Chen`:
- `Zhixu Li`:
- `Jackie Dong`:

## License

Apache License 2.0

[//]: # "These are reference links used in the body of this note and get stripped out when the markdown processor does its job. There is no need to format nicely because it shouldn't be seen. Thanks SO - http://stackoverflow.com/questions/4823468/store-comments-in-markdown-syntax"
[react]: https://reactjs.org/
[node]: http://nodejs.org
[express]: http://expressjs.com
[mongoose]: https://mongoosejs.com/
[axios]: https://github.com/axios/axios
[babel]: https://babeljs.io/
[bcrypt]: https://www.npmjs.com/package/bcryptjs
[bootstrap]: https://getbootstrap.com/
[cloudinary]: https://cloudinary.com/
[elasticsearch]: https://www.elastic.co/
[font-awesome]: https://origin.fontawesome.com/
[history]: https://www.npmjs.com/package/history
[jsonwebtoken]: https://www.npmjs.com/package/jsonwebtoken
[moment]: https://momentjs.com/
[nodemailer]: https://nodemailer.com/about/
[nodemon]: https://nodemon.io/
[passport]: http://www.passportjs.org/
[quill]: https://quilljs.com/
[react-infinite-scroller]: https://github.com/CassetteRocks/react-infinite-scroller
[react-modal]: https://reactcommunity.org/react-modal/
[redis]: https://redis.io/
[webpack]: https://webpack.js.org/
