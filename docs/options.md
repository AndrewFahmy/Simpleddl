
# Options
The library have some options available to change it's behavior
* [Multiple Selection](https://github.com/AndrewFahmy/Simpleddl/blob/master/docs/options.md#multiple-selection)
* [Empty Result Text](https://github.com/AndrewFahmy/Simpleddl/blob/master/docs/options.md#empty-result-text)
* [Default Option Text](https://github.com/AndrewFahmy/Simpleddl/blob/master/docs/options.md#default-option-text)
* [Default Option Value](https://github.com/AndrewFahmy/Simpleddl/blob/master/docs/options.md#default-option-value)
* [Search](https://github.com/AndrewFahmy/Simpleddl/blob/master/docs/options.md#search)
* [Right To Left](https://github.com/AndrewFahmy/Simpleddl/blob/master/docs/options.md#right-to-left)



## Multiple Selection
This option allow multiple value selection on a select control **marked as multiple**. Default **false**
```javascript
$("select").Simpleddl({
   multiple:true
});
```



## Empty Result Text
Setting the text which appears when the select control doesn't have any options. Default **There are no items to select from**
```javascript
$("select").Simpleddl({
   emptyResultText:"No Items present"
});
```



## Default Option Text
Default option is created by the library and this option set it's text. Default **--Please Select--**
**Please don't any default options in the select control itself**
```javascript
$("select").Simpleddl({
   defaultOptionText:"Select a Country"
});
```



## Default Option Value
Same as [Default Option Text](https://github.com/AndrewFahmy/Simpleddl/blob/master/docs/options.md#default-option-text) but this option sets the value. Default **Empty String**
```javascript
$("select").Simpleddl({
   defaultOptionValue:"-1"
});
```



## Search
This options enables or disables the search functionality. Default **true**
```javascript
$("select").Simpleddl({
   search:false
});
```



## Right To Left
This option toggles the right to left functionality. Default **false**
```javascript
$("select").Simpleddl({
   rightToLeft:true
});
```
