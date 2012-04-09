$.require('http://cdn.jquerytools.org/1.2.6/all/jquery.tools.min.js', function() {
  $(tm.init);
});
$.require('/t/tagz.js');

var tm = {
  init: function() {
    tagz.renderUserPanel('.login');
    
    $('#qForm').submit(function() {
      var query = $('input[name="q"]', this).val();
      tm.handleQuery(query);
      return false;
    });
    
    tm.bindObjectActionOverlay('#qForm input[name="createObject"]', 'create');
    
    $('.loading-main')
      .ajaxStart(function() {
        $(this).show();
      })
      .ajaxStop(function() {
        $(this).hide();
      });
    
    $('.objAction-actionButton').click(function() {
      var json = $('#objAction-json').val();
      try {
        var obj = JSON.parse(json);
        if(obj) {
          var callback = function(data) {
            tm.alert(data);
            $('.objAction.dialog .close').click();
            $('#qForm').submit();
          }
          
          if($(this).is('.create')) tagz.create(obj, callback);
          if($(this).is('.edit')) tagz.update(obj, callback);
        }
        else tm.alert('cannot save object: '+json);
      } catch(ex) {
        tm.alert('Failed to parse JSON');
      }
    });
    
    $('.objects .object-option').live('click', function() {
      // get the object container
      var object = $(this).parents('.object');
      var objId = object.attr('id');
      
      if($(this).is('.edit')) {
        if(!$(this).data('overlay')) {
          tm.bindObjectActionOverlay(this, 'edit', function() {
            var objJson = $('.object-json', object).text();
            return objJson;
          });
          var overlay = $(this).data('overlay');
          $(this).click();
          return;
        }
        
        
      }
      if($(this).is('.delete')) tagz.remove(objId, function(data) {
        tm.alert(data);
        $('#qForm').submit();
      })
    });
  },
  
  bindObjectActionOverlay: function(sel, action, getValue) {
    $(sel).overlay({
      target: '.objAction.dialog',
      mask: {
        color: '#000',
        opacity: 0.5
      },
      onBeforeLoad: function() {
        var overlay = this.getOverlay();
        if(action == 'create') overlay.removeClass('edit').addClass('create');
        else if(action == 'edit') overlay.removeClass('create').addClass('edit');
        
        var value = '';
        if(getValue) value = getValue();
        
        $('#objAction-json').text(value);
      }
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
          objectId: obj.meta.id,
          objectJson: JSON.stringify(obj, null, '  ')
        };
        
        $('.objects').append($.template(tm.objTemplate), def);
      }
    });
  }
};
