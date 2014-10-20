//
// Gets the feed URL
//
function getFeedUrl(url){
  if (!url) return;
  
  if ( url.indexOf("/", url.length - 1) == -1 ){
   url += "/"; 
  }
  
  return url + "feed";
}

//
// Gets the feed items for each feed
//
function fetchFeedItemCount(url,optType) {
  var type = optType || "feed";
  var output = [];
  if (!url) return;
  //var url = "http://confessionsofalearningtechnologist.blogspot.com/feeds/posts/default?alt=rss";
  
  // little switch to get rss2 feed for blogger
  if (/\/posts\/default$/.test(url)){
    url += "?alt=rss";
  }
 
  // cache handling to save too many urlfetches
  var cache = CacheService.getPublicCache(); // using Cache service to prevent too many urlfetch 
  var cached = cache.get(url+type);
  if (cached != null && cached != "undefined") { // if value in cache return it
      output = JSON.parse(cached)
      output[0][2] = new Date(output[0][2]);
      return output;
   }
  // otherwise build urlfetch
  var options = {"method" : "get"};
  try {
    var response = UrlFetchApp.fetch(url , options);
    var count = 0;
    var link = "";
    var lastpost = "";
    var doc = Xml.parse(response.getContentText(),true); // parse content as xml
      if (doc.rss.channel.item != undefined ){ // if item is defined get link
        count = 1;
        // if feed items how many
        if (doc.rss.channel.item.length > 0) {
          count = doc.rss.channel.item.length;
          lastpost = new Date(doc.rss.channel.item[0].pubDate.Text);
        } else {
          // if not an items array must just be one
          count = 1;
          lastpost = new Date(doc.rss.channel.item.pubDate.Text);
        }
        // blogger gives total feed count so we can just use this 
        if (doc.rss.channel.totalResults != undefined ){
          count = parseInt(doc.rss.channel.totalResults.Text);
        }
        // get blog url
        if (doc.rss.channel.Text != undefined){
          link = doc.rss.channel.Text.trim();
        } 
        output.push([link,count,lastpost]);
        // cache result
        cache.put(url+type, JSON.stringify(output), 3600); // put result in cache for next time
        return output; 
      } 
    } catch (e){
      return "Bad feed";
    }
  return "--";
}
