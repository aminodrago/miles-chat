<!DOCTYPE HTML>
<html>
<head>
	@yield('title')
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta charset="UTF-8">
	{{HTML::style('bootstrap/css/bootstrap.min.css')}}
	@yield('stylesheets')
</head>

<body>

	<!-- Navbar -->
		<nav class="navbar navbar-default" role="navigation">
			<div class="container">

			<!-- Header -->
			<div class="navbar-header">
				<button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-ex1-collapse">
			        <span class="icon-bar"></span>
			        <span class="icon-bar"></span>
			        <span class="icon-bar"></span>
			    </button>
				{{HTML::link('/', 'Miles Chat', array('class' => 'navbar-brand'))}}
			</div>

			<div class="collapse navbar-collapse navbar-ex1-collapse">

				<!-- Left -->
				<ul class="nav navbar-nav">
					@if (Auth::check())
						<li>{{HTML::link('chat', 'Chat')}}</li>
						@if (AuthAdmin::is_admin())
							<li>{{HTML::link('admin', 'Admin')}}</li>
						@endif
						<li>{{HTML::link('account', 'Account')}}</li>
					@endif
				</ul>

				<!-- Right -->
				@if (Auth::check())
					<ul class="nav navbar-nav navbar-right">
						<li>{{HTML::link('logout', 'Logout')}}</li>
					</ul>
				@endif

			</div>
		</nav> <!-- navbar -->

	<div class="container">
		@yield('content')
	</div> <!-- main container -->


	{{HTML::script('js/jquery-2.0.3.min.js')}}
	{{HTML::script('bootstrap/js/bootstrap.min.js')}}
	<script type="text/javascript">var BASE = "<?php echo URL::to('/'); ?>";</script>
	@yield('scripts')
</body>
</html>