$( document ).ready( function(){
	Helpers.detectBrowser();
	Main.init();
});

var Main = ( function(){

	var apiKey = "a5e95177da353f58113fd60296e1d250"; //"ac6ae04116ad3e3f2664b5429c5d511e"
	var apiSecret = "abaafa80dca58899";
	var userID = "132365033@N08";
	var data;

	//private functions
	function loadImages(){
		$.ajax( {
			type: "GET",
			dataType: "json",
			url: "https://api.flickr.com/services/rest/?method=flickr.people.getPublicPhotos&api_key=" + apiKey + "&user_id=" + userID + "&format=json&nojsoncallback=1",
			complete: function( returnData ) {
				data = returnData.responseJSON.photos.photo;
				loadMetaData( addImagesToPage );
			}
		} );
	}
	
	//load the meta data for each image
	function loadMetaData( callback ) {
		var i;
		var j;
		var counter = 1;
		for( i = 0; i < data.length; i++ ){
			$.ajax( {
				type: "GET",
				dataType: "json",
				url: "https://api.flickr.com/services/rest/?method=flickr.photos.getInfo&api_key=" + apiKey + "&photo_id=" + data[i].id + "&secret=" + data[i].secret + "&format=json&nojsoncallback=1",
				complete: function( returnData ) {
					for( j = 0; j < data.length; j++ ){
						if( data[j].id == returnData.responseJSON.photo.id ){
							data[j].meta = returnData.responseJSON.photo;
						}
					}

					if( counter == data.length ){
						callback();
					} else {
						counter++;
					}
				}
			} );
		}
	}

	function addImagesToPage(){
		var i;
		for( i = 0; i < data.length; i++ ){
			var clonedObj = $( '.flickr', $( ".library" ) ).clone();
			var imageURL = 'https://farm' + data[i].farm + '.staticflickr.com/' + data[i].server + '/' + data[i].id + '_' + data[i].secret + '_b.jpg';
			
			//determine if the image is portrait or landscape
			var img = new Image();
			img.src = imageURL;
			var imgClass = "landscape";

			if( img.height > img.width ){
				imgClass = "portrait";
			}

			$( 'img', clonedObj ).attr( 'src', imageURL );
			$( clonedObj ).addClass( imgClass );
			$( '.container' ).append( clonedObj );
		}
	}

	//public functions
	function init(){
		loadImages();
	}

	return {
		init : init
	}

} )();

var Helpers = ( function(){

	function detectBrowser(){
		//adds the browser class to the body
		var className = "";
		var userAgent = navigator.userAgent;
		var browser = "";
		var browserArray = new Array(
		    { browser: "Firefox", ua: "Firefox", shortForm: "ff", uaIdentity: "Firefox" },
			{ browser: "Internet Explorer", ua: "MSIE", shortForm: "ie", uaIdentity: "MSIE" },
			{ browser: "Internet Explorer", ua: "rv:", shortForm: "ie", uaIdentity: "rv" },
			{ browser: "Blackberry", ua: "BlackBerry", shortForm: "bb", uaIdentity: "Version" },
			{ browser: "Blackberry", ua: "RIM", shortForm: "bb", uaIdentity: "Version" },
			{ browser: "Blackberry", ua: "BB", shortForm: "bb", uaIdentity: "." },
			{ browser: "Dolphin", ua: "Dolfin", shortForm: "Dolphin", uaIdentity: "Dolfin" },
			{ browser: "Opera", ua: "Opera", shortForm: "opera", uaIdentity: "Version" },
			{ browser: "iPhone", ua: 'iPhone OS', shortForm: "iPhone", uaIdentity: "iPhone OS" },
			{ browser: "Chrome", ua: "Chrome", shortForm: "chrome", uaIdentity: "Chrome" },
			{ browser: "Safari", ua: "Safari", shortForm: "safari", uaIdentity: "Version" }
		);

		var i;
		var j;
		var version;
		for( i = 0; i < browserArray.length; i++ ){
			if( userAgent.indexOf( browserArray[i].ua ) != -1 ){
				browser = browserArray[i];
				version = userAgent.indexOf( browserArray[i].uaIdentity );
				if( version == -1 ){
					version = 0; //cannot find version
				}
				className = browserArray[i].shortForm;
				if( !isNaN( parseFloat( userAgent.substring( version + browserArray[i].uaIdentity.length + 1 ) ) ) ){
					className += " " + browserArray[i].shortForm + parseFloat( userAgent.substring( version + browserArray[i].uaIdentity.length + 1 ) ).toFixed();
				}
				break;
			}
		}
		$( "body" ).addClass( className );
	}

	function createLightBox( content ){
		var lightbox = $( '.lightbox', $( '.library' ) ).clone();
		$( '.lightboxMain', content ).append( content );
		$( '.websiteContainer' ).append( lightbox );
	}

	function destroyLightBox(){
		$( '.websiteContainer' ).removeChild( $( '.lightbox' ) );
	}

	return {
		detectBrowser : detectBrowser,
		createLightBox : createLightBox,
		destroyLightBox : destroyLightBox
	}
})();