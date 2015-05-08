/* global jQuery */

(function($){
	'use strict';

    var validateEmail = function(text, input){
        var pattern = /^.+@.+[.].{2,}$/gi,
        valid = pattern.test(text);
        setBorders(valid, input);
    };

    var validatePassword = function(text, entropy, input){
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

        var valid = passwordEntropy > entropy;
        setBorders(valid, input);
    };

    var validatePostalCode = function(text, input, form){
        var pattern = /^[0-9]{2}-[0-9]{3}$/gi;

        if(pattern.test(text)){
            $.ajax({
                url: 'kody.json',
                dataType: 'json'
            }).done(function(json){
                var kod = json[text],
                miasto = typeof kod !== 'undefined' ? kod['miejscowość'] : '';

                var $msg = input.next('span.city');
                if($msg.length === 0){
                    input.after('<span class="city">'+miasto+'</span>');
                }else{
                    $msg.text(miasto);
                }

                var valid = miasto ? true : false;
                setBorders(valid, input);
                checkIfValid(form);
            });
        }

        return false;
    };

    var validateRegExp = function(text, regexp, input){
        var pattern = new RegExp(regexp, 'gi'),
        valid = pattern.test(text);
        setBorders(valid, input);  
    };

    var setBorders = function(valid, input){
        var cl = valid ? 'ok': 'error';
        input.removeClass('ok error').addClass(cl);
    };

	var validateInput = function(input, settings, form){
		var inputType = input.attr('data-validate'),
        text = input.val();
        setBorders(false, input); 

        switch(inputType){
            case 'email': validateEmail(text,input);
                break;
            case 'password': validatePassword(text, settings.entropy, input);
                break;
            case 'postalcode': validatePostalCode(text, input, form); 
                break;
            default: validateRegExp(text, inputType, input);
        }
        
	};

    var checkIfValid = function(form){
        var valid = true;
        $.each(form.find('input[data-validate]'),function(i,el){
            el = $(el);
            valid = el.hasClass('error') ? false : valid;
        });

        var $sendBtn = form.find('input[type=submit]');
        if(!valid){
            $sendBtn.attr('disabled', 'disabled');
        }else{
            $sendBtn.removeAttr('disabled');
        }
    };

    var validateAllInputs = function(form, settings){
        form.find('input[data-validate]').each(function(i,el){
            var $input = $(el);
            validateInput($input, settings, form);
        });
        checkIfValid(form);
    };

	$.fn.jqValidate = function(options) {

	  	var settings = $.extend({
            validate_on_start: false,
            block_sending: false,
            entropy: 60
        }, options ),
        form = this;

        if(settings.validate_on_start){
            validateAllInputs(form, settings);
        }

        this.find('input[data-validate]').on('input',function(){
            validateInput($(this), settings, form);
            checkIfValid(form);
        });
	  
        return this;
    };
})(jQuery);