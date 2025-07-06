// Initial quotes (or load from localStorage)
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "Believe in yourself.", category: "Motivation" },
  { text: "Stay curious.", category: "Education" },
  { text: "Take breaks.", category: "Productivity" }
];

// Store currently selected category
let selectedCategory = "all";

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Dynamically create form to add a new quote (required by school)
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

// Add a new quote
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
    populateCategories(); // Refresh dropdown with new category
  } else {
    alert("Please fill in both fields.");
  }
}

// Show a random quote (from selected category)
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

// Export quotes to JSON file
function exportToJson() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = "quotes.json";
  a.click();
  URL.revokeObjectURL(url);
}

// Import quotes from uploaded JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories(); // refresh filter dropdown
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

// Build dropdown with all unique categories
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

  // Load last selected category from localStorage
  const saved = localStorage.getItem("lastSelectedCategory");
  if (saved && categories.includes(saved)) {
    selectedCategory = saved;
    select.value = saved;
    filterQuotes(); // Apply filter on load
  }
}

// Filter quotes based on dropdown selection
function filterQuotes() {
  selectedCategory = document.getElementById("categoryFilter").value;
  localStorage.setItem("lastSelectedCategory", selectedCategory);
  showRandomQuote();
}

// On page load
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
};

// Connect Show New Quote button
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
