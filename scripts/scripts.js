
const bleachifyApp = {};

bleachifyApp.masonryInitialized = false;

bleachifyApp.key = 'ec98fe4433614a2e20e38fe27d4222cf0f82f9b135845acac3988ab15ef12921';


bleachifyApp.getResults = function(search, page) {
	$.ajax({
		url: 'https://proxy.hackeryou.com',
		method: 'GET',
		dataType: 'json',
		data: {
			reqUrl: `https://api.unsplash.com/search/photos/`,
			params: {
				client_id: bleachifyApp.key,
				query: search,
				per_page: 30,
				page
			},
			useCache: true
		}
	}).then(function(res){
		var searchData = res;
		bleachifyApp.displayInfo(searchData.results);
	})
};

bleachifyApp.displayInfo = function(results){
	console.log(results);

	// if (results !== undefined) {
		results.forEach(function(res){
			if (res.urls.regular != undefined) {
				var resPhotog = $('<h3>').text(res.user.name);
				var resImg = $('<img>').attr('src', res.urls.regular);
				var resPortfolio = $('<a>').attr('href', res.user.links["html"]).text('View Portfolio');

				var imgOverlay = $('<div>').addClass('overlay').append(resPhotog, resPortfolio);

				var imgContainer = $('<li>').addClass('grid-item').append(resImg, imgOverlay);

				$('.grid').append(imgContainer);


				if (bleachifyApp.masonryInitialized === true) {
					$('.grid').masonry( 'appended', imgContainer);	
				}
			} 
		});
	// }	

	//Masonry Layout
	if(bleachifyApp.masonryInitialized === false) {
	 	$('.grid').masonry({
		  // options
		  itemSelector: '.grid-item',
		});
	}

	$('.grid').imagesLoaded().progress( function() {
	  $('.grid').masonry('layout');
		bleachifyApp.masonryInitialized = true;
	});
};


//infinite scroll
bleachifyApp.infScroll = function(pag, searchInput) {

	$(window).on('scroll', function () { 
	   if ($(window).scrollTop() >= $(document).height() - $(window).height() - 10) {
	   		pag = pag + 1;
	   		bleachifyApp.getResults(searchInput, pag);
	   }
	});
	
}


bleachifyApp.search = function() {
	$('.searchForm').on('submit', function(e){
		e.preventDefault();
		if(bleachifyApp.masonryInitialized === true) {
			$('.grid').masonry('remove', $('.grid-item'));
		}
		var pagination = 1;
		var searchInput = $('input.searchField').val();
		bleachifyApp.infScroll(pagination, searchInput)
		bleachifyApp.getResults(searchInput, pagination)
	})
}

bleachifyApp.init = function() {
	bleachifyApp.search(); 
}

$(function(){
	bleachifyApp.init();
})
