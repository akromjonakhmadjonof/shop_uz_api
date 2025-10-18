// PARENT ROUTERS
const PRODUCTS = '/products/';
const FIELDS = '/fields/';
const AUTH = '/auth/';
const ADS = '/ads/';
const TAGS = '/tags/';
const CASHBACK = '/cashback/';
const UPLOAD = '/upload/';
const PUBLIC = '/public/';
const VIEWS = '/views/';
const CATEGORIES = '/categories/';
const CHATS = '/chats/';
const USER = '/user/';
const FOLLOWERS = '/followers/';

// CHILD ROUTERS
const VIEW_DETAILS = '/:id/view-details/';
const GET_LIST = '/get-list/';
const CREATE_ITEM = '/create-item/';
const DELETE_ITEM = '/delete-item/:id/';
const RECOMMENDATION = '/recommendation/'
const RECOMMENDATION_AUTHOR = '/recommendation/by-author/'
const AUTHOR_PRODUCTS = '/:author/get-products/'

module.exports = {
	// PARENTS
	USER,
	VIEWS,
	CATEGORIES,
	FOLLOWERS,
	CHATS,
	UPLOAD,
	PUBLIC,
	FIELDS,
	CASHBACK,
	TAGS,
	PRODUCTS,
	AUTH,
	ADS,
	// CHILD
	RECOMMENDATION_AUTHOR,
	RECOMMENDATION,
	AUTHOR_PRODUCTS,
	DELETE_ITEM,
	VIEW_DETAILS,
	CREATE_ITEM,
	GET_LIST
};
