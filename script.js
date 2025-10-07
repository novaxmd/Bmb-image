const generateBtn = document.querySelector('.generate-btn');
const promptInput = document.getElementById('promptInput');
const imageContainer = document.getElementById('imageContainer');
const popup = document.getElementById('popup');

// Sidebar menu toggler
const menuIcon = document.querySelector('.menu-icon');
const sidebar = document.querySelector('.sidebar');

if (menuIcon && sidebar) {
  menuIcon.addEventListener('click', () => {
    sidebar.classList.toggle('active');
  });
}

// Popup message
function showPopup(message) {
  popup.textContent = message;
  popup.style.display = 'block';
  setTimeout(() => {
    popup.style.display = 'none';
  }, 3000);
}

// API 1: Pollinations
function getPollinationsImageUrl(prompt) {
  const base = "https://image.pollinations.ai/prompt/";
  const params = new URLSearchParams({
    width: 1080,
    height: 1080,
    nologo: "true",
    private: "true",
    seed: 42,
    enhance: "true",
    model: "flux-pro"
  });
  return `${base}${encodeURIComponent(prompt)}?${params.toString()}`;
}

// Generate Image
generateBtn.addEventListener('click', async () => {
  const prompt = promptInput.value.trim();
  if (!prompt) {
    showPopup("Please enter a prompt!");
    return;
  }

  imageContainer.innerHTML = `
    <div class="generating-box">
      <div class="sparkle">✨</div>
      <div class="generating-text">Generating ...</div>
      <div class="sparkle">✨</div>
    </div>
  `;

  try {
    const pollinationsUrl = getPollinationsImageUrl(prompt);
    const pollinationsResponse = await fetch(pollinationsUrl);

    if (pollinationsResponse.ok) {
      const blob = await pollinationsResponse.blob();
      const imageUrl = URL.createObjectURL(blob);

      imageContainer.innerHTML = `
        <img src="${imageUrl}" alt="Generated Image" id="generatedImage"/>
        <button class="download-btn" id="downloadBtn">⬇️ Download Image</button>
      `;

      const downloadBtn = document.getElementById('downloadBtn');
      downloadBtn.addEventListener('click', () => downloadImage(imageUrl));
      return;
    } else {
      throw new Error("Pollinations API failed.");
    }
  } catch (err) {
    console.warn("Pollinations failed:", err.message);
  }

  // Backup API: DuckMom
  try {
    const duckUrl = `https://imgen.duck.mom/prompt/${encodeURIComponent(prompt)}`;
    const response = await fetch(duckUrl);

    if (!response.ok) throw new Error("DuckMom API failed.");

    const blob = await response.blob();
    const imageUrl = URL.createObjectURL(blob);

    imageContainer.innerHTML = `
      <img src="${imageUrl}" alt="Generated Image" id="generatedImage"/>
      <button class="download-btn" id="downloadBtn">⬇️ Download Image</button>
    `;

    const downloadBtn = document.getElementById('downloadBtn');
    downloadBtn.addEventListener('click', () => downloadImage(imageUrl));
  } catch (err) {
    console.warn("DuckMom API failed:", err.message);
    imageContainer.innerHTML = "";
    showPopup("Oops! Image generation failed.");
  }
});

// Download function
function downloadImage(url) {
  const link = document.createElement('a');
  link.href = url;
  link.download = 'Bmb-Ai-Image.png';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
