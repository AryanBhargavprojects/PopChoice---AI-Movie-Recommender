Task: Fixing the UI 

1. I can see the UI is little off, the recommendation should be the whold page:function updateUI(recommendation, posterUrl, title) {
    const main = document.querySelector('main');
    main.innerHTML = `
        <div class="recommendation-container">
            <h2 class="movie-title">${title}</h2>
            <img src="${posterUrl}" alt="${title} Poster" class="movie-poster">
            <p class="ai-recommendation">${recommendation}</p>
            <button onclick="location.reload()" class="submit-btn" style="margin-top: 20px;">Go Again</button>
        </div>
    `;
}
Like this: ![alt text](image.png)

with 
.poster dimension; width: 325px, height: 480px
.title dimension width: 326px, height: 39px with Roboto Slab and 30px, and bold

and the whole recommendation layout should be: width: 393px, and height: 852px

In the recommendation we don't need the         <header>
            <img src="Asset/PopChoice Icon.png" alt="PopChoice Logo" class="logo">
            <h1 class="title">PopChoice</h1>
        </header>

* so we can replace the whole <div class="container">

Please refer to this image for the deisgn: ![alt text](image.png)

This is the current implementation image: ![alt text](image-1.png)

