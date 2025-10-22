const puppeteer = require("puppeteer");
const axios = require("axios");
const fs = require("fs");
const path = require("path");

// Configuration
const BASE_URL = "https://shop.neotech.ge";
const CATEGORIES = {
  "video-cameras": {
    url: "/cctv-ka/",
    type: "video-cameras",
    description: "ვიდეო კამერები",
  },
  "access-control": {
    url: "/ka-5/",
    type: "access-control",
    description: "დაშვების სისტემები",
  },
  ezviz: {
    url: "/ezviz-ka-ka/",
    type: "ezviz",
    description: "EZVIZ - ჭკვიანი სახლი",
  },
  ajax: {
    url: "/ajax/",
    type: "ajax",
    description: "AJAX",
  },
  "monacemta-shemnaxveli": {
    url: "/storage-devices-ka/",
    type: "monacemta-shemnaxveli",
    description: "მონაცემთა შემნახველი",
  },
  "saxandzro-signalizacia": {
    url: "/ka-8/",
    type: "saxandzro-signalizacia",
    description: "სახანძრო სიგნალიზაცია",
  },
  "ukabeulo-signalizacia": {
    url: "/wireless/",
    type: "ukabeulo-signalizacia",
    description: "უკაბელო სიგნალიზაცია",
  },
  monitorebi: {
    url: "/ka-3/",
    type: "monitorebi",
    description: "მონიტორები",
  },
  "qseluri-mowyobiloba": {
    url: "/ka-9/",
    type: "qseluri-mowyobiloba",
    description: "ქსელური მოწყობილობები",
  },
  kabelebi: {
    url: "/ka-7/",
    type: "kabelebi",
    description: "კაბელები",
  },
};

const OUTPUT_DIR = path.join(__dirname, "../src/assets/data");
const IMAGES_DIR = path.join(__dirname, "../src/assets/images/data");

// Ensure directories exist
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}
if (!fs.existsSync(IMAGES_DIR)) {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });
}

// Download image helper
async function downloadImage(url, filepath) {
  try {
    const response = await axios({
      url,
      responseType: "stream",
      timeout: 30000,
    });

    const dir = path.dirname(filepath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }

    const writer = fs.createWriteStream(filepath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on("finish", resolve);
      writer.on("error", reject);
    });
  } catch (error) {
    console.error(`Failed to download image ${url}:`, error.message);
  }
}

// Clean text helper
function cleanText(text) {
  return text ? text.trim().replace(/\s+/g, " ") : "";
}

// Generate product ID from name
function generateProductId(name, index) {
  const cleaned = name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .substring(0, 50);
  return `${cleaned}-${index}`;
}

// Extract product data from product page
async function extractProductData(page, productUrl, categoryType, index) {
  try {
    console.log(`  Extracting: ${productUrl}`);
    await page.goto(productUrl, { waitUntil: "networkidle2", timeout: 30000 });

    // Wait for content to load
    await page
      .waitForSelector(".ty-product-block", { timeout: 10000 })
      .catch(() => {});

    const productData = await page.evaluate(() => {
      const data = {};

      // Extract name - try multiple selectors
      const nameSelectors = [
        "h1",
        ".ty-product-block-title",
        ".ty-mainbox-title",
        "[itemprop='name']",
      ];
      for (const selector of nameSelectors) {
        const el = document.querySelector(selector);
        if (el && el.textContent.trim()) {
          data.name = el.textContent.trim();
          break;
        }
      }

      // Extract price
      const priceSelectors = [
        ".ty-price-num",
        ".cm-reload-price",
        "[itemprop='price']",
        ".ty-price span",
      ];
      for (const selector of priceSelectors) {
        const el = document.querySelector(selector);
        if (el && el.textContent.trim()) {
          data.price = el.textContent.trim();
          break;
        }
      }

      // Extract code/SKU - look for text containing "კოდი:"
      let codeValue = "";
      const allText = document.body.innerText;
      const codeMatch = allText.match(/კოდი:\s*(\d+)/);
      if (codeMatch) {
        codeValue = codeMatch[1];
      }
      data.code = codeValue;

      // Extract availability - look for "გაყიდვაშია" text
      const bodyText = document.body.innerText;
      data.availability =
        bodyText.includes("გაყიდვაშია") || bodyText.includes("In Stock");

      // Extract description
      const descSelectors = [
        ".ty-product-block__description",
        ".ty-wysiwyg-content",
        "[itemprop='description']",
        ".ty-product-block p",
      ];
      for (const selector of descSelectors) {
        const el = document.querySelector(selector);
        if (el && el.textContent.trim()) {
          data.description = el.textContent.trim().substring(0, 200);
          break;
        }
      }

      // Extract full description
      const fullDescSelectors = [
        "#content_description",
        ".ty-product-block__description-full",
        ".product-description",
      ];
      for (const selector of fullDescSelectors) {
        const el = document.querySelector(selector);
        if (el && el.textContent.trim()) {
          data.fullDescription = el.textContent.trim();
          break;
        }
      }
      if (!data.fullDescription) {
        data.fullDescription = data.description;
      }

      // Extract specifications
      const specs = {};
      const specRows = document.querySelectorAll(
        ".ty-product-feature, .ty-features-list__item, .cm-features-list li"
      );
      specRows.forEach((row) => {
        const label = row.querySelector(
          ".ty-features-list__item-label, .ty-product-feature__label, .ty-product-feature span:first-child"
        );
        const value = row.querySelector(
          ".ty-features-list__item-value, .ty-product-feature__value, .ty-product-feature span:last-child"
        );
        if (label && value) {
          const key = label.textContent.trim().replace(":", "");
          specs[key] = value.textContent.trim();
        }
      });
      data.specifications = specs;

      // Extract images - try multiple approaches
      const images = [];

      // Try main product images
      const mainImgSelectors = [
        ".cm-image-previewer",
        ".ty-product-img img",
        ".cloud-zoom-gallery img",
        ".ty-product-main-image img",
        "[itemprop='image']",
      ];

      const imgElements = document.querySelectorAll("img");
      imgElements.forEach((img) => {
        const src =
          img.getAttribute("data-src") ||
          img.getAttribute("src") ||
          img.getAttribute("data-large-image");
        if (
          src &&
          !src.includes("placeholder") &&
          !src.includes("logo") &&
          !src.includes("icon") &&
          images.length < 5
        ) {
          // Only add if it's likely a product image (contains 'detailed' or 'thumbnails')
          if (
            src.includes("/detailed/") ||
            src.includes("/thumbnails/") ||
            src.includes("/images/")
          ) {
            if (!images.includes(src)) {
              images.push(src);
            }
          }
        }
      });

      data.images = images;

      return data;
    });

    if (!productData.name) {
      console.log(
        `  Warning: Could not extract product name from ${productUrl}`
      );
      return null;
    }

    // Generate product ID
    const productId = generateProductId(productData.name, index);

    // Download images
    const imageFolder = path.join(IMAGES_DIR, categoryType, productId);
    const downloadedImages = [];

    for (let i = 0; i < productData.images.length && i < 3; i++) {
      let imageUrl = productData.images[i];
      if (!imageUrl.startsWith("http")) {
        imageUrl = BASE_URL + imageUrl;
      }

      const ext = path.extname(imageUrl).split("?")[0] || ".jpg";
      const filename = `image${i + 1}${ext}`;
      const filepath = path.join(imageFolder, filename);

      await downloadImage(imageUrl, filepath);
      downloadedImages.push(filename);
    }

    // Format the product data
    return {
      id: productId,
      name: cleanText(productData.name),
      description:
        cleanText(productData.description) || cleanText(productData.name),
      fullDescription:
        cleanText(productData.fullDescription) ||
        cleanText(productData.description) ||
        cleanText(productData.name),
      price: productData.price || "საკონტაქტო",
      availability: productData.availability,
      specifications: productData.specifications,
    };
  } catch (error) {
    console.error(
      `  Error extracting product from ${productUrl}:`,
      error.message
    );
    return null;
  }
}

// Scrape category
async function scrapeCategory(browser, categoryKey) {
  const category = CATEGORIES[categoryKey];
  console.log(`\nScraping category: ${category.description}`);

  const page = await browser.newPage();
  await page.setViewport({ width: 1920, height: 1080 });

  const products = [];
  let pageNum = 1;
  let hasMorePages = true;

  while (hasMorePages && pageNum <= 50) {
    // Scrape up to 50 pages per category to get all products
    const categoryUrl =
      pageNum === 1
        ? `${BASE_URL}${category.url}`
        : `${BASE_URL}${category.url}?page=${pageNum}`;

    console.log(`\nPage ${pageNum}: ${categoryUrl}`);

    try {
      await page.goto(categoryUrl, {
        waitUntil: "networkidle2",
        timeout: 30000,
      });

      // Wait for products to load
      await page
        .waitForSelector(".ty-grid-list__item, .ut2-gl__item", {
          timeout: 10000,
        })
        .catch(() => {});

      // Extract product URLs from this page
      const productUrls = await page.evaluate(() => {
        const links = [];
        const productCards = document.querySelectorAll(
          ".ty-grid-list__item a.product-title, .ut2-gl__item a.product-title, a.ty-grid-list__item-name"
        );
        productCards.forEach((card) => {
          const href = card.getAttribute("href");
          if (href && !links.includes(href)) {
            links.push(href);
          }
        });
        return links;
      });

      console.log(`  Found ${productUrls.length} products on this page`);

      if (productUrls.length === 0) {
        hasMorePages = false;
        break;
      }

      // Extract data from each product
      for (let i = 0; i < productUrls.length; i++) {
        let productUrl = productUrls[i];
        if (!productUrl.startsWith("http")) {
          productUrl = BASE_URL + productUrl;
        }

        const productData = await extractProductData(
          page,
          productUrl,
          category.type,
          products.length + 1
        );
        if (productData) {
          products.push(productData);
          console.log(`  ✓ Added: ${productData.name}`);
        }

        // Small delay to avoid overwhelming the server
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      // Check if there's a next page
      const hasNextPage = await page.evaluate(() => {
        const nextButton = document.querySelector(
          ".ty-pagination__next, .cm-pagination-next"
        );
        return (
          nextButton &&
          !nextButton.classList.contains("disabled") &&
          !nextButton.classList.contains("ty-pagination__item--disabled")
        );
      });

      if (!hasNextPage) {
        hasMorePages = false;
      }

      pageNum++;
    } catch (error) {
      console.error(`Error on page ${pageNum}:`, error.message);
      hasMorePages = false;
    }
  }

  await page.close();

  // Save to JSON file
  const jsonData = {
    type: category.type,
    description: category.description,
    data: products,
  };

  const outputPath = path.join(OUTPUT_DIR, `${categoryKey}.json`);
  fs.writeFileSync(outputPath, JSON.stringify(jsonData, null, 2), "utf-8");
  console.log(`\n✓ Saved ${products.length} products to ${outputPath}`);

  return products.length;
}

// Main function
async function main() {
  console.log("Starting Neotech product scraper...\n");

  const browser = await puppeteer.launch({
    headless: "new",
    args: ["--no-sandbox", "--disable-setuid-sandbox"],
  });

  let totalProducts = 0;

  for (const categoryKey of Object.keys(CATEGORIES)) {
    const count = await scrapeCategory(browser, categoryKey);
    totalProducts += count;
  }

  await browser.close();

  console.log(
    `\n\n✓ Scraping complete! Total products extracted: ${totalProducts}`
  );
  console.log(`\nData files created in: ${OUTPUT_DIR}`);
  console.log(`Images downloaded to: ${IMAGES_DIR}`);
}

// Run the scraper
main().catch(console.error);
