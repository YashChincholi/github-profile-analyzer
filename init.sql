CREATE DATABASE IF NOT EXISTS githubdb;

USE githubdb;

CREATE TABLE IF NOT EXISTS github_users (
  id INT PRIMARY KEY,
  login VARCHAR(255),
  name VARCHAR(255),
  company VARCHAR(255),
  blog VARCHAR(255),
  location VARCHAR(255),
  public_repos INT,
  followers INT,
  following INT,
  created_at DATETIME,
  updated_at DATETIME
);