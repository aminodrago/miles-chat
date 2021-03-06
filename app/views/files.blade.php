@extends('main_template')

@section('title')
<title>Miles Chat: Files</title>
@stop

@section('stylesheets')
	{{HTML::style('css/bootstrap-sortable.css')}}
	{{HTML::style('css/files.css')}}
@stop

@section('scripts')
	{{HTML::script('js/lib/bootstrap-sortable.js')}}
	{{HTML::script('js/lib/plupload.full.min.js')}}
	{{HTML::script('js/files.js')}}
@stop

@section('content')

	<h3>Upload</h3>

	<button class="btn btn-default" id="browse" href="javascript:;">Select Files</button>
	<button class="btn btn-primary" id="start-upload" href="javascript:;">Start Upload</button>

	<br /><br />

	<div class="well" id="file_upload_div">
		<p id="upload_message">Click 'select files' above, or you can drag files here to upload.  (note: you can also drag files into the chat window to upload)</p>
		<ul id="filelist"></ul>
	</div>

	<pre id="error_console"></pre>

	<h3>Files</h3>

	<table class="table table-striped sortable" id="files_table">
		<thead>
			<th>Filename</th>
			<th class="file-table-type">Type</th>
			<th class="file-table-date">Date</th>
			<th class="file-table-filesize">Size</th>
			<th class="file-table-username">User</th>
			<th>Delete</th>
		</thead>
		<tbody>
			@foreach($uploads as $upload)
				<?php $file_user = User::find($upload->user_id); ?>
				<tr>
					<td>{{HTML::link('get-file/' . $upload->id . '/' . $upload->filename, $upload->filename)}}</td>
					<td class="file-table-type">{{$upload->filetype}}</td>
					<td class="file-table-date">{{$upload->created_at}}</td>
					<td class="file-table-filesize">{{$upload->filesize}}</td>
					<td class="file-table-username">{{$file_user->username}}</td>
					@if ($file_user->id == $user->id)
						<td><a href="#" data-id="{{$upload->id}}" class="delete-file-confirm">Delete</a></td>
					@else
						<td></td>
					@endif
				</tr>
			@endforeach
		</tbody>
	</table>

@stop