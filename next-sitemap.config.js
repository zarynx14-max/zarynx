/** @type {import('next-sitemap').IConfig} */
module.exports = {
  siteUrl: 'https://zarynx.com',
  generateRobotsTxt: false,
  changefreq: 'weekly',
  priority: 0.7,
  robotsTxtOptions: {
    policies: [{ userAgent: '*', allow: '/' }],
  },
}
