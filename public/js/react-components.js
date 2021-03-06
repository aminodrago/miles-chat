/** @jsx React.DOM *//*
|--------------------------------------------------------------------------
| Search
|--------------------------------------------------------------------------
| 
| Components for handling search
| 
*/

var ArchiveSearch = React.createClass({displayName: 'ArchiveSearch',

	getInitialState: function() {
		return {
			messages: []
		};
	},

	search: function(event) {
		var search_term = this.refs.searchTerm.getDOMNode().value;
		CHAT.HELPERS.addBlockUI('Searching', '#search_block_ui');
		$.ajax({
			type: 'POST',
			url: BASE + '/archive/search',
			data: {search: search_term},
			success: function(data) {
				$('#search_block_ui').unblock();
				this.setState({
					messages: data
				})
			}.bind(this)
		});
	},

	render: function() {
		return (
			React.DOM.div(null, 
				React.DOM.form( {onSubmit:this.search, className:"row", role:"form"}, 
					React.DOM.div( {className:"col-xs-9 col-sm-10"}, React.DOM.input( {ref:"searchTerm", type:"text", className:"form-control", placeholder:"Search chat messages"} )),
					React.DOM.div( {className:"col-xs-3 col-sm-2"}, React.DOM.button( {className:"btn btn-default", type:"submit"}, "Search"))
				),
				React.DOM.br(null ),
				React.DOM.div( {id:"search_block_ui"} ),
				ChatMessages( {messages:this.state.messages} )
			)
		);
	}
});

/*
|--------------------------------------------------------------------------
| By Date
|--------------------------------------------------------------------------
| 
| Componenets to handle browsing the archive by date
| 
*/
var ArchiveIndex = React.createClass({displayName: 'ArchiveIndex',
	getInitialState: function() {
		return {
			dates: []
		};
	},

	componentWillMount: function() {
		this.getDates();
	},

	/**
	 * Do a GET request to get the list of year/months that contain chat messages
	 */
	getDates: function() {
		CHAT.HELPERS.addBlockUI();
		$.ajax({
			type: 'GET',
			url: BASE + '/archive/date/list',
			success: function(data) {
				$.unblockUI();
				this.setState({
					dates: data
				})
			}.bind(this)
		});
	},

	render: function() {
		var indexDates = [];
		_.each(this.state.dates, function(months, year) {
			indexDates.push(ArchiveIndexDates( {year:year, months:months} )); 
		});
		return (
			React.DOM.div(null, indexDates)
		);
	}
});

var ArchiveIndexDates = React.createClass({displayName: 'ArchiveIndexDates',
	render: function() {
		var months = this.props.months.map(function(link, index) {
			return React.DOM.li(null, React.DOM.a( {href:"#date/" + this.props.year + "/" + link}, link));
		}.bind(this));
		return (
			React.DOM.div(null, 
				React.DOM.h4(null, this.props.year),
				React.DOM.ul(null, months)
			)
		);
	}
});

var ArchiveDate = React.createClass({displayName: 'ArchiveDate',
	getInitialState: function() {
		return {
			messages: [],
			pagination: [],
		};
	},

	componentWillMount: function() {
		this.getMessages(10, 1);
	},

	/**
	 * Do a GET request to get all chat messages for the current page based on how much results per page
	 * @param  {int} perPage 
	 * @param  {int} pageNum 
	 */
	getMessages: function(perPage, pageNum) {
		CHAT.HELPERS.addBlockUI();
		$.ajax({
			type: 'GET',
			url: BASE + '/archive/date/' + perPage + '/' + pageNum + '/' + this.props.year + '/'  + this.props.month,
			success: function(data) {
				console.log(data);
				$.unblockUI();
				this.setState({
					messages: data.messages,
					pagination: {
						perPage: perPage,
						numPages: data.numPages,
						pageNum: pageNum
					},
				});
			}.bind(this)
		});
	},

	render: function() {
		return (
			React.DOM.div(null, 
				React.DOM.a( {href:"#"}, "back"),
				React.DOM.h4(null, this.props.year, " : ", this.props.month),
				ArchiveForm( {handleClick:this.getMessages, pageNum:this.state.pagination.pageNum} ),
				ChatMessages( {messages:this.state.messages} ),
				ArchivePagination( {handleClick:this.getMessages, pagination:this.state.pagination})
			)
		);
	}
});

/*
|--------------------------------------------------------------------------
| All Archives
|--------------------------------------------------------------------------
| 
| Components for the 'All' archives section
| 
*/
var ArchiveAll = React.createClass({displayName: 'ArchiveAll',
	getInitialState: function() {
		return {
			messages: [],
			pagination: []
		};
	},

	/**
	 * Start the archive page by grabbing the first 10 messages. 
	 */
	componentWillMount: function() {
		this.getMessages(10, 1);
	},

	/**
	 * Do a GET request to get messages and pagination info based on number of results per page
	 * and the current page Number.  
	 *
	 * Also uses the blockUI plugin to let the user know something is happening.

	 * @param  {int} perPage How many restults per page
	 * @param  {int} pageNum What Page are we on?
	 */
	getMessages: function(perPage, pageNum) {
		CHAT.HELPERS.addBlockUI();
		$.ajax({
			type: 'GET',
			url: BASE + '/archive/all/' + perPage + '/' + pageNum,
			success: function(data) {
				$.unblockUI();
				this.setState({
					messages: data.messages,
					pagination: {
						perPage: perPage,
						numPages: data.numPages,
						pageNum: pageNum
					},
				});
			}.bind(this)
		});
	},

	render: function() {
		return (
			React.DOM.div(null, 
				ArchiveForm( {handleClick:this.getMessages, pageNum:this.state.pagination.pageNum} ),
				ChatMessages( {messages:this.state.messages} ),
				ArchivePagination( {handleClick:this.getMessages, pagination:this.state.pagination})
			)
		);
	},
});

var ArchiveForm = React.createClass({displayName: 'ArchiveForm',
	/**
	 * Call getMessages again with the given number of results per page, starting on page 1
	 * @param  {Object} event React.js event object
	 */
	onChange: function(event) {
		var numResults = event.target.value;
		this.props.handleClick(numResults, 1);
	},

	render: function() {
		return (
			React.DOM.form( {onChange:this.onChange, className:"form-inline padding-bottom-20", role:"form"}, 
				React.DOM.div( {className:"form-group"}, 
					React.DOM.label( {for:"select", className:"padding-right-10"}, "Number of results per page: " ),
					React.DOM.select( {className:"form-control"}, 
						React.DOM.option( {value:"10"}, "10"),
						React.DOM.option( {value:"25"}, "25"),
						React.DOM.option( {value:"50"}, "50")
					)
				)
			)
		);
	}
});

var ArchivePagination = React.createClass({displayName: 'ArchivePagination',

	/**
	 * Handle the click for the first and last links
	 * @param  {Object} event 
	 */
	onClick: function(event) {
		event.preventDefault();
		var pageNum = event.currentTarget.getAttribute('data-page');
		this.props.handleClick(this.props.pagination.perPage, pageNum);		
	},

	/**
	 * Build an array links to use in the pagination <ul>
	 * 
	 * @return {array} 
	 */
	processPaginationLinks: function() {
		var currentLinks = [];
		var x = parseInt(this.props.pagination.pageNum);
		var y = parseInt(this.props.pagination.numPages);

		if (x <= 2) {
			for (var i = 1; i <= (y > 5 ? 5 : y); i++) {
				currentLinks.push(i);
			};
			if (y > 5) currentLinks.push(y);
		}
		else if ( x + 2 <= y) {
			if (x > 3) currentLinks.push(1);
			for (var i = x - 2; i <= x + 2; i++) {
				currentLinks.push(i);
			}
			if (x + 2 < y) currentLinks.push(y);
		}
		else if (x + 2 > y) {
			if (x > 3) currentLinks.push(1);
			for (var i = (y - 4 < 1 ? 1 : y - 4); i <= y; i++) {
				currentLinks.push(i);
			}		
		}
		return currentLinks;
	},

	/**
	 * Builds an array of <li> elements for the nearest pagination pages as well as 
	 * appending/prepending first/last links and next/previous.
	 * @return {JSX} 
	 */
	render: function() {
		var linksArray = this.processPaginationLinks();
		var paginationLinks = linksArray.map(function(link, index) {
			return  ArchivePaginationLi(
						{key:index,
						currentLink:link,
						pagination:this.props.pagination,
						handleClick:this.props.handleClick}
					);
		}.bind(this));
		return (
			React.DOM.div( {className:"archive-pagination"}, 
				React.DOM.ul( {className:"pagination"}, 
					React.DOM.li(null, React.DOM.a( {onClick:this.onClick, 'data-page':this.props.pagination.pageNum == 1 ? '1' : parseInt(this.props.pagination.pageNum, 10) - 1, href:"#"}, "«")),
					paginationLinks,
					React.DOM.li(null, React.DOM.a( {onClick:this.onClick, 'data-page':this.props.pagination.pageNum == this.props.pagination.numPages ? this.props.pagination.numPages : parseInt(this.props.pagination.pageNum, 10) + 1, href:"#"}, "»"))
				)
			)
		);
	}
});

var ArchivePaginationLi = React.createClass({displayName: 'ArchivePaginationLi',

	onClick: function(event) {
		event.preventDefault();
		this.props.handleClick(this.props.pagination.perPage, this.props.currentLink);
	},

	render: function() {
		return (
			React.DOM.li( {className:this.props.currentLink == this.props.pagination.pageNum ? 'active' : ''}, 
				React.DOM.a( {onClick:this.onClick, href:"#"}, this.props.currentLink)
			)
		);
	}
});





var ChatDiv = React.createClass({displayName: 'ChatDiv',

	userName: '',
	userID: 0,
	lastMessageID: 0,
	messagesPending: 0,

	getInitialState: function() {
		return {
			messages: []
		};
	},

	/**
	 * Get the first messages from the server, and get the auth username and id
	 */
	componentWillMount: function() {
		this.getInitialChatMessages();
		$.ajax({
			type: 'GET',
			url: BASE + '/get-user-info',
			success: function(user_info) {
				this.userName = user_info.username;
				this.userID = user_info.id;
			}.bind(this)
		});
	},

	/**
	 * Get the last 20 chat messages from the server on page load, 
	 * then start the loop to get new messages
	 */
	getInitialChatMessages: function() {
		$.ajax({
			type: 'GET',
			url: BASE + '/get-chat-messages/initial',
			success: function(data) {
				this.setState({messages: data});
				this.lastMessageID = this.state.messages[this.state.messages.length-1].messageid;
				CHAT.HELPERS.scrollChatDiv();
				this.getNewChatMessages();
			}.bind(this)
		});
	},

	/**
	 * Uses long-polling to request any new messages from the server
	 */
	getNewChatMessages: function() {
		CHAT.HELPERS.toggleServerErrorMessage('off');
		$.ajax({
			type: 'GET',
			url: BASE + '/get-chat-messages/newest/' + this.lastMessageID,
			async: true,
			cache: false,
			timeout: 30000,
			success: this.addNewMessages,
			error: function() {
				CHAT.HELPERS.toggleServerErrorMessage('on');
				CHAT.HELPERS.scrollChatDiv();
				setTimeout(this.tryToReconnectOnError, 2000);
			}.bind(this)
		});
	},

	/**
	 * Handle what happens when the server returns data from an AJAX request
	 * @param {array} data  Data received from the server
	 */
	addNewMessages: function(data) {
		if (typeof data !== undefined && data.length > 0) {
			if (data.error) { window.location.href = BASE; } //if user not authenticated, go home
			this.lastMessageID = data[data.length-1].messageid;
			this.setState({messages: this.adjustChatMessagesArray(this.state.messages, data)});

			// DOM Manipulations after a new message comes in
			if (CHAT.HELPERS.userAtBottomOfMessagesDiv()) { CHAT.HELPERS.scrollChatDiv(); }
			CHAT.HELPERS.removeSendingDiv();
			CHAT.HELPERS.addTitleAlert();
		}
		this.getNewChatMessages();
	},

	/**
	 * Add new chat messages to array, removing any older messages
	 * if the total is > 19
	 * 
	 * @param  {array} currentState this.state.data
	 * @param  {array} newData     data from the server
	 * @return {array}             updated state 
	 */
	adjustChatMessagesArray: function(currentState, newData) {
		var numToRemove = 0;
		for (var messageIndex in newData) {
			if (newData[messageIndex].username === this.userName && this.messagesPending > 0) {
				this.messagesPending--;
			}
			else{
				currentState.push(newData[messageIndex]);
				numToRemove++;
			}
		}
		if (currentState.length > 19) { currentState.splice(0, numToRemove); } //only remove items if there are at least 20 already
		return currentState;
	},

	/**
	 * Ping the server every 2 seconds until we can reconnect
	 */
	tryToReconnectOnError: function() {
		$.ajax({
			type: 'GET',
			url: BASE + '/get-logged-in-users', //url doesn't really matter here, just need to try to get a response
			async: true,
			cache: false,
			timeout: 2000,
			success: this.getNewChatMessages,
			error: function() {
				setTimeout(this.tryToReconnectOnError, 2000);
			}.bind(this)
		});
	},

	/**
	 * Event handler for when the user submits a new chat message
	 */
	insertNewMessage: function() {
		var message = $('#chatmsg').val();
		if (message === '') return;
		$('#chatmsg').val('');

		newMessageID = this.userName + '-' + (this.lastMessageID + 1);
		this.setState({messages: this.buildNewMessage(message, this.state.messages, newMessageID)});
		this.messagesPending++;
		CHAT.HELPERS.scrollChatDiv();

		$.ajax({
			type: 'POST',
			url: BASE + '/send_chat',
			data: {chatmsg: message},
			success: function(data) {
				this.updatePendingMessage(data, newMessageID);
			}.bind(this),
			error: function() {
				this.messagesPending--;
				this.updatePendingMessage(false, newMessageID);
			}.bind(this)
		});
	},

	/**
	 * Build a new message object and push it to the copied state
	 * 
	 * @param  {string} message  Submitted chat message
	 * @param  {Array} messages Array of message objects
	 * @return {Array}          New State to be set
	 */
	buildNewMessage: function(message, messages, message_id) {
		var newMessage = {
			message: message,
			messageid: message_id,
			timestamp: Math.floor((new Date()).getTime() / 1000),
			username: this.userName,
		};
		messages.push(newMessage);
		return messages;
	},


	/**
	 * Update a pending message with either the server response message 
	 * or change the panel state to error.

	 * @param  {Object} serverData Server response or false
	 * @param  {string} pendingID  ID of the pending message
	 */
	updatePendingMessage: function(serverData, pendingID) {
		var $message = $('#' + pendingID);
		if (serverData) {
			$message.find('.chat-message-body-html').html(CHAT.HELPERS.renderCommonMark(serverData.message));
		}
		else {
			$message.addClass('panel-danger');
			$message.find('.panel-heading').text('Message Failed to Send');
		}
	},


	/**
	 * Render the chat-div, messages, and submit form
	 * @return {JSX} 
	 */
	render: function() {
		return (
			React.DOM.div(null, 
				React.DOM.legend(null, "Messages"),
				ChatMessages( {messages:this.state.messages}),
				ChatForm( {onSubmit:this.insertNewMessage} )
			)
		);
	},
});

var ChatMessages = React.createClass({displayName: 'ChatMessages',

	/**
	 * Render all chat messages and plop them into their correct div
	 * @return {JSX} 
	 */
	render: function() {
	    var messagesArray = this.props.messages.map(function (message, index) {
			return ChatMessage( 
				{key:message.messageid,
				username:message.username,
				timestamp:CHAT.TIME.formatTime(message.timestamp),
				message:CHAT.HELPERS.renderCommonMark(message.message), 
				messageid:message.messageid} 
				);
	    }.bind(this));
		return (
			React.DOM.div( {className:"chat-messages-div", id:"chat_messages"}, messagesArray)
		);

		},
});

var ChatMessage = React.createClass({displayName: 'ChatMessage',
	/**
	 * Render the individual chat message
	 *
	 * Cureently expects raw HTML to be send from the server for the message, so, for now, 
	 * trusting that the server will send back 'safe' HTML and inject that directly into the DOM
	 * @return {JSX} 
	 */
	render: function() {
		return (
			React.DOM.div( {className:"chat-message panel panel-default", id:this.props.messageid}, 
				React.DOM.div( {className:"chat-message-info panel-heading"}, 
					React.DOM.span( {className:"text-muted"}, this.props.username), " | ", this.props.timestamp
				),
				React.DOM.div( {className:"chat-message-body panel-body"}, 
					React.DOM.div( {className:"chat-message-body-html", dangerouslySetInnerHTML:{__html: this.props.message}} )
				)
			)
		);
	}
});

var ChatForm = React.createClass({displayName: 'ChatForm',

	/**
	 * Add listener for the enter key in the chat message form
	 */
	componentDidMount: function() {
		$('#chatmsg').on('keydown', function(e) {
			if (e.which == 13 && ! e.shiftKey) {
				e.preventDefault();
				this.props.onSubmit();
			}
		}.bind(this));
	},

	render: function() {
		return (
			React.DOM.div( {className:"chat-input"}, 
				React.DOM.form( {className:"form-inline", id:"chat_box", action:"send_chat", method:"post"}, 
					React.DOM.div( {className:"form-group chat-textarea col-md-11 col-sm-10"}, 
						React.DOM.div( {className:"controls"}, 
							React.DOM.textarea( {className:"form-control", name:"chatmsg", id:"chatmsg"})
						)
					),

					React.DOM.div( {className:"form-group chat-help"}, 
						React.DOM.div( {className:"controls"}, 
					    	React.DOM.button( {type:"button", id:"popover_btn", className:"btn btn-default", 'data-container':"body", 'data-toggle':"popover", 'data-placement':"top"}, "?")
					    )
				    )
				)
			)
		);
	}
});

