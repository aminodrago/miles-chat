<?php 

/**
* Chat
*/
class ChatController extends BaseController
{

	/*
	|--------------------------------------------------------------------------
	| Handle HTTP requests
	|--------------------------------------------------------------------------
	| 
	| GET/POST
	| 
	*/

	/**
	 * Handle GET request for /chat
	 *
	 * @return View
	 */
	public function action_index() {
		return View::make('chat');
	}

	/**
	 * Handle GET request for /get-chat-messages
	 *
	 * Gets chat messages depending on the type requested.  If it is after the 
	 * newest messages, it starts a long polling process wherein it will keep
	 * looking for new chat messages every n seconds until for 30 seconds, then
	 * return that response so that the chat js can use long polling
	 * 
	 * @param  string $type            
	 * @param  int $last_message_id 
	 * @return JSON                 
	 */
	public function action_get_chat_messages($type, $last_message_id = NULL) {
		if ($type == 'initial') {
			$messages = $this->get_initial_chat_messages();
		}
		// Start long polling process if looking for new messages
		else if ($type == 'newest' && $last_message_id !== NULL) {
			$start_time = time();
			$messages = array();
			while (1) {
				if (time() - $start_time > 25) {
					break;
				}
				else {
					$messages = $this->get_new_chat_messages($last_message_id);
					if (!empty($messages)) {
						break;
					}
					sleep(1);
				}
			}
		}
		return Response::json(ChatController::create_messages_json($messages));
	}

	/**
	 * Handle POST request for sending a chat message
	 * 
	 * @return Response 
	 */
	public function post_chat_message() {
		$message = Input::get('chatmsg');
		$message = $this->process_chat_commands($message);
		$message = $this->run_htmlpurifier($message);
		$db_message = ChatController::insert_chat_message($message);
		return Response::json($db_message);
	}

	/**
	 * Handle GET request for /get-logged-in-users
	 *
	 * Queries the DB for all users with a last_seen time of 2 minutes or recent
	 * 
	 * @return View
	 */
	public function get_logged_in_users() {
		$users = User::where('last_seen', '>', Carbon\Carbon::now()->subMinutes(2))->get();
		$usernames = array();
		foreach ($users as $user) {
			$usernames[] = $user->username;
		}
		return View::make('logged_in_users')->with('users', $usernames);
	}

	/**
	 * Handle GET request for /get-user-info
	 * 
	 * @return JSON DB ID and Username of the logged in user
	 */
	public function get_user_info() {
		$user = Auth::user();
		$user_info = array(
			'username' => $user->username,
			'userID' => $user->id,
			);
		return Response::json($user_info);
	}

	/*
	|--------------------------------------------------------------------------
	| Helper functions
	|--------------------------------------------------------------------------
	| 
	| These are used by the above functions
	| 
	*/

	/**
	 * Given an array from the DB of messges, create a new array formatted correctly for the JS
	 * 
	 * @param  array $messages Messages from the DB
	 * @return array           
	 */
	public static function create_messages_json($messages) {
		$messages_array = array();
		foreach ($messages as $message) {
			$current = array();
			$user = User::find($message->user_id);
			$current['username'] = $user->username;
			$current['timestamp'] = strtotime($message->created_at);
			$current['messageid'] = $message->id;
			$current['message'] = $message->message;
			$messages_array[] = $current;
		}
		return $messages_array;
	}

	/**
	 * Updates the logged in user's last_seen column in the DB
	 *
	 * @return void
	 */
	public static function record_user_activity() {
		$user = Auth::user();
		$user->last_seen = Carbon\Carbon::now()->toDateTimeString();
		$user->save();		
	}

	/**
	 * Record user activity and get 20 most recent chat messages
	 *
	 * @return array
	 */
	public function get_initial_chat_messages() {
		ChatController::record_user_activity();
		return Message::get_newest_messages(20);
	}

	/**
	 * Get all messages later than the given message_id and update user last_seen time and record user activity
	 * 
	 * @param  int $id DB id of a message
	 * @return array
	 */
	public function get_new_chat_messages($id) {
		ChatController::record_user_activity();
		$messages = Message::get_messages_since_id($id);
		return $messages;
	}

	/**
	 * Insert the given chat message for the logged in user and update user last_seen time
	 * 
	 * @param  string $message 
	 * @return Message  Message ORM object
	 */
	public static function insert_chat_message($message) {
		ChatController::record_user_activity();
		$user = Auth::user();
		$db_message = new Message();
		$db_message->user_id = $user->id;
		$db_message->message = $message;
		$db_message->save();
		return $db_message;
	}

	/**
	 * If a valid chat command is found at the beginning of $message, create a new message with the 
	 * appropriate value from the chatcommands array
	 * 
	 * @param  string $message Initial chat message
	 * @return string          
	 */
	public function process_chat_commands($message) {
		if (substr($message, 0, 1) == '/') {
			$shortcodes = Config::get('chatcommands');

			preg_match('([^\s]+)', $message, $command);
			$command = isset($command[0]) ? $command[0] : FALSE;
			$message = str_replace($command . ' ', '', $message);

			if (array_key_exists($command , $shortcodes)) {
				return str_replace('%s', $message, $shortcodes[$command]);
			}
		}
		return $message;
	}


	/**
	 * Run $message through the htmlpurifier library
	 *
	 * Settings for this are set in app/purifier.php.  This library
	 * will get rid of <Script> tags (among other things) and automatically
	 * add href tags to links.
	 * 
	 * @param  string $message string to purify
	 * @return string          purified string
	 */
	public function run_htmlpurifier($message) {
		return Purifier::clean($message, 'titles');
	}

}