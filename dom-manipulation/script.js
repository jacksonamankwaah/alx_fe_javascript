// Step 1: Create an array of quote objects
let quotes = [
    { text: "Believe in yourself.", category: "Motivation" },
    { text: "Stay curious.", category: "Education" },
    { text: "Take breaks.", category: "Productivity" }
  ];
  
  // Step 2: Function to show a random quote
  function showRandomQuote() {
    const randomIndex = Math.floor(Math.random() * quotes.length);
    const quote = quotes[randomIndex];
  
    const quoteDisplay = document.getElementById("quoteDisplay");
    quoteDisplay.innerHTML = `
      <p><strong>Quote:</strong> ${quote.text}</p>
      <p><strong>Category:</strong> ${quote.category}</p>
    `;
  }
  
  // Step 3: Add click event to the "Show New Quote" button
  document.getElementById("newQuote").addEventListener("click", showRandomQuote);
  
  // Step 4: Function to add a new quote
  function addQuote() {
    const textInput = document.getElementById("newQuoteText");
    const categoryInput = document.getElementById("newQuoteCategory");
  
    const newText = textInput.value.trim();
    const newCategory = categoryInput.value.trim();
  
    if (newText && newCategory) {
      quotes.push({ text: newText, category: newCategory });
      alert("Quote added successfully!");
      textInput.value = "";
      categoryInput.value = "";
    } else {
      alert("Please fill in both fields.");
    }
  }
  