DROP TABLE IF EXISTS github_users;

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

    total_stars INT DEFAULT 0,
    total_forks INT DEFAULT 0,
    top_language VARCHAR(100),

    created_at DATETIME,
    updated_at DATETIME,

    synced_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);