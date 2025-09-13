const express = require('express');
const path = require('path');

const app = express();
const port = 5001;

// Middleware để parse form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// Serve static files từ thư mục public và page
app.use(express.static(path.join(__dirname, 'public')));
app.use('/page', express.static(path.join(__dirname, 'page')));

// Route cho trang chủ với form đăng nhập
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'page', 'loginpage.html'));
});

// Route xử lý đăng nhập
app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Kiểm tra thông tin đăng nhập với validation nghiêm ngặt
  if (!username || !password) {
    return res.redirect('/page/error.html?error=missing_fields');
  }

  if (username.trim() !== 'admin') {
    return res.redirect('/page/error.html?error=invalid_username');
  }

  if (password !== '123456') {
    return res.redirect('/page/error.html?error=invalid_password');
  }

  // Đăng nhập thành công
  res.redirect(`/page/success.html?username=${encodeURIComponent(username)}`);
});

// Route API để validate real-time (tùy chọn)
app.post('/api/validate', (req, res) => {
  const { field, value } = req.body;
  
  let isValid = false;
  let message = '';
  
  if (field === 'username') {
    isValid = value === 'admin';
    message = isValid ? 'Username hợp lệ!' : 'Username phải là "admin"';
  } else if (field === 'password') {
    isValid = value === '123456';
    message = isValid ? 'Mật khẩu hợp lệ!' : 'Mật khẩu phải là "123456"';
  }
  
  res.json({ valid: isValid, message: message });
});

app.listen(port, () => {
  console.log(`Server đang chạy tại http://localhost:${port}`);
});
