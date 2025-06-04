const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

// Function to test if a URL is accessible
function testUrl(url) {
    return new Promise((resolve) => {
        const client = url.startsWith('https:') ? https : http;
        const req = client.request(url, { method: 'HEAD', timeout: 10000 }, (res) => {
            resolve({
                url,
                status: res.statusCode,
                working: res.statusCode === 200,
                headers: res.headers
            });
        });

        req.on('error', (error) => {
            resolve({
                url,
                status: 'ERROR',
                working: false,
                error: error.message
            });
        });

        req.on('timeout', () => {
            req.destroy();
            resolve({
                url,
                status: 'TIMEOUT',
                working: false,
                error: 'Request timeout'
            });
        });

        req.end();
    });
}

// Extract image URLs from mock data
function extractImageUrls() {
    const mockDataPath = path.join(__dirname, '..', 'data', 'mockData.ts');
    const mockDataContent = fs.readFileSync(mockDataPath, 'utf8');

    // Regex to find image URLs
    const urlRegex = /https:\/\/images\.unsplash\.com\/[^"'`]+/g;
    const matches = mockDataContent.match(urlRegex) || [];

    // Remove query parameters and duplicates
    const uniqueUrls = [...new Set(matches.map(url => url.split('?')[0]))];

    return uniqueUrls;
}

// Main test function
async function testAllImageUrls() {
    console.log('🔍 Extracting image URLs from mock data...\n');

    const imageUrls = extractImageUrls();
    console.log(`Found ${imageUrls.length} unique image URLs to test\n`);

    console.log('🧪 Testing image URLs...\n');

    const results = await Promise.all(imageUrls.map(testUrl));

    // Separate working and non-working URLs
    const workingUrls = results.filter(r => r.working);
    const brokenUrls = results.filter(r => !r.working);

    console.log('📊 RESULTS:');
    console.log('='.repeat(50));

    if (workingUrls.length > 0) {
        console.log(`\n✅ WORKING URLS (${workingUrls.length}):`);
        workingUrls.forEach(result => {
            console.log(`   ✓ ${result.url}`);
        });
    }

    if (brokenUrls.length > 0) {
        console.log(`\n❌ BROKEN URLS (${brokenUrls.length}):`);
        brokenUrls.forEach(result => {
            console.log(`   ✗ ${result.url}`);
            console.log(`     Status: ${result.status}`);
            if (result.error) {
                console.log(`     Error: ${result.error}`);
            }
            console.log('');
        });
    }

    console.log('='.repeat(50));
    console.log(`📈 SUMMARY: ${workingUrls.length}/${results.length} images are working (${Math.round(workingUrls.length / results.length * 100)}%)`);

    // Generate replacement URLs for broken ones
    if (brokenUrls.length > 0) {
        console.log('\n🔧 SUGGESTED REPLACEMENTS:');
        console.log('Here are some alternative wedding photography images from Unsplash:');

        const replacementUrls = [
            'https://images.unsplash.com/photo-1606216794074-735e91aa2c92',
            'https://images.unsplash.com/photo-1583939003579-730e3918a45a',
            'https://images.unsplash.com/photo-1594736797933-d0401ba2fe65',
            'https://images.unsplash.com/photo-1522673607200-164d1b6ce486',
            'https://images.unsplash.com/photo-1525258807787-8757f08c0f2c',
            'https://images.unsplash.com/photo-1537633552985-df8429e8048b',
            'https://images.unsplash.com/photo-1511285560929-80b456fea0bc',
            'https://images.unsplash.com/photo-1465495976277-4387d4b0e4a6',
            'https://images.unsplash.com/photo-1519741497674-611481863552',
            'https://images.unsplash.com/photo-1445019980597-93fa8acb246c'
        ];

        replacementUrls.forEach((url, index) => {
            if (index < brokenUrls.length) {
                console.log(`   Replace: ${brokenUrls[index].url}`);
                console.log(`   With:    ${url}`);
                console.log('');
            }
        });
    }

    if (brokenUrls.length === 0) {
        console.log('\n🎉 All image URLs are working perfectly!');
    }
}

// Run the test
testAllImageUrls().catch(console.error); 