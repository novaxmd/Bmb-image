const form = document.getElementById("imageForm");
const imageContainer = document.getElementById("imageContainer");
const loading = document.getElementById("loading");
const promptInput = document.getElementById("prompt");

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  const prompt = promptInput.value.trim();

  if (!prompt) {
    alert("Please enter a description to generate an image.");
    return;
  }

  imageContainer.innerHTML = "";
  loading.style.display = "block";

  try {
    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt: prompt,
        size: "512x512",
      }),
    });

    const data = await response.json();

    if (data.data && data.data.length > 0) {
      const imageUrl = data.data[0].url;
      const img = document.createElement("img");
      img.src = imageUrl;
      img.classList.add("generated-image");
      imageContainer.appendChild(img);

      // Onyesha button ya download
      const downloadBtn = document.getElementById("downloadBtn");
      if (downloadBtn) {
        downloadBtn.style.display = "inline-block";
      }

      // Hifadhi kwenye sidebar
      const savedImagesDiv = document.getElementById("savedImages");
      if (savedImagesDiv) {
        const thumb = document.createElement("img");
        thumb.src = imageUrl;
        savedImagesDiv.prepend(thumb);
      }
    } else {
      alert("Failed to generate image. Please try again.");
    }
  } catch (error) {
    console.error("Error generating image:", error);
    alert("There was an error generating the image.");
  } finally {
    loading.style.display = "none";
  }
});

/* ===============================
   ✅ MABORESHO ULIOOMBA
   =============================== */

// Fungua / funga sidebar kupitia mistari mitatu
const menuToggle = document.getElementById("menuToggle");
const sidebar = document.getElementById("sidebar");

if (menuToggle && sidebar) {
  menuToggle.addEventListener("click", () => {
    sidebar.classList.toggle("active");
  });
}

// Download Image Button
const downloadBtn = document.getElementById("downloadBtn");

if (downloadBtn) {
  downloadBtn.addEventListener("click", () => {
    const img = imageContainer.querySelector("img");
    if (img) {
      const link = document.createElement("a");
      link.href = img.src;
      link.download = "generated_image.png";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  });
}

// Background canvas effect (moving lights)
const canvas = document.getElementById("techBackground");
if (canvas) {
  const ctx = canvas.getContext("2d");
  let w, h, particles = [];

  function resize() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
  }
  window.addEventListener("resize", resize);
  resize();

  function createParticles() {
    particles = [];
    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h,
        r: Math.random() * 2 + 1,
        dx: (Math.random() - 0.5) * 0.6,
        dy: (Math.random() - 0.5) * 0.6,
      });
    }
  }
  createParticles();

  function draw() {
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#00b4ff";
    for (let p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0 || p.x > w) p.dx *= -1;
      if (p.y < 0 || p.y > h) p.dy *= -1;
    }
    requestAnimationFrame(draw);
  }
  draw();
}
