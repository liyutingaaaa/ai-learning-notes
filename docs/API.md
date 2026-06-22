# API 文档

## 基础信息

- 基础 URL: `http://localhost:8080/api`
- 认证方式: JWT Token (Header: Authorization: Bearer <token>)
- 响应格式: JSON

## 响应格式

### 成功响应
```json
{
  "code": 0,
  "message": "success",
  "data": {}
}
```

### 错误响应
```json
{
  "code": 1,
  "message": "error message",
  "data": null
}
```

## 认证接口

### 用户注册
- **POST** `/auth/register`
- **参数**:
  ```json
  {
    "username": "string",
    "password": "string",
    "email": "string"
  }
  ```
- **返回**: User 对象 + JWT Token

### 用户登录
- **POST** `/auth/login`
- **参数**:
  ```json
  {
    "username": "string",
    "password": "string"
  }
  ```
- **返回**: User 对象 + JWT Token

### 获取当前用户
- **GET** `/auth/me`
- **认证**: 需要
- **返回**: User 对象

## 笔记接口

### 创建笔记
- **POST** `/notes`
- **认证**: 需要
- **参数**:
  ```json
  {
    "title": "string",
    "content": "string",
    "categoryId": "number",
    "tags": ["string"]
  }
  ```

### 获取笔记列表
- **GET** `/notes`
- **认证**: 需要
- **查询参数**:
  - `page`: 页码 (默认 1)
  - `pageSize`: 每页条数 (默认 10)
  - `categoryId`: 分类 ID
  - `tagIds`: 标签 IDs (逗号分隔)
  - `keyword`: 搜索关键词

### 获取单个笔记
- **GET** `/notes/{id}`
- **认证**: 需要

### 更新笔记
- **PUT** `/notes/{id}`
- **认证**: 需要
- **参数**: 同创建笔记

### 删除笔记
- **DELETE** `/notes/{id}`
- **认证**: 需要

## 标签接口

### 获取标签列表
- **GET** `/tags`
- **认证**: 需要

### 创建标签
- **POST** `/tags`
- **认证**: 需要
- **参数**:
  ```json
  {
    "name": "string",
    "color": "string"
  }
  ```

## AI 接口

### 笔记总结
- **POST** `/ai/summarize`
- **认证**: 需要
- **参数**:
  ```json
  {
    "noteId": "number"
  }
  ```
- **返回**: 总结结果

### 提取关键词
- **POST** `/ai/extract-keywords`
- **认证**: 需要
- **参数**:
  ```json
  {
    "noteId": "number"
  }
  ```

### 生成题目
- **POST** `/ai/generate-questions`
- **认证**: 需要
- **参数**:
  ```json
  {
    "noteId": "number",
    "count": "number"
  }
  ```
