feedUtilsForGoogleSpreadsheets
==============================

A couple of simple functions for working with Wordpress blogs in Google Spreadsheets

getFeedUrl(url) gets the normalised URL for the blog (adding /feed as necessary).

fetchFeedItemCount(url) gets the number of posts in the RSS feed for the blog, and the date of the last entry. These are then included in the sheet in cells to the right.
