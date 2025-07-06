// 🔁 Replace this with your real hosted JSON file (e.g., from GitHub)
const SERVER_URL = "https://raw.githubusercontent.com/YOUR_USERNAME/YOUR_REPO/main/quotes.json";

// ✅ Quotes from localStorage or default set
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "Believe in yourself.", category: "Motivation" },
  { text: "Stay curious.", category: "Education" },
  { text: "Take breaks.", category: "Productivity" }
];

let selectedCategory = "all";

// ✅ Save quotes to local storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// ✅ Create a form for adding new quotes
function createAddQuoteForm() {
  const textInput = document.createElement("input");
  textInput.type = "text";
  textInput.id = "newQuoteText";
  textInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.type = "text";
  categoryInput.id = "newQuoteCategory";
  categoryInput.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.onclick = addQuote;

  const formDiv = document.createElement("div");
  formDiv.appendChild(textInput);
  formDiv.appendChild(categoryInput);
  formDiv.appendChild(addButton);

  document.body.appendChild(formDiv);
}

// ✅ Add a new quote from form input
function addQuote() {
  const textInput = document.getElementById("newQuoteText");
  const categoryInput = document.getElementById("newQuoteCategory");

  const newText = textInput.value.trim();
  const newCategory = categoryInput.value.trim();

  if (newText && newCategory) {
    quotes.push({ text: newText, category: newCategory });
    saveQuotes();
    alert("Quote added successfully!");
    textInput.value = "";
    categoryInput.value = "";
    populateCategories();
  } else {
    alert("Please fill in both fields.");
  }
}

// ✅ Show a random quote from the selected category
function showRandomQuote() {
  const filtered = selectedCategory === "all"
    ? quotes
    : quotes.filter(q => q.category === selectedCategory);

  if (filtered.length > 0) {
    const quote = filtered[Math.floor(Math.random() * filtered.length)];
    document.getElementById("quoteDisplay").innerHTML = `
      <p><strong>Quote:</strong> ${quote.text}</p>
      <p><strong>Category:</strong> ${quote.category}</p>
    `;
    sessionStorage.setItem("lastQuote", JSON.stringify(quote));
  } else {
    document.getElementById("quoteDisplay").innerHTML = "<p>No quotes found.</p>";
  }
}

// ✅ Export quotes to a JSON file
function exportToJson() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// ✅ Import quotes from a JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories();
        alert("Quotes imported successfully!");
      } else {
        alert("Invalid JSON file.");
      }
    } catch (err) {
      alert("Error reading file.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// ✅ Populate category filter dropdown
function populateCategories() {
  const select = document.getElementById("categoryFilter");
  const categories = ["all", ...new Set(quotes.map(q => q.category))];

  select.innerHTML = "";
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    select.appendChild(option);
  });

  const saved = localStorage.getItem("lastSelectedCategory");
  if (saved && categories.includes(saved)) {
    selectedCategory = saved;
    select.value = saved;
    filterQuotes();
  }
}

// ✅ Update the selected category and display quotes
function filterQuotes() {
  selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("lastSelectedCategory", selectedCategory);
  showRandomQuote();
}

// ✅ Fetch quotes from server and merge with local
async function fetchQuotesFromServer() {
  try {
    const response = await fetch(SERVER_URL);
    const serverQuotes = await response.json();

    let addedCount = 0;

    serverQuotes.forEach(serverQuote => {
      const exists = quotes.some(local => local.text === serverQuote.text);
      if (!exists) {
        quotes.push(serverQuote);
        addedCount++;
      }
    });

    if (addedCount > 0) {
      saveQuotes();
      populateCategories();
      showNotification(`${addedCount} new quote(s) synced from server.`);
    }
  } catch (error) {
    showNotification("Failed to sync with server.", true);
    console.error("Server sync error:", error);
  }
}


// ✅ Show temporary notification to user
function showNotification(message, isError = false) {
  const div = document.getElementById("notification");
  div.textContent = message;
  div.style.color = isError ? "red" : "green";
  setTimeout(() => {
    div.textContent = "";
  }, 4000);
}

// ✅ Initialize on page load
window.onload = function () {
  createAddQuoteForm();
  populateCategories();

  const last = sessionStorage.getItem("lastQuote");
  if (last) {
    const quote = JSON.parse(last);
    document.getElementById("quoteDisplay").innerHTML = `
      <p><strong>Quote:</strong> ${quote.text}</p>
      <p><strong>Category:</strong> ${quote.category}</p>
    `;
  }

  // Start syncing with server
  fetchQuotesFromServer();
  setInterval(fetchQuotesFromServer, 30000);
};

// ✅ Attach click handler for "Show New Quote" button
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
