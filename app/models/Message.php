<?php 

/**
* Message ORM
*/
class Message extends Eloquent
{
	
	/**
	 * Eloquent ORM definition linking messages to their user
	 * 
	 * @return Eloquent
	 */
	public function user() {
		return $this->belongsTo('User');
	}

	/**
	 * Get the $num most recent chat messages
	 *
	 * Messages are ordered by id ASC
	 * 
	 * @param  int $num Number of messages to retrive
	 * @return Object      
	 */
	public static function get_newest_messages($num) {
		$messages = DB::select(DB::raw('SELECT * FROM (
				SELECT * FROM messages ORDER BY id DESC LIMIT ' . $num . '
			) sub 
			ORDER BY id ASC'));
		return $messages;
	}

	/**
	 * Get all messages later than the given message_id
	 * 
	 * @param  int $id ID of last message
	 * @return Object
	 */
	public static function get_messages_since_id($id) {
		return DB::select(DB::raw('SELECT * FROM messages WHERE id > ' . $id));
	}

}