/* global jQuery */

(function($){
	'use strict';

    var validateEmail = function(text){
        var pattern = /^.+@.+[.].{2,}$/gi;
        if(text.match(pattern)){

        }
    };

	var validateInput = function(input){
		var inputType = input.attr('data-validate');
        var text = input.val();

        switch(inputType){
            case 'email': validateEmail(text);
        }

	};

    var coreFunction = function(form){
        var valid = true,
        $sendBtn = form.find('input[type=submit]');

        form.find('input[data-validate]').each(function(){
            validateInput();
        });

        if(!valid && settings.block_sending){
            $sendBtn.attr('disabled','disabled');
        }
    };

	$.fn.jqValidate = function(options) {

	  	var settings = $.extend({
            block_sending: false,
            pass_min_chars: 6
        }, options );
	  	

        return this;
    };
})(jQuery);