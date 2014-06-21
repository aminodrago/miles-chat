var ArchiveDiv = React.createClass({
	getInitialState: function() {
		return {
			messages: [],
			pagination: []
		};
	},

	/**
	 * Start the archive page by grabbing the first 20 messages.  Hard-coding in
	 * the number per page for now.
	 */
	componentWillMount: function() {
		this.getMessages(20, 1);
	},

	/**
	 * Do a GET request to get messages and pagination info based on number of results per page
	 * and the current page Number

	 * @param  {int} perPage How many restults per page
	 * @param  {int} pageNum What Page are we on?
	 */
	getMessages: function(perPage, pageNum) {
		$.ajax({
			type: 'GET',
			url: BASE + '/archive/all/' + perPage + '/' + pageNum,
			success: function(data) {
				this.setState({
					messages: data.messages,
					pagination: {
						numPages: data.numPages,
						pageNum: pageNum
					},
				});
			}.bind(this)
		});
	},

	render: function() {
		return (
			<div>
				<ChatMessages data={this.state.messages} />
				<ArchivePagination handleClick={this.getMessages} pagination={this.state.pagination}/>
			</div>
		);
	},
});

var ArchivePagination = React.createClass({

	/**
	 * Handle the click for the first and last links
	 * @param  {Object} event 
	 */
	onClick: function(event) {
		event.preventDefault();
		var pageNum = event.currentTarget.getAttribute('data-page');
		this.props.handleClick(20, pageNum);		
	},

	/**
	 * Build an array of the nearest page numbers given the current page
	 * and the total number of pages
	 * 
	 * @return {array} 
	 */
	processPaginationLinks: function() {
		var currentLinks = [];
		var x = this.props.pagination.pageNum;
		var y = this.props.pagination.numPages

		if (x - 2 <= 0) {
			if (y > 5) y = 5; 
			for (var i = 1; i <= y; i++) {
				currentLinks.push(i);
			};
		}
		else if ( x - 2 > 0 && x + 2 <= y) {
			for (var i = x - 2; i <= x + 2; i++) {
				currentLinks.push(i);
			}
		}
		else if (x - 2 > 0 && x + 2 > y) {
			for (var i = (y - 4 < 1 ? 1 : y - 4); i <= y; i++) {
				currentLinks.push(i);
			}		
		}
		return currentLinks;
	},

	/**
	 * Builds an array of <li> elements for the nearest pagination pages as well as 
	 * appending/prepending first/last links as well.
	 * @return {JSX} 
	 */
	render: function() {
		var linksArray = this.processPaginationLinks();
		var paginationLinks = linksArray.map(function(link, index) {
			return  <ArchivePaginationLi
						key={index}
						currentLink={link}
						currentPage={this.props.pagination.pageNum}
						numPages={this.props.pagination.numPages}
						handleClick={this.props.handleClick}>
					</ArchivePaginationLi>;
		}.bind(this));
		return (
			<div className="archive-pagination">
				<ul className="pagination">
					<li><a onClick={this.onClick} data-page="1" href="#">«</a></li>
					{paginationLinks}
					<li><a onClick={this.onClick} data-page={this.props.pagination.numPages} href="#">»</a></li>
				</ul>
			</div>
		);
	}
});

var ArchivePaginationLi = React.createClass({

	/**
	 * Handle click event for a pagination link
	 * @param  {Object} event 
	 */
	onClick: function(event) {
		event.preventDefault();
		this.props.handleClick(20, this.props.currentLink);
	},

	render: function() {
		return (
			<li className={this.props.currentLink == this.props.currentPage ? 'active' : ''}>
				<a onClick={this.onClick} href="#">{this.props.currentLink}</a>
			</li>
		);
	}
});




