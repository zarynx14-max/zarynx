/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://zarynx.com',
  generateRobotsTxt: true,
  changefreq: 'weekly',
  priority: 0.7,
  robotsTxtOptions: {
    policies: [{ userAgent: '*', allow: '/' }],
  },
}
