$(document).ready(function() {
	var baseUrl = 'https://swapi.co/api/';

	$('form').submit(function(e) {
		e.preventDefault();
		var searchUrl = baseUrl + 'people?search=';
		var params = $('input[name="search-params"]').val();
		$.get(searchUrl + params, function(data) {
			var person = data.results[0];

			var htmlStr = `
				<div class='person'>
					<h3>${person.name}</h3>
					<div style='display: none;'>
						<ul>
							<li>height: ${person.height}</li>
							<li>mass: ${person.mass}</li>
							<li>hair color: ${person.hair_color}</li>
						</ul>
						<button data-link='${person.homeworld}'>Show Home World Info</button>
					</div>
				</div>
			`;
			$('#people').append(htmlStr);
			$('input[name="search-params"]').val('');
		}, 'json');
	});

	$(document).on('click', 'h3', function() {
		$(this).siblings().slideToggle();
	});

	$(document).on('click', '.person button', function() {
		var worldUrl = $(this).attr('data-link');
		var that = $(this);
		$.get(worldUrl, function(data) {
			var htmlStr = `
				<div class='world'>
					<h4>${data.name}</h4>
				</div>
			`;
			that.parent().append(htmlStr);
			that.remove();
		});
	});
});