/* global jQuery */

(function($){
	'use strict';

    var validateEmail = function(text){
        var pattern = /^.+@.+[.].{2,}$/gi;
        return pattern.test(text);
    };

    var validatePassword = function(text, entropy){
        var passwordEntropy = 0,
        a = 35,
        b = 10,
        c = 32,
        length = text.length;

        passwordEntropy += /[A-ZĄĆĘŁŃÓŚŹŻ]/g.test(text) ? a : 0;
        passwordEntropy += /[a-ząćęłńóśźż]/g.test(text) ? a : 0;
        passwordEntropy += /[0-9]/g.test(text) ? b : 0;
        passwordEntropy += /[\W]/g.test(text) ? c : 0;

        passwordEntropy = Math.log2(passwordEntropy);
        passwordEntropy *= length;

        return passwordEntropy > entropy;
    };

    var validatePostalCode = function(text){
        var pattern = /^[0-9]{2}-[0-9]{3}$/gi;
        return pattern.test(text);
    };

    var validateRegExp = function(text, regexp){
        var pattern = new RegExp(regexp, 'gi');
        return pattern.test(text);
    };

    var setBorders = function(valid, input){
        var cl = valid ? 'ok': 'error';
        input.removeClass('ok error').addClass(cl);
    };

	var validateInput = function(input, settings){
		var inputType = input.attr('data-validate'),
        text = input.val(),
        valid = false;

        switch(inputType){
            case 'email': valid = validateEmail(text);
                break;
            case 'password': valid = validatePassword(text, settings.entropy);
                break;
            case 'postalcode': valid = validatePostalCode(text);
                break;
            default: valid = validateRegExp(text, inputType);
        }
        
        setBorders(valid, input); 

        return valid;
	};

    var coreFunction = function(form, settings){
        var valid = true,
        $sendBtn = form.find('input[type=submit]');

        form.find('input[data-validate]').each(function(i,el){
            var $input = $(el);
            valid = validateInput($input, settings) ? valid : false;
        });

        if(!valid && settings.block_sending){
            $sendBtn.attr('disabled','disabled');
        }else{
             $sendBtn.removeAttr('disabled');
        }
    };

	$.fn.jqValidate = function(options) {

	  	var settings = $.extend({
            validate_on_start: false,
            block_sending: false,
            pass_min_chars: 6,
            entropy: 60
        }, options ),
        form = this;

        if(settings.validate_on_start){
            coreFunction(form, settings);
        }

        this.find('input[data-validate]').on('input',function(){
            coreFunction(form, settings);
        });
	  	

        return this;
    };
})(jQuery);