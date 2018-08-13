
(function($) {
	var Dialog = require('ei-dialog')
	
	
	$.fn.popout = function(options) {
		
		var theselector = this.selector;
		
		$(theselector).on('click', function(evt) {
			evt.preventDefault()
			
			var diag = new Dialog({
				title: $(this).attr('data-title'),
				body: $(this).attr('data-content'),
				on: {
					'.btn-ok': function() {
						diag.close()
					}
				}
			})
			diag.open()
		})
	}

})(jQuery)
	
