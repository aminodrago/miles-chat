@extends('main_template')

@section('title')
<title>Miles Chat --> Chat</title>
@stop

@section('stylesheets')
{{HTML::style('css/chat.css')}}
@stop

@section('scripts')
{{HTML::script('js/jquery.form.min.js')}}
{{HTML::script('js/plupload.full.min.js')}}
{{HTML::script('js/chat.js')}}
@stop

@section('content')

	<!-- Logged in Users Div -->
	<div class="users_div">
		<legend>Online</legend>
		<div id="logged_in_users"></div>
		<br />
		<div class="file-upload hidden">
			<legend>Uploading</legend>
			<button id="hidden_button"></button>
		</div>
	</div> <!-- end users div -->

	<!-- Chat Div -->
	<div class="chat-div">

		<legend>Messages</legend>

		<div class="chat-messages-div" id="chat_messages"></div>

		<div class="chat-input">
			{{Form::open(array('url' => 'send_chat', 'class' => 'form-inline', 'id' => 'chat_box'))}}
				<div class="form-group chat-textarea col-md-11 col-sm-10">
					<div class="controls">
						<textarea class="form-control" name="chatmsg" id="chatmsg"></textarea>
					</div>
				</div>

				<div class="form-group chat-help">
					<div class="controls">
				    	<button type="button" id="popover_btn" class="btn btn-default" data-container="body" data-toggle="popover" data-placement="top">?</button>
				    </div>
			    </div>

			{{Form::close()}}
		</div>
	<div> <!-- end chat div -->

	<!-- Server Error Alert div -->
	<div class="server-error">
		<div class="alert alert-danger chat-message">
			<p><strong>Error!</strong> cannot connect to chat server.</p>
		</div>
	</div>

	<!-- Chat commands popover html -->
	<div id="chat_commands">
		<P>Use these at the beginning of a message.</P>
		<p><strong>/code:</strong> wrap in code and pre</p>
		<p><strong>/quote:</strong> wrap in blockquote</p>
		<p><strong>/h1 thru /h4:</strong> title tags</p>
		<p><strong>/b:</strong> wrap in strong</p>
		<p><strong>/i:</strong> wrap in em</p>
	</div>

	<!-- Sending msg div -->
	<div id="sending_msg_div">
		<div class="panel panel-default sending-message">
			<div class="panel-body">
				<p><img src="images/loading.gif">  sending</p>
			</div>
		</div>
	</div>

@stop