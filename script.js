// 模拟文章数据存储
let articles = [];

// 发布文章
document.getElementById('publish-btn').addEventListener('click', function () {
  const title = document.getElementById('article-title').value;
  const summary = document.getElementById('article-summary').value;
  const category = document.getElementById('article-category').value;
  const content = tinymce.get('editor').getContent();

  const newArticle = {
    id: Date.now(),
    title: title,
    summary: summary,
    category: category,
    content: content,
    author: '平台用户',
    publishTime: new Date().toLocaleString()
  };

  articles.push(newArticle);
  renderArticleList();

  // 清空表单
  document.getElementById('article-title').value = '';
  document.getElementById('article-summary').value = '';
  tinymce.get('editor').setContent('');
});

// 渲染文章列表
function renderArticleList() {
  const categoryFilter = document.getElementById('category-filter').value;
  const articleList = document.getElementById('article-list');
  articleList.innerHTML = '';

  const filteredArticles = categoryFilter === 'all' ? articles : articles.filter(article => article.category === categoryFilter);

  filteredArticles.forEach(article => {
    const articleDiv = document.createElement('div');
    articleDiv.innerHTML = `
      <h3><a href="#" data-id="${article.id}">${article.title}</a></h3>
      <p>${article.summary}</p>
      <p>发布时间: ${article.publishTime}</p>
      <p>分类: ${article.category}</p>
      ${canManage(article) ? `<button data-id="${article.id}" class="delete-btn">删除</button> <button data-id="${article.id}" class="edit-btn">修改</button>` : ''}
    `;
    articleList.appendChild(articleDiv);
  });

  // 绑定文章详情点击事件
  const articleLinks = document.querySelectorAll('#article-list a');
  articleLinks.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const articleId = parseInt(this.dataset.id);
      showArticleDetail(articleId);
    });
  });

  // 绑定删除按钮事件
  const deleteButtons = document.querySelectorAll('.delete-btn');
  deleteButtons.forEach(button => {
    button.addEventListener('click', function () {
      const articleId = parseInt(this.dataset.id);
      deleteArticle(articleId);
    });
  });

  // 绑定修改按钮事件
  const editButtons = document.querySelectorAll('.edit-btn');
  editButtons.forEach(button => {
    button.addEventListener('click', function () {
      const articleId = parseInt(this.dataset.id);
      editArticle(articleId);
    });
  });
}

// 显示文章详情
function showArticleDetail(articleId) {
  const article = articles.find(article => article.id === articleId);
  const articleDetail = document.getElementById('article-detail');
  articleDetail.innerHTML = `
    <h2>${article.title}</h2>
    <p>作者: ${article.author}</p>
    <p>发布时间: ${article.publishTime}</p>
    <p>分类: ${article.category}</p>
    <div>${article.content}</div>
  `;
  articleDetail.style.display = 'block';
}

// 判断是否可以管理文章
function canManage(article) {
  const publishTime = new Date(article.publishTime);
  const now = new Date();
  const diff = (now - publishTime) / (1000 * 60 * 60);
  return diff <= 24;
}

// 删除文章
function deleteArticle(articleId) {
  if (confirm('确定要删除这篇文章吗？')) {
    articles = articles.filter(article => article.id !== articleId);
    renderArticleList();
    document.getElementById('article-detail').style.display = 'none';
  }
}

// 修改文章
function editArticle(articleId) {
  const article = articles.find(article => article.id === articleId);
  if (canManage(article)) {
    document.getElementById('article-title').value = article.title;
    document.getElementById('article-summary').value = article.summary;
    document.getElementById('article-category').value = article.category;
    tinymce.get('editor').setContent(article.content);

    // 移除原文章
    articles = articles.filter(a => a.id !== articleId);

    // 隐藏详情页
    document.getElementById('article-detail').style.display = 'none';
  }
}

// 分类筛选
document.getElementById('category-filter').addEventListener('change', renderArticleList);

// 初始化文章列表
renderArticleList();