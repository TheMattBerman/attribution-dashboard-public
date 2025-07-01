// Live Feed Diagnostic Script
// Run this in the browser console to diagnose live feed issues

async function diagnoseLiveFeed() {
    console.log('🔍 Starting Live Feed Diagnostic...\n');
    
    const results = {
        issues: [],
        successes: [],
        recommendations: []
    };
    
    // 1. Check Dashboard State
    console.log('📊 Checking Dashboard State...');
    if (typeof dashboardState === 'undefined') {
        results.issues.push('❌ dashboardState is not defined');
        console.error('❌ dashboardState is not defined');
    } else {
        results.successes.push('✅ dashboardState is available');
        console.log('✅ dashboardState is available');
        
        if (!dashboardState.liveFeed) {
            results.issues.push('❌ dashboardState.liveFeed is not initialized');
            console.error('❌ dashboardState.liveFeed is not initialized');
        } else {
            results.successes.push('✅ dashboardState.liveFeed is initialized');
            console.log('✅ dashboardState.liveFeed is initialized');
            console.log(`   Current mentions count: ${dashboardState.liveFeed.mentions?.length || 0}`);
        }
    }
    
    // 2. Check API Status
    console.log('\n🔐 Checking API Status...');
    if (dashboardState?.apiStatus) {
        const scrapeCreatorsStatus = dashboardState.apiStatus.scrapeCreators;
        const exaSearchStatus = dashboardState.apiStatus.exaSearch;
        
        console.log(`   ScrapeCreators: ${scrapeCreatorsStatus}`);
        console.log(`   Exa Search: ${exaSearchStatus}`);
        
        if (scrapeCreatorsStatus === 'connected') {
            results.successes.push('✅ ScrapeCreators API is connected');
        } else {
            results.issues.push(`❌ ScrapeCreators API is ${scrapeCreatorsStatus}`);
        }
        
        if (exaSearchStatus === 'connected') {
            results.successes.push('✅ Exa Search API is connected');
        } else {
            results.issues.push(`❌ Exa Search API is ${exaSearchStatus}`);
        }
        
        if (scrapeCreatorsStatus !== 'connected' && exaSearchStatus !== 'connected') {
            results.recommendations.push('🔧 Connect at least one API (ScrapeCreators or Exa Search) in the Integrations section');
        }
    }
    
    // 3. Check Required Functions
    console.log('\n🔧 Checking Required Functions...');
    const requiredFunctions = [
        'populateLiveFeed',
        'refreshFeedWithRealData',
        'fetchSocialData',
        'fetchWebMentions'
    ];
    
    requiredFunctions.forEach(funcName => {
        if (typeof window[funcName] === 'function') {
            results.successes.push(`✅ ${funcName} is available`);
            console.log(`✅ ${funcName} is available`);
        } else {
            results.issues.push(`❌ ${funcName} is not available`);
            console.error(`❌ ${funcName} is not available`);
        }
    });
    
    // 4. Test Backend Endpoints
    console.log('\n🌐 Testing Backend Endpoints...');
    
    try {
        console.log('   Testing /api/fetch-mentions...');
        const fetchResponse = await fetch('/api/fetch-mentions?days_back=7&platform=all', {
            credentials: 'include'
        });
        const fetchResult = await fetchResponse.json();
        
        if (fetchResult.status === 'success') {
            results.successes.push(`✅ /api/fetch-mentions responded successfully`);
            console.log(`✅ /api/fetch-mentions responded with ${fetchResult.data?.length || 0} mentions`);
            console.log(`   Source: ${fetchResult.source}`);
            
            if (fetchResult.data?.length > 0) {
                results.successes.push('✅ Backend has mention data available');
            } else {
                results.issues.push('❌ Backend returned no mention data');
                if (fetchResult.source === 'empty') {
                    results.recommendations.push('🔧 Try refreshing data using the refresh button or refresh-mentions endpoint');
                }
            }
        } else {
            results.issues.push(`❌ /api/fetch-mentions failed: ${fetchResult.message}`);
            console.error(`❌ /api/fetch-mentions failed:`, fetchResult);
        }
    } catch (error) {
        results.issues.push(`❌ Error testing /api/fetch-mentions: ${error.message}`);
        console.error('❌ Error testing /api/fetch-mentions:', error);
    }
    
    // 5. Test Manual Refresh
    console.log('\n🔄 Testing Manual Refresh...');
    try {
        console.log('   Testing /api/refresh-mentions...');
        const refreshResponse = await fetch('/api/refresh-mentions', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
                days_back: 7,
                platform: 'all'
            })
        });
        const refreshResult = await refreshResponse.json();
        
        if (refreshResult.status === 'success') {
            results.successes.push(`✅ /api/refresh-mentions worked`);
            console.log(`✅ /api/refresh-mentions returned ${refreshResult.data?.length || 0} fresh mentions`);
            
            if (refreshResult.data?.length > 0) {
                results.successes.push('✅ APIs are returning fresh data');
                
                // Check if data is making it to frontend
                if (dashboardState?.liveFeed?.mentions?.length > 0) {
                    results.successes.push('✅ Fresh data is in frontend state');
                } else {
                    results.issues.push('❌ Fresh data not reaching frontend state');
                    results.recommendations.push('🔧 Check refreshFeedWithRealData function for data processing issues');
                }
            } else {
                results.issues.push('❌ APIs are not returning any data');
                results.recommendations.push('🔧 Check your brand name configuration and API key validity');
            }
        } else {
            results.issues.push(`❌ /api/refresh-mentions failed: ${refreshResult.message}`);
            console.error(`❌ /api/refresh-mentions failed:`, refreshResult);
        }
    } catch (error) {
        results.issues.push(`❌ Error testing /api/refresh-mentions: ${error.message}`);
        console.error('❌ Error testing /api/refresh-mentions:', error);
    }
    
    // 6. Check DOM Elements
    console.log('\n🎨 Checking DOM Elements...');
    const mentionsFeedElement = document.getElementById('mentionsFeed');
    if (mentionsFeedElement) {
        results.successes.push('✅ mentionsFeed DOM element exists');
        console.log('✅ mentionsFeed DOM element exists');
        console.log(`   Current content length: ${mentionsFeedElement.innerHTML.length}`);
    } else {
        results.issues.push('❌ mentionsFeed DOM element not found');
        console.error('❌ mentionsFeed DOM element not found');
    }
    
    // 7. Generate Summary Report
    console.log('\n📋 DIAGNOSTIC SUMMARY');
    console.log('='.repeat(50));
    
    if (results.successes.length > 0) {
        console.log('\n✅ SUCCESSES:');
        results.successes.forEach(success => console.log(`   ${success}`));
    }
    
    if (results.issues.length > 0) {
        console.log('\n❌ ISSUES FOUND:');
        results.issues.forEach(issue => console.log(`   ${issue}`));
    }
    
    if (results.recommendations.length > 0) {
        console.log('\n🔧 RECOMMENDATIONS:');
        results.recommendations.forEach(rec => console.log(`   ${rec}`));
    }
    
    // 8. Provide specific next steps
    console.log('\n🚀 NEXT STEPS:');
    
    if (results.issues.some(issue => issue.includes('API is disconnected'))) {
        console.log('   1. Go to Integrations section and connect your APIs');
        console.log('   2. Enter your ScrapeCreators API key and/or Exa Search API key');
        console.log('   3. Test the connections to ensure they work');
    }
    
    if (results.issues.some(issue => issue.includes('Backend returned no mention data'))) {
        console.log('   1. Click the refresh button in the live feed');
        console.log('   2. Check your brand name is configured correctly');
        console.log('   3. Verify your API keys have proper permissions');
    }
    
    if (results.issues.some(issue => issue.includes('Fresh data not reaching frontend'))) {
        console.log('   1. Check browser console for JavaScript errors');
        console.log('   2. Try refreshing the entire page');
        console.log('   3. Clear browser cache and reload');
    }
    
    console.log('\n✨ Diagnostic complete!');
    
    return {
        summary: {
            successCount: results.successes.length,
            issueCount: results.issues.length,
            recommendationCount: results.recommendations.length
        },
        details: results
    };
}

// Quick fix function to try common solutions
async function quickFixLiveFeed() {
    console.log('🛠️ Attempting Quick Fixes...\n');
    
    try {
        // 1. Ensure liveFeed is initialized
        if (!dashboardState.liveFeed) {
            dashboardState.liveFeed = {
                mentions: [],
                isActive: true,
                lastUpdate: new Date(),
                filters: {
                    platform: '',
                    sentiment: '',
                    keyword: ''
                }
            };
            console.log('✅ Initialized liveFeed in dashboardState');
        }
        
        // 2. Try to refresh data
        if (typeof refreshFeedWithRealData === 'function') {
            console.log('🔄 Attempting to refresh feed with real data...');
            await refreshFeedWithRealData();
            console.log('✅ refreshFeedWithRealData completed');
        }
        
        // 3. Try to populate the feed
        if (typeof populateLiveFeed === 'function') {
            console.log('🎨 Populating live feed display...');
            populateLiveFeed();
            console.log('✅ populateLiveFeed completed');
        }
        
        // 4. Update feed stats
        if (typeof updateFeedStats === 'function') {
            console.log('📊 Updating feed statistics...');
            updateFeedStats();
            console.log('✅ updateFeedStats completed');
        }
        
        console.log('\n✨ Quick fixes applied! Check your live feed now.');
        
    } catch (error) {
        console.error('❌ Error during quick fix:', error);
    }
}

// Export functions to global scope
window.diagnoseLiveFeed = diagnoseLiveFeed;
window.quickFixLiveFeed = quickFixLiveFeed;

console.log('🔍 Live Feed Diagnostic Script Loaded!');
console.log('📋 Run diagnoseLiveFeed() to diagnose issues');
console.log('🛠️ Run quickFixLiveFeed() to attempt automatic fixes'); 