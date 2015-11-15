var nav = {
	updateActive: function() {
		var current = document.location.pathname.split("/")[1] || "/";
		current = ("/"+current).replace("//", "/");
		jQuery(".navbar-nav li").removeClass("active");
		jQuery(".navbar-nav a[href='" + current + "']").parent().addClass("active");
	}
}