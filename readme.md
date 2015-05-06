# Jquery validator plugin

## How to use ?

- Add jqvalidate.js to your site, right after jQuery.
- Create form with some inputs.
- Add data-validate attribute to inputs you want validate with value:
	- password → to validate password within its power
	- email → obvious
	- postalcode → to validate input within pattern like 00-000 and to show city it belongs to
	- you own pattern for example: [A-Z]*

- In your script add to form jQuery object .jqValidate(setings), for example:
```javascript
	$('#myForm').jqValidate({
			validate_on_start: true,
			block_sending: true
	});
```

## SETTINGS
```javascript
	{
        validate_on_start: false, //validate your form right after page loads
        block_sending: false,     //make submit disabled when form not valid
        entropy: 60				  //make your password valid if its entropy reaches 60
    }
```