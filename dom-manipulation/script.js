// Load quotes from localStorage or use defaults
let quotes = JSON.parse(localStorage.getItem("quotes")) || [
  { text: "Believe in yourself.", category: "Motivation" },
  { text: "Stay curious.", category: "Education" },
  { text: "Take breaks.", category: "Productivity" }
];

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Create the Add Quote Form dynamically
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
    populateCategories(); // Refresh category dropdown
  } else {
    alert("Please fill in both fields.");
  }
}

// Show a random quote from current filter
function showRandomQuote() {
  const selected = document.getElementById("categoryFilter").value;
  const filtered = selected === "all"
    ? quotes
    : quotes.filter(q => q.category === selected);

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

// Import quotes from JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (Array.isArray(importedQuotes)) {
        quotes.push(...importedQuotes);
        saveQuotes();
        populateCategories(); // Refresh categories
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

// Populate category dropdown
function populateCategories() {
  const select = document.getElementById("categoryFilter");
  const categories = ["all", ...new Set(quotes.map(q => q.category))];

  select.innerHTML = ""; // Clear old options
  categories.forEach(category => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    select.appendChild(option);
  });

  const savedFilter = localStorage.getItem("lastSelectedCategory");
  if (savedFilter && categories.includes(savedFilter)) {
    select.value = savedFilter;
    filterQuotes(); // show filtered quote on load
  }
}

// Filter quotes when category changes
function filterQuotes() {
  const selected = document.getElementById("categoryFilter").value;
  localStorage.setItem("lastSelectedCategory", selected);
  showRandomQuote();
}

// Run on page load
window.onload = function () {
  createAddQuoteForm();
  populateCategories();

  // Load last quote (optional)
  const last = sessionStorage.getItem("lastQuote");
  if (last) {
    const quote = JSON.parse(last);
    document.getElementById("quoteDisplay").innerHTML = `
      <p><strong>Quote:</strong> ${quote.text}</p>
      <p><strong>Category:</strong> ${quote.category}</p>
    `;
  }
};

// Link the button to show random quote
document.getElementById("newQuote").addEventListener("click", showRandomQuote);
