const chats_controller = require('./chat_controller')
const activity_controller = require('./activity_controller');
const messages_controller = require('./messages_controller');
const notifications_controller = require('./notification_controller');

module.exports = {
	'chats.get_chats':chats_controller.get_user_chats,
	'chat.get_chat':chats_controller.get_current_chat,
	'activity.set_activity':activity_controller.user_last_activity_set,
	'messages.get_messages':messages_controller.get_chat_messages,
	'message.create_message_item':messages_controller.send_message,
	'notification.create_notification_item':notifications_controller.notification_create,
}
