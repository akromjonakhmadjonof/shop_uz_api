// Io configuration
const { Server } = require('socket.io');
const _ = require('loadsh');
const { socket_validation_token, get_data_from_token } = require('../../helpers/token_generator');
const chat_controller = require('../../controllers/chat_controller');
const message_controller = require('../../controllers/messages_controller');
const notification_controller = require('../../controllers/notification_controller');
const user_controller = require('../../controllers/user_controller');
const chat_serializers = require('../../serializer/chat_serializer');
const Chats = require('../../models/chat');
const comment_serializer = require('../../serializer/comment_serializer');
const comment_model = require('../../models/comment');
const comments_controller = require('../../controllers/comment_controller');
const favourites_controller = require('../../controllers/favourites_controller');
const basket_controller = require('../../controllers/basket_controller');
const forum_serializer = require('../../serializer/forum_serializer');
const forum_model = require('../../models/forum');
const forum_controller = require('../../controllers/forum_controller');
const chats = require('./chats')
const activity = require('./activity')
const messages = require('./messages')

const online_users = {};

const socket_router = (app, server) => {

	const io = new Server(server, {
		cors:{
			origin:'*',
			methods:['GET', 'POST']
		}
	});

	app.set('io', io)

	io.use((socket, next) => {
		const token = _.get(socket, ['handshake', 'auth', 'token'])
		socket_validation_token(token, next)
	})

	io.on('connect', async (socket) => {
		// Token data
		const access_token = _.get(socket, ['handshake', 'auth', 'token']);
		const token_data = get_data_from_token(access_token);
		const user_name = _.get(token_data, ['user_name']);
		const user_id = _.toInteger(_.get(token_data, ['user_id']));

		// Add to online user
		online_users[user_name] = socket.id;

		// Socket Chats Router
		await chats(socket, access_token)

		// Socket Activity Router
		await activity(socket, access_token)

		// Socket Messages Router
		await messages(socket, access_token, online_users, { id: user_id, name: user_name }, io)

		await socket.on('listen_typing', async ({ chat_id, typing }) => {

			// Chat
			const chat = await chat_controller.get_current_chat(user_id, chat_id);

			const notification_user = _.get(chat, ['user_name']);

			socket.broadcast.to(online_users[notification_user]).emit('user_typing', {
				'user_name':notification_user,
				'typing':typing
			});
		});

		// Delete Message
		await socket.on('delete_message', async (data) => {
			const { message, chat_id } = data
			// Chat
			const chat = await chat_controller.get_current_chat(user_id, chat_id);

			// Messages
			const messages = await message_controller.get_chat_messages(chat_id);

			// Notification user
			const notification_user = _.get(chat, ['user_name']);

			await message_controller.delete_message(message);
			socket.to(online_users[notification_user]).emit('get_messages', messages);
			socket.emit('get_messages', messages);


		})

		// Add Comment
		await socket.on('product_comment', (data) => {
			const product = _.get(data, ['product']);
			const message = _.get(data, ['message']);
			const comment_data = comment_serializer(message, product, user_id);
			const comment = new comment_model({ ...comment_data });
			comment.save().then(() => {
				socket.emit('product_comment_added', {});
			});
		});

		// Comment reply
		await socket.on('product_comment_reply', async (data) => {
			const message = _.get(data, ['message']);
			const product = _.get(data, ['product']);
			const reply = _.get(data, ['reply']);
			const comment_data = comment_serializer(message, product, user_id, true);
			const comment = new comment_model({ ...comment_data });
			await comment.save().then(async (doc) => {
				const comment_id = _.get(doc, ['comment_id']);
				await comment_model.findOneAndUpdate({ 'comment_id':reply }, { '$addToSet':{ 'replies':comment_id }, }).then(() => {
					socket.emit('comment_successful_updated');
				});
			});
		});

		// Get Comments
		await socket.on('get_product_comments', (product_id) => {
			comments_controller.get_product_comments(product_id, (data) => {
				socket.emit('give_product_comments', data);
			});
		});

		// Like Comment
		await socket.on('liked_comment', async (comment_id) => {
			await comment_model.findOneAndUpdate({ 'comment_id':comment_id }, {
				'$addToSet':{ 'likes':user_id },
				'$pullAll':{ 'dislikes':[user_id] }
			}).then(() => {
				socket.emit('comment_successful_updated');
			});
		});

		// Dislike Comment
		await socket.on('disliked_comment', async (comment_id) => {
			await comment_model.findOneAndUpdate({ 'comment_id':comment_id }, {
				'$addToSet':{ 'dislikes':user_id },
				'$pullAll':{ 'likes':[user_id] }
			}).then(() => {
				socket.emit('comment_successful_updated');
			});
		});

		// Remove like
		await socket.on('comment_like_default', async (comment_id) => {
			await comment_model.findOneAndUpdate({ 'comment_id':comment_id }, { '$pullAll':{ 'likes':[user_id] } }).then(() => {
				socket.emit('comment_successful_updated');
			});
		});

		// Remove dislike
		await socket.on('comment_dislike_default', async (comment_id) => {
			await comment_model.findOneAndUpdate({ 'comment_id':comment_id }, { '$pullAll':{ 'dislikes':[user_id] } }).then(() => {
				socket.emit('comment_successful_updated');
			});
		});

		// Add To Favourites
		await socket.on('add_favourites', async (product_id) => {
			await favourites_controller.favourites_add(user_id, product_id,  () => {
				socket.emit('favourites_updated')
			});
		});

		// Remove From Favourites
		await socket.on('remove_favourites', async (product_id) => {
			await favourites_controller.favourites_remove(user_id, product_id, () => {
				socket.emit('favourites_updated')
			});
		});

		// Get Favourites
		await socket.on('get_favourites', async () => {
			const favourites = await favourites_controller.get_user_favourites(user_id);
			return socket.emit('give_favourites', favourites);
		});

		// Get Favourites Card
		await socket.on('get_favourites_card', async () => {
			const favourites = await favourites_controller.get_user_favourites_card(user_id);
			return socket.emit('give_favourites_card', favourites);
		});

		// Add To Basket
		await socket.on('add_basket', async (product_id) => {
			await basket_controller.basket_add(user_id, product_id, () => {
				socket.emit('basket_updated');
			});
		});

		// Remove From Basket
		await socket.on('remove_basket', async (product_id) => {
			await basket_controller.basket_remove(user_id, product_id, () => {
				socket.emit('basket_updated');
			});
		});

		// Get Basket
		await socket.on('get_basket', async () => {
			const basket = await basket_controller.get_user_basket(user_id);
			return socket.emit('give_basket', basket);
		});

		// Get Basket Card
		await socket.on('get_basket_card', async () => {
			const basket = await basket_controller.get_user_basket_card(user_id);
			return socket.emit('give_basket_card', basket);
		});

		// Get User's Product Comments
		await socket.on('get_user_product_comments', async () => {
			const comments = await comments_controller.get_user_product_comments(user_id)
			return socket.emit('give_user_product_comments', comments)
		})

		// Forum Post
		await socket.on('forum_post', async (data) => {
			const message = _.get(data, ['message']);
			const forum_data = forum_serializer(message, user_id)
			const forum = new forum_model({...forum_data})
			forum.save().then(() => {
				io.sockets.emit('forum_updated', online_users);
			})
		})

		await socket.on('get_forum_data', async () => {
			forum_controller.get_forum_data((data) => {
				socket.emit('give_forum_data', data)
			})
		})

		// Like Forum Comment
		await socket.on('forum_liked', async (comment_id) => {
			await forum_model.findOneAndUpdate({ '_id':comment_id }, {
				'$addToSet':{ 'likes':user_id },
				'$pullAll':{ 'dislikes':[user_id] }
			}).then(() => {
				io.sockets.emit('forum_updated', online_users);
			});
		});

		// Remove Forum Like
		await socket.on('forum_like_default', async (comment_id) => {
			await forum_model.findOneAndUpdate({ '_id':comment_id }, { '$pullAll':{ 'likes':[user_id] } }).then(() => {
				io.sockets.emit('forum_updated', online_users);
			});
		});

		// Forum Dislike
		await socket.on('forum_disliked', async (comment_id) => {
			await forum_model.findOneAndUpdate({ '_id':comment_id }, {
				'$addToSet':{ 'dislikes':user_id },
				'$pullAll':{ 'likes':[user_id] }
			}).then(() => {
				io.sockets.emit('forum_updated', online_users);
			})
		});

		// Remove Forum DisLike
		await socket.on('forum_dislike_default', async (comment_id) => {
			await forum_model.findOneAndUpdate({ '_id':comment_id }, { '$pullAll':{ 'dislikes':[user_id] } }).then(() => {
				io.sockets.emit('forum_updated', online_users);
			});
		});

		await socket.on('forum_delete', async (comment_id) => {
			await forum_controller.delete_forum_comment(comment_id, () => {
				io.sockets.emit('forum_updated', online_users);
			})
		})

		await socket.on('comment_delete', async (comment_id) => {
			await comments_controller.delete_comment(comment_id, () => {
				io.sockets.emit('comment_successful_updated', online_users);
			})
		})

		// ================== Notification Module ==================

		await socket.on('get_message_notifications', async () => {
			const notifications = await notification_controller.get_messages_notification(user_id)
			socket.emit('give_message_notifications', notifications)
		})

		await socket.on('remove_un_reads', async (chat_id) => {
			await notification_controller.remove_unreads_count(user_id, chat_id, (data) => {
				socket.emit('message_notifications_updated')
			})
		})
	});

}

module.exports = {
	online_users
}

module.exports = socket_router
