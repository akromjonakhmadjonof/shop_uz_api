const express = require('express');
const { PORT } = require('./config/constants');
const fields_router = require('./routes/fields');
const products_router = require('./routes/products');
const tags_router = require('./routes/tags');
const category_router = require('./routes/category');
const cashback_router = require('./routes/cashbacks');
const uploader_router = require('./routes/upload');
const media_router = require('./routes/media');
const auth_router = require('./routes/auth');
const ads_router = require('./routes/ads');
const views_router = require('./routes/page_views');
const followers_router = require('./routes/followers');
const chats_router = require('./routes/chats');
const users_router = require('./routes/user');
const body_parser = require('body-parser');
const connect_to_db = require('./config/connection');
const app = express();
const cookie_parser = require('cookie-parser');
const http = require('http');
require('./test_instagram');
const cors = require('cors');

const PATH = require('./routes');
const server = http.createServer(app);
const socket_router = require('./modules/socket')

// Configurations
app.use(cors({
	origin:'*',
	methods:['GET', 'POST', 'PUT', 'DELETE'],
	optionsSuccessStatus:200
}));

// GLOBAL ROUTER

app.use(PATH.FIELDS, fields_router);

app.use(PATH.PRODUCTS, products_router);

app.use(PATH.AUTH, auth_router);

app.use(PATH.ADS, ads_router);

app.use(PATH.TAGS, tags_router);

app.use(PATH.CASHBACK, cashback_router);

app.use(PATH.UPLOAD, uploader_router);

app.use(PATH.PUBLIC, media_router);

app.use(PATH.VIEWS, views_router);

app.use(PATH.CATEGORIES, category_router);

app.use(PATH.CHATS, chats_router);

app.use(PATH.USER, users_router);

app.use(PATH.FOLLOWERS, followers_router);

// Configurations
app.use(cookie_parser());

app.use(body_parser.json());

app.use(express.json());

app.use(body_parser.urlencoded({
	extended:false
}));

socket_router(app, server)

// DB Connection
connect_to_db();

// Listen port
server.listen(PORT);
