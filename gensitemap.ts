import axios from 'axios'
import {AppConfigService} from './src/app/app-config.service'
import {generateRegionProvinceTree} from './src/app/app.model'
import { environment as environmentEn } from './src/environments/environment.prod';
import { environment as environmentIt } from './src/environments/environment.it.prod';
import * as fs from "fs";

const _global = (global) as any


(async () => {
        
    const appConfigService = new AppConfigService()
    const response = await axios.get(appConfigService.provincialDataSetUrl)

    // set $localize global function for EN translation
    _global.$localize = () => `NOT ATTRIBUTED YET`
    const sitemap = generateSitemap(response,environmentEn.shareUrl );
    fs.writeFileSync('src/sitemap.xml', sitemap)
    console.log('src/sitemap.xml written')
    
    // set $localize global function for italian translation
    _global.$localize = () => `NON ATTRIBUITO`
    const sitemapIt = generateSitemap(response,environmentIt.shareUrl );
    fs.writeFileSync('src/sitemap-it.xml', sitemapIt)
    console.log('src/sitemap-it.xml written')
})();

function generateSitemap(response, shareUrl) {
    let sitemap = `<?xml version='1.0' encoding='UTF-8'?>\n`;
    sitemap += `<urlset xmlns='http://www.sitemaps.org/schemas/sitemap/0.9'>\n`;
    sitemap += ` <url><loc>${shareUrl}</loc></url>\n`;
    for (let region of generateRegionProvinceTree(response.data)[0].children) {
        sitemap += ` <url><loc>${shareUrl}/#/${encodeURIComponent(region.name)}</loc></url>\n`;
        for (let province of region.children) {
            sitemap += ` <url><loc>${shareUrl}/#/${encodeURIComponent(region.name)}/${encodeURIComponent(province.name)}</loc></url>\n`;
        }
    }
    sitemap += `</urlset>`;
    return sitemap;
}

