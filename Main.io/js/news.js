document.addEventListener("DOMContentLoaded", async () => {
  const openaiKey = "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";
  const unsplashKey = "rQdzV_q30bN4NdAPmQOKXBZRFuOw4Tm7X0mOGJmjQUA";
  const newsContainer = document.getElementById("news-container");

  // STEP 1: Get travel news
  const newsResponse = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${openaiKey}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      model: "gpt-4o-2024-08-06",
      messages: [
        {
          role: "user",
          content: `Give me 3 latest travel news items in this JSON format:
{
  "news": [
    {
      "title": "...",
      "location": "...",
      "description": "..."
    }
  ]
}`
        }
      ]
    })
  });

  const result = await newsResponse.json();
  const newsList = JSON.parse(result.choices[0].message.content).news;

  // STEP 2: For each news item, get image and inject HTML
  for (const item of newsList) {
    const imageRes = await fetch(`https://api.unsplash.com/search/photos?query=${encodeURIComponent(item.location)}&client_id=${unsplashKey}`);
    const imageData = await imageRes.json();
    const imageUrl = imageData?.results?.[0]?.urls?.regular || "img/news-placeholder.jpg";

    const article = document.createElement("article");
    article.className = "media tm-margin-b-20 tm-media-1";
    article.innerHTML = `
      <img src="${imageUrl}" alt="${item.location}" width="280" height="264">
      <div class="media-body tm-media-body-1 tm-media-body-v-center">
        <h3 class="tm-font-semibold tm-color-primary tm-article-title-3">${item.title}</h3>
        <p>${item.description}</p>
      </div>
    `;
    newsContainer.appendChild(article);
  }
});
