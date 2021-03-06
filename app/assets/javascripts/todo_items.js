
$(document).ready(function(){
  TodoApp.getAllTodos();
  $('#new-item-form').submit(TodoApp.addNewItem);
  $('#unfinished-list').on('click', '.complete-button', TodoApp.completeItem);
  $('#unfinished-list').on('click', '.delete-button', TodoApp.deleteItem);
  $('#finished-list').on('click', '.delete-button', TodoApp.deleteItem);
  $('#finished-list').on('click', '.undo-button', TodoApp.undoItem);
});

var TodoApp = {

  getAllTodos: function(){
    $.ajax({
    url: '/todo_items.json'
    }).done(TodoApp.displayLists);
  },

  displayLists: function(items){
    var arrayLength = items.length;
    $('.items').empty();
    $('.items').empty();
    for (var i = 0; i < arrayLength; i = i + 1) {
    var todo_item = items[i];
    todo_item.created_at = moment(todo_item.created_at).fromNow();
      if (todo_item.completed_at === null){
        // Handlebars
        var source = $('#todo_template').html();
        var template = Handlebars.compile(source);
        var todo_item_html = template(todo_item);
        $('#unfinished-list').append(todo_item_html);
      }
      else {
        todo_item.completed_at = moment(todo_item.completed_at).fromNow();
        var source = $('#complete_template').html();
        var template = Handlebars.compile(source);
        var todo_item_html = template(todo_item);
        $('#finished-list').append(todo_item_html);

      }
    }
  },
  addNewItem: function(){
    var $itemInput = $('#new-item').val();
    event.preventDefault();

    if ($itemInput!== '') {
     $.ajax({
      url: '/todo_items',
      type: 'POST',
      dataType: 'json',
      data:  {todo_item: {text: $itemInput}}
     }).done([TodoApp.getAllTodos, TodoApp.clearForm]);
    }
  },
  completeItem: function(event){
    var itemId = this.parentElement.id;
    $.ajax({
      url: '/todo_items/' + itemId,
      type: 'PATCH',
      dataType: 'json',
      data: {todo_item: {completed_at: new Date()}}
    }).done(TodoApp.getAllTodos);
  },
  deleteItem: function(event){
    var itemId = this.parentElement.id;
    $.ajax({
      url: '/todo_items/' + itemId,
      type: 'DELETE',
      dataType: 'json',
    }).done(TodoApp.getAllTodos);
  },
  undoItem: function(event){
    var itemId = this.parentElement.id;
    $.ajax({
      url: '/todo_items/' + itemId,
      type: 'PATCH',
      dataType: 'json',
      data: {todo_item: {completed_at: null}}
    }).done(TodoApp.getAllTodos);
  },
  clearForm: function(event){
    $('#new-item').val('');
  }
};



