// colocated details interactions
(() => {
  const favBtn = document.getElementById("favBtn");
  const favText = document.getElementById("favText");
  const reviewsBox = document.getElementById("reviewsBox");
  const reviewsList = reviewsBox ? reviewsBox.querySelector(".reviews-list") : null;
  const ratingBadge = document.querySelector(".rating");

  if (favBtn && favText) {
    const bookId = favBtn.dataset.bookId;
    let favored = favBtn.dataset.favored === "true";
    const updateFavoriteUI = (isFavored) => {
      favBtn.dataset.favored = String(isFavored);
      favBtn.classList.toggle("btn-primary", isFavored);
      favText.textContent = isFavored ? "Favorited" : "Add to Favorites";
    };
    favBtn.addEventListener("click", async () => {
      if (!bookId) return;
      try {
        if (!favored) {
          const res = await fetch(`/favorites/${bookId}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
          });
          if (!res.ok) throw new Error("Failed to favorite");
          favored = true;
          updateFavoriteUI(true);
        } else {
          const res = await fetch(`/favorites/${bookId}`, {
            method: "DELETE",
            credentials: "include",
          });
          if (!res.ok) throw new Error("Failed to unfavorite");
          favored = false;
          updateFavoriteUI(false);
        }
      } catch (error) {
        alert(error.message || "Unable to update favorites right now.");
      }
    });
  }

  const reviewForm = document.getElementById("reviewForm");
  if (reviewForm && reviewsBox && reviewsList) {
    let reviewCount = Number(reviewsBox.dataset.reviewCount || 0);
    let averageRating = Number(reviewsBox.dataset.reviewAverage || 0);
    reviewForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const action = reviewForm.getAttribute("action");
      const formData = new FormData(reviewForm);
      const payload = {
        rating: Number(formData.get("rating")),
        comment: String(formData.get("comment") || "").trim(),
      };
      if (!payload.rating || !payload.comment) {
        alert("Rating and comment are required.");
        return;
      }
      try {
        const res = await fetch(action, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        });
        const data = await res.json().catch(() => null);
        if (!res.ok) {
          const msg = (data && (data.message || data.error)) || "Failed to submit review";
          throw new Error(msg);
        }
        const newCount = reviewCount + 1;
        const newAverage = (averageRating * reviewCount + payload.rating) / newCount;
        reviewCount = newCount;
        averageRating = newAverage;
        reviewsBox.dataset.reviewCount = String(reviewCount);
        reviewsBox.dataset.reviewAverage = String(averageRating);
        if (ratingBadge) {
          ratingBadge.innerHTML = `⭐ ${averageRating.toFixed(1)}/5 <span class="rating-count">(${reviewCount} reviews)</span>`;
        }
        const placeholder = reviewsBox.querySelector(".reviews-empty");
        if (placeholder) placeholder.remove();
        const item = document.createElement("li");
        item.className = "review";
        const now = new Date();
        item.innerHTML = `
          <div class="reviews-actions">
            <strong>Rating:</strong>
            <span>⭐ ${payload.rating}/5</span>
          </div>
          ${payload.comment ? `<p class="review-text">${escapeHtml(payload.comment)}</p>` : ""}
          <div class="sub">${now.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" })}</div>
        `;
        reviewsList.prepend(item);
        reviewForm.reset();
      } catch (error) {
        alert(error.message || "Failed to submit review");
      }
    });
  }

  function escapeHtml(value) {
    return value
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/\"/g, "&quot;")
      .replace(/'/g, "&#039;");
  }
})();


