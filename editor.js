// 初始化富文本编辑器
tinymce.init({
  selector: '#editor',
  height: 300,
  plugins: 'advlist autolink lists link image charmap print preview anchor',
  toolbar: 'undo redo | bold italic underline | alignleft aligncenter alignright | bullist numlist outdent indent | link image'
});