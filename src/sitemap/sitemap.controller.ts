import { Controller, Get, Res } from '@nestjs/common';
import { Response } from 'express';
import { PrismaService } from '../prisma/prisma.service';

@Controller('sitemap')
export class SitemapController {
  constructor(private prisma: PrismaService) {}

  @Get('xml')
  async generateSitemap(@Res() res: Response) {
    try {
      const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
      
      // Static pages
      const staticPages = [
        { url: '/', priority: '1.0', changefreq: 'weekly' },
        { url: '/about', priority: '0.8', changefreq: 'monthly' },
        { url: '/services', priority: '0.9', changefreq: 'weekly' },
        { url: '/services/residential', priority: '0.8', changefreq: 'monthly' },
        { url: '/services/commercial', priority: '0.8', changefreq: 'monthly' },
        { url: '/services/events', priority: '0.8', changefreq: 'monthly' },
        { url: '/services/bodyguard', priority: '0.8', changefreq: 'monthly' },
        { url: '/contact', priority: '0.7', changefreq: 'monthly' },
        { url: '/careers', priority: '0.6', changefreq: 'weekly' },
        { url: '/blog', priority: '0.7', changefreq: 'daily' }
      ];

      // Get dynamic content
      const [blogs, projects, services] = await Promise.all([
        this.prisma.blog.findMany({ 
          where: { published: true },
          select: { 
            slug: true, 
            updatedAt: true
          }
        }),
        this.prisma.project.findMany({
          where: { featured: true },
          select: { 
            id: true,
            title: true,
            updatedAt: true 
          }
        }),
        this.prisma.service.findMany({
          where: { active: true },
          select: { 
            id: true,
            title: true,
            updatedAt: true 
          }
        })
      ]);

      // Generate XML
      let xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

      // Add static pages
      staticPages.forEach(page => {
        xml += `
  <url>
    <loc>${baseUrl}${page.url}</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
      });

      // Add blog posts
      blogs.forEach(blog => {
        xml += `
  <url>
    <loc>${baseUrl}/blog/${blog.slug}</loc>
    <lastmod>${blog.updatedAt.toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.6</priority>
  </url>`;
      });

      // Add projects
      projects.forEach(project => {
        const slug = project.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        xml += `
  <url>
    <loc>${baseUrl}/projects/${slug}</loc>
    <lastmod>${project.updatedAt.toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
      });

      // Add services
      services.forEach(service => {
        const slug = service.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
        xml += `
  <url>
    <loc>${baseUrl}/services/${slug}</loc>
    <lastmod>${service.updatedAt.toISOString().split('T')[0]}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
      });

      xml += `
</urlset>`;

      res.set({
        'Content-Type': 'application/xml',
        'Cache-Control': 'public, max-age=86400', // Cache for 24 hours
      });

      res.send(xml);
    } catch (error) {
      console.error('Error generating sitemap:', error);
      res.status(500).send('Error generating sitemap');
    }
  }

  @Get('robots.txt')
  async generateRobotsTxt(@Res() res: Response) {
    const baseUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    
    const robotsTxt = `# Falcon Security Limited Robots.txt
User-agent: *
Allow: /

# Sitemaps
Sitemap: ${baseUrl}/sitemap.xml

# Disallow admin and private areas
Disallow: /admin/
Disallow: /api/admin/
Disallow: /login
Disallow: /dashboard

# Allow important pages
Allow: /
Allow: /about
Allow: /services
Allow: /contact
Allow: /blog
Allow: /careers

# Crawl-delay for respectful crawling
Crawl-delay: 1`;

    res.set({
      'Content-Type': 'text/plain',
      'Cache-Control': 'public, max-age=86400',
    });

    res.send(robotsTxt);
  }
}