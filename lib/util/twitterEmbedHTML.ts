export const twitterEmbedHTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Twitter Timeline Embed</title>
  <link rel="preconnect" href="https://platform.twitter.com">
  <style>
    html, body {
      margin: 0;
      padding: 0;
      font-family: sans-serif;
      color: #fff;
      overflow-y: auto;
      background-color: #000;
    }

    .error-container {
      display: none;
      text-align: center;
      padding: 20px;
    }

    .error-message {
      background-color: #1D1D1D;
      padding: 16px;
      border: 1px solid #383838;
      border-radius: 8px;
      margin: 0 16px;
    }

    /* Improved Reload Button */
    .reload-button {
      display: block;
      margin: 20px auto;
      padding: 12px 24px;
      background-color: #1D1D1D;
      color: white;
      font-size: 16px;
      border: none;
      border-radius: 8px;
      cursor: pointer;
    }

    /* Improved Skeleton Styles */
    .skeleton-tweets {
      padding: 16px;
    }

    .skeleton-tweet {
      background-color: #111;
      border-radius: 16px;
      padding: 16px;
      margin-bottom: 16px;
      border: 1px solid #383838;
      position: relative;
      overflow: hidden;
    }

    .skeleton-header {
      display: flex;
      align-items: center;
      margin-bottom: 12px;
    }

    .skeleton-avatar {
      width: 48px;
      height: 48px;
      border-radius: 50%;
      background-color: #222;
      margin-right: 12px;
    }

    .skeleton-name-container {
      flex-grow: 1;
    }

    .skeleton-name {
      height: 16px;
      width: 120px;
      background-color: #222;
      margin-bottom: 6px;
    }

    .skeleton-handle {
      height: 12px;
      width: 80px;
      background-color: #222;
    }

    .skeleton-content {
      margin-bottom: 12px;
    }

    .skeleton-text-line {
      height: 14px;
      background-color: #222;
      margin-bottom: 8px;
    }

    .skeleton-actions {
      display: flex;
      justify-content: space-between;
    }

    .skeleton-action {
      width: 40px;
      height: 16px;
      background-color: #222;
    }

    /* Skeleton Loading Animation */
    @keyframes pulse {
      0% { opacity: 0.6; }
      50% { opacity: 0.3; }
      100% { opacity: 0.6; }
    }

    .skeleton-tweet::before {
      content: '';
      position: absolute;
      top: 0;
      left: -100%;
      width: 100%;
      height: 100%;
      background: linear-gradient(to right, transparent 0%, rgba(255,255,255,0.1) 50%, transparent 100%);
      animation: pulse 1.5s infinite;
    }
  </style>
</head>
<body>
  <!-- Twitter skeleton placeholder while loading -->
  <div id="twitter-skeleton" class="skeleton-tweets">
    <!-- Tweet 1 -->
    <div class="skeleton-tweet">
      <div class="skeleton-header">
        <div class="skeleton-avatar"></div>
        <div class="skeleton-name-container">
          <div class="skeleton-name"></div>
          <div class="skeleton-handle"></div>
        </div>
      </div>
      <div class="skeleton-content">
        <div class="skeleton-text-line" style="width: 95%"></div>
        <div class="skeleton-text-line" style="width: 90%"></div>
        <div class="skeleton-text-line" style="width: 85%"></div>
        <div class="skeleton-text-line" style="width: 60%"></div>
      </div>
      <div class="skeleton-actions">
        <div class="skeleton-action"></div>
        <div class="skeleton-action"></div>
        <div class="skeleton-action"></div>
        <div class="skeleton-action"></div>
      </div>
    </div>
    <!-- Tweet 2 -->
    <div class="skeleton-tweet">
      <div class="skeleton-header">
        <div class="skeleton-avatar"></div>
        <div class="skeleton-name-container">
          <div class="skeleton-name"></div>
          <div class="skeleton-handle"></div>
        </div>
      </div>
      <div class="skeleton-content">
        <div class="skeleton-text-line" style="width: 100%"></div>
        <div class="skeleton-text-line" style="width: 92%"></div>
        <div class="skeleton-text-line" style="width: 88%"></div>
      </div>
      <div class="skeleton-actions">
        <div class="skeleton-action"></div>
        <div class="skeleton-action"></div>
        <div class="skeleton-action"></div>
        <div class="skeleton-action"></div>
      </div>
    </div>
    <!-- Tweet 3 -->
    <div class="skeleton-tweet">
      <div class="skeleton-header">
        <div class="skeleton-avatar"></div>
        <div class="skeleton-name-container">
          <div class="skeleton-name"></div>
          <div class="skeleton-handle"></div>
        </div>
      </div>
      <div class="skeleton-content">
        <div class="skeleton-text-line" style="width: 96%"></div>
        <div class="skeleton-text-line" style="width: 94%"></div>
        <div class="skeleton-text-line" style="width: 70%"></div>
      </div>
      <div class="skeleton-actions">
        <div class="skeleton-action"></div>
        <div class="skeleton-action"></div>
        <div class="skeleton-action"></div>
        <div class="skeleton-action"></div>
      </div>
    </div>
  </div>
  
  <!-- Twitter timeline container (initially empty) -->
  <div id="twitter-container"></div>
  
  <!-- Error Container with Reload Button -->
  <div id="error-container" class="error-container">
    <div class="error-message">
      <p>Unable to load Twitter content.</p>
      <button id="reload-button" class="reload-button">Reload Content</button>
    </div>
  </div>
  
  <!-- Defer Twitter widget loading -->
  <script defer src="https://platform.twitter.com/widgets.js" charset="utf-8"></script>
  
  <script>
    // Hide skeleton loading and show actual tweets
    function hideSkeletonShowTweets() {
      var skeletonElem = document.getElementById("twitter-skeleton");
      var errorContainer = document.getElementById("error-container");
      if (skeletonElem) {
        skeletonElem.style.display = "none";
      }
      if (errorContainer) {
        errorContainer.style.display = "none";
      }
    }
    
    function updateHeight() {
      const twitterContainer = document.getElementById('twitter-container');
      const height = twitterContainer ? twitterContainer.scrollHeight : 0;
      window.ReactNativeWebView.postMessage(JSON.stringify({
        action: 'resize',
        height: height
      }));
    }
    
    function resetToInitialState() {
      // Reset skeleton
      document.getElementById('twitter-skeleton').style.display = 'block';
      
      // Clear twitter container
      document.getElementById('twitter-container').innerHTML = '';
      
      // Hide error container
      document.getElementById('error-container').style.display = 'none';
      
      // Reset height
      updateHeight();
    }
    
    function loadTwitterTimeline() {
      // Reset to initial state
      resetToInitialState();
      
      // Set a timeout to handle Twitter loading failure
      const twitterTimeout = setTimeout(() => {
        showErrorState();
      }, 100000);
      
      if (window.twttr && twttr.widgets) {
        twttr.widgets
          .createTimeline(
            {
              sourceType: "profile",
              screenName: "Polkadot"
            },
            document.getElementById("twitter-container"),
            {
              chrome: "noheader nofooter noborders noscrollbar",
              theme: "dark",
              tweetLimit: 5
            }
          )
          .then(function (el) {
            clearTimeout(twitterTimeout);
            hideSkeletonShowTweets();
            updateHeight();
            
            // Let React Native know tweets are loaded
            window.ReactNativeWebView.postMessage(JSON.stringify({
              action: 'tweetsLoaded'
            }));
          })
          .catch(function(error) {
            clearTimeout(twitterTimeout);
            showErrorState();
          });
      }
    }
    
    function showErrorState() {
      document.getElementById('twitter-skeleton').style.display = 'none';
      document.getElementById('twitter-container').innerHTML = '';
      document.getElementById('error-container').style.display = 'block';
      updateHeight();
    }
    
    window.onload = function () {
      // Add event listener to reload button
      document.getElementById('reload-button').addEventListener('click', loadTwitterTimeline);
      
      // Initial load
      loadTwitterTimeline();
    };
  </script>
</body>
</html>`