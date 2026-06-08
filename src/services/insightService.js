export function calculateInsights(repositories) {
  let totalStars = 0;
  let totalForks = 0;

  const languages = {};

  for (const repo of repositories) {
    totalStars += repo.stargazers_count || 0;
    totalForks += repo.forks_count || 0;

    if (repo.language) {
      languages[repo.language] = (languages[repo.language] || 0) + 1;
    }
  }

  const topLanguage =
    Object.entries(languages).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

  return {
    totalStars,
    totalForks,
    topLanguage,
  };
}
