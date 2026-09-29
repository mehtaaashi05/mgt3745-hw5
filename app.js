// app.js
// The page talks to the Worker instead of keeping entries in localStorage.

const API = "https://mgt3745-hw4.mgt3745-hw4.workers.dev";

const form = document.getElementById("note-form");
const input = document.getElementById("note-input");
const list = document.getElementById("note-list");
const error = document.getElementById("note-error");
const status = document.getElementById("save-status");
const emptyState = document.getElementById("empty-state");
const guideOptions = document.getElementById("guide-options");
const guideDetail = document.getElementById("guide-detail");

const businessAreas = [
  {
    id: "business-credit",
    name: "Business Credit",
    tagline: "Assessing lending risk for companies",
    summary:
      "Business Credit analysts review company financial health, industry conditions, and repayment capacity to inform lending decisions. The work combines financial analysis with judgment about business risk.",
    typicalWork: [
      "Reviewing company financial statements and borrower performance",
      "Researching industry conditions and business risks",
      "Preparing written analysis for credit decisions",
      "Working with relationship teams on lending needs",
    ],
    conversationStarters: [
      "What does a typical day look like when you evaluate a borrower?",
      "How do you balance financial analysis with judgment about a business?",
      "What surprised you about the work when you first joined the team?",
    ],
  },
  {
    id: "treasury-management",
    name: "Treasury Management",
    tagline: "Helping companies manage cash and payments",
    summary:
      "Treasury Management teams help corporate clients manage cash flow, working capital, and payments. The work can combine client advice, product setup, operations, and fraud prevention.",
    typicalWork: [
      "Discussing cash-flow needs and payment options with clients",
      "Setting up services such as ACH, wires, and cash concentration",
      "Helping resolve payment issues and fraud concerns",
      "Coordinating with operations and technology partners",
    ],
    conversationStarters: [
      "What does a typical day look like for someone supporting a corporate client?",
      "How much of the work is client advice versus operational problem-solving?",
      "What skills help someone get started in Treasury Management?",
    ],
  },
];

function appendGuideList(container, headingText, items) {
  const section = document.createElement("section");
  const heading = document.createElement("h4");
  heading.textContent = headingText;
  const list = document.createElement("ul");

  for (const item of items) {
    const listItem = document.createElement("li");
    listItem.textContent = item;
    list.append(listItem);
  }

  section.append(heading, list);
  container.append(section);
}

function showBusinessArea(area) {
  for (const option of guideOptions.querySelectorAll("button")) {
    option.setAttribute("aria-pressed", String(option.dataset.areaId === area.id));
  }

  guideDetail.replaceChildren();
  guideDetail.setAttribute("aria-label", area.name + " guide details");

  const heading = document.createElement("h3");
  heading.textContent = area.name;
  const notice = document.createElement("p");
  notice.className = "guide-notice";
  notice.textContent =
    "Illustrative summary only. Not an official role description or transfer recommendation.";
  const summary = document.createElement("p");
  summary.className = "guide-summary";
  summary.textContent = area.summary;

  guideDetail.append(heading, notice, summary);
  appendGuideList(guideDetail, "Examples of typical work", area.typicalWork);
  appendGuideList(guideDetail, "Conversation starters", area.conversationStarters);
}

for (const area of businessAreas) {
  const option = document.createElement("button");
  option.type = "button";
  option.className = "guide-option";
  option.dataset.areaId = area.id;
  option.setAttribute("aria-pressed", "false");

  const name = document.createElement("span");
  name.className = "guide-option-name";
  name.textContent = area.name;
  const tagline = document.createElement("span");
  tagline.className = "guide-option-tagline";
  tagline.textContent = area.tagline;
  option.append(name, tagline);
  option.addEventListener("click", () => showBusinessArea(area));
  guideOptions.append(option);
}

function showError(message) {
  error.textContent = message;
  status.textContent = "";
}

function clearMessages() {
  error.textContent = "";
  status.textContent = "";
}

async function loadNotes() {
  const response = await fetch(API + "/entries");
  if (!response.ok) {
    throw new Error("could not load entries");
  }
  return response.json();
}

async function saveEntry(candidate) {
  const response = await fetch(API + "/entries", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(candidate),
  });

  if (!response.ok) {
    const reason = await response.text();
    throw new Error(reason || "could not save entry");
  }
}

async function deleteEntry(id) {
  const response = await fetch(API + "/entries/" + id, { method: "DELETE" });
  if (!response.ok) {
    const reason = await response.text();
    throw new Error(reason || "could not remove entry");
  }
}

function renderEntries(notes) {
  list.replaceChildren();
  emptyState.hidden = notes.length > 0;

  for (const note of notes) {
    const item = document.createElement("li");
    const text = document.createElement("span");
    text.textContent = note.text;
    const when = document.createElement("time");
    when.textContent = note.created_at || "";
    const request = document.createElement("button");
    request.type = "button";
    request.textContent = "Request a conversation";
    request.setAttribute("aria-label", "Request a conversation with " + note.text);
    const requestConfirmation = document.createElement("span");
    requestConfirmation.setAttribute("role", "status");
    requestConfirmation.hidden = true;
    request.addEventListener("click", () => {
      request.disabled = true;
      requestConfirmation.textContent =
        "Conversation request sent. This is informational and non-committal.";
      requestConfirmation.hidden = false;
    });
    const remove = document.createElement("button");
    remove.type = "button";
    remove.textContent = "Remove";
    remove.setAttribute("aria-label", "Remove entry: " + note.text);
    remove.addEventListener("click", async () => {
      clearMessages();
      remove.disabled = true;
      try {
        await deleteEntry(note.id);
        status.textContent = "Entry removed.";
        await refresh();
      } catch (err) {
        remove.disabled = false;
        showError(err.message || "Could not remove the entry.");
      }
    });
    item.append(text, when, request, requestConfirmation, remove);
    list.append(item);
  }
}

async function refresh() {
  try {
    renderEntries(await loadNotes());
  } catch {
    showError("Could not reach the server. Try again when it is available.");
  }
}

form.addEventListener("submit", async event => {
  event.preventDefault();
  clearMessages();

  const candidate = input.value.trim();
  if (candidate.length < 1 || candidate.length > 200) {
    showError("Enter a directory entry containing 1–200 characters.");
    input.setAttribute("aria-invalid", "true");
    input.focus();
    return;
  }

  input.removeAttribute("aria-invalid");
  try {
    await saveEntry({ text: candidate });
    input.value = "";
    status.textContent = "Added to the directory.";
    await refresh();
    input.focus();
  } catch (err) {
    showError(err.message || "Could not save the entry.");
  }
});

refresh();