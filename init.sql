CREATE DATABASE IF NOT EXISTS githubdb;

USE githubdb;

CREATE TABLE github_users (
  github_id BIGINT PRIMARY KEY,
  login VARCHAR(255) NOT NULL UNIQUE,
  name VARCHAR(255),
  company VARCHAR(255),
  blog VARCHAR(500),
  location VARCHAR(255),

  public_repos INT DEFAULT 0,
  followers INT DEFAULT 0,
  following INT DEFAULT 0,

  created_at DATETIME,
  updated_at DATETIME,

  synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);