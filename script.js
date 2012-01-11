$.require('http://cdn.jquerytools.org/1.2.6/all/jquery.tools.min.js', function() {
  $(tm.init);
});
$.require('/t/Tagz.js');

var tm = {
  init: function() {
    tagz.renderUserPanel('.login');
    
    $('#qForm').submit(function() {
      var query = $('input[name="q"]', this).val();
      tm.handleQuery(query);
      return false;
    });
    
    $('#qForm input[name="newObject"]').overlay({
      mask: {
        color: '#000',
        opacity: 0.5
      }
    });
    
    $('#newObject-createButton').click(function() {
      var json = $('#newObject-json').val();
      try {
        var obj = JSON.parse(json);
        if(obj) tagz.create(obj, function(data) {
          tm.alert(data);
          $('#qForm input[name="newObject"]').data('overlay').close();
        });
        else tm.alert('cannot create object: '+json);
      } catch(ex) {
        tm.alert('Failed to parse JSON');
      }
    });
    
    $('.objects .object-option').live('click', function() {
      // get the object container
      var object = $(this).parents('.object');
      var objId = object.attr('id');
      
      if($(this).is('.edit')) tm.alert('will edit '+objId);
      if($(this).is('.delete')) tm.alert('will delete '+objId);
    });
  },
  
  alert: function(str) {
    alert(str);
  },
  
  objTemplate: 
    '<div class="object" id="${objectId}">'+
      '<div class="object-options">'+
        '<input type="button" class="object-option edit" value="Edit" />'+
        '<input type="button" class="object-option delete" value="Delete" />'+
      '</div>'+
      '<pre class="object-json">${objectJson}</pre>'+
    '</div>',
  
  handleQuery: function(query) {
    console.log('querying for '+ query);
    tagz.query(query, function(data) {
      console.log(data);
      $('.objects').empty();
      for(var i=0; i<data.length; i++) {
        var obj = data[i];
        var def = {
          objectId: obj.objectId,
          objectJson: JSON.stringify(obj, null, '  ')
        };
        
        $('.objects').append($.template(tm.objTemplate), def);
      }
    });
  },
  
  handleNewObjectDialog: function() {
    $('.newObject.dialog').overlay({
      top: 200
    });
  }
};
