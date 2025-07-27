# Copy-Cut – Chrome Extension

**Copy-Cut** is a lightweight and intuitive Chrome Extension that allows users to **automatically copy selected checkbox-based IDs (Cust IDs)** to the clipboard with visual feedback and live previewing.

## Features

-  **Auto-copy selected checkbox IDs**
-  **Live Preview** of selected Cust IDs
-  **Real-time toast notifications** on ID addition/removal
-  **Highlighting** of selected table rows
-  **Reset Clipboard** with one-click
-  **Keyboard Shortcut**: `Ctrl + Shift + R` to reset all
-  **Smart Cust ID detection** from table rows
-  Seamless UI integration across all web pages
-  Clean, gradient UI built with custom styles

---

## How It Works

1. Visit a page with tabular checkbox-based data.
2. Select checkboxes – the extension detects and copies **Cust IDs** automatically.
3. A notification shows what was added/removed.
4. Open the extension popup to preview selected IDs.
5. Use `Reset Clipboard` to clear everything instantly.
6. Or press `Ctrl + Shift + R` to reset via keyboard.

## Installation

1. Clone or Download this repo
2. Go to `chrome://extensions/` in your Chrome browser
3. Enable **Developer Mode**
4. Click **Load Unpacked** and select this folder
5. You’re good to go!

---

## File Structure

Copy-Cut/
│
├── manifest.json
├── popup.html
├── popup.js
├── content.js
├── icon.png


---

## Screenshots

<img width="654" height="345" alt="Screenshot 2025-07-26 091019" src="https://github.com/user-attachments/assets/273209b1-4039-46c3-9c5b-87c4902030b8" /> <img width="654" height="365" alt="Screenshot 2025-07-26 095700" src="https://github.com/user-attachments/assets/65a6c5a7-04cf-43d5-bd78-7fe396803e95" /><br>
<img width="198" height="44" alt="Screenshot 2025-07-26 095835" src="https://github.com/user-attachments/assets/9b96f2e0-7bf8-4d3b-a33a-0616cfb784f8" />
<img width="199" height="47" alt="Screenshot 2025-07-26 095810" src="https://github.com/user-attachments/assets/653fa504-acce-4c0a-820b-62c78991f54a" />
<img width="524" height="286" alt="Screenshot 2025-07-26 100032" src="https://github.com/user-attachments/assets/2ebfff96-06ba-449d-8fd8-0c9a06022e45" />
<img width="654" height="465" alt="Screenshot (10)" src="https://github.com/user-attachments/assets/621c5e39-4021-48e6-a776-16f04e68d2be" />

---

## Tech Stack

- HTML5, CSS3
- JavaScript
- Chrome Extensions API
- DOM manipulation
- Clipboard API

