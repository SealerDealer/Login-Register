# rm. - Hardware Diagnostic ARG 

## 1.0 Project Overview
"rm." is an interactive, browser-based Alternate Reality Game (ARG) featuring a terminal-style cyberpunk interface. Players act as agents who must register for secure access, authenticate credentials via a simulated login gate, and solve hardware-based mathematical puzzles within a locked virtual environment to escape.

This project demonstrates high proficiency in client-side scripting, focusing on DOM manipulation, state management via LocalStorage, and complex arithmetic operations.

## 2.0 Technical Implementation (Rubric Alignment)
* Static vs. Dynamic Justification: This is a dynamic application. It uses JavaScript to process user inputs, manage game states, and update the UI in real-time without page reloads.
* JavaScripting (CO2): Features a "Core Calculation Engine" that processes scientific notation (Cesium frequency data) to derive access codes.
* DOM Manipulation: Used to toggle interactive "Hint" modals and update terminal feedback dynamically.
* Multimedia Integration: Includes three distinct components: Custom SVG graphics, background ambient audio with JS controls, and interactive sound effects (SFX).
* CSS3 Excellence: Utilizes CSS Grid/Flexbox for layouts, custom Keyframe animations for CRT "flicker" effects, and Google Fonts integration.

## 3.0 Project Structure
/ (Root Folder)
├── register.html        # Entry Point: Account creation & form validation
├── login.html           # Auth Gate: LocalStorage credential verification
├── rm.html              # Gameplay: SVG environment & core logic
├── hint.html            # Documentation: Technical constants & lore
├── /styles              # Modular CSS files (register, login, rm, hint)
├── /script              # JS logic files (Authentication & Game Mechanics)
└── /Image               # Assets (SVG graphics, UI icons, Audio files)

## 4.0 Instructions for Running Locally
1.  Extract the zipped project folder to your local computer.
2.  Prerequisites: Ensure JavaScript is enabled in your web browser.
3.  Launch: For the intended experience, it is HIGHLY RECOMMENDED to open the folder in VS Code and use the "Live Server" extension, or host it on a local server like XAMPP.
4.  Flow: 
    - Create an account in the Registration Portal (register.html).
    - Login using those credentials in the Login Portal (login.html).
    - Solve the puzzle in the "rm.html" terminal using data found in "hint.html".
5.  IMPORTANT SECURITY NOTE: This application uses LocalStorage and client-side scripting. Modern browsers (Chrome/Edge) may block these features when opening files via the file://" protocol (double-clicking the HTML file). If the login or scripts do not trigger, please run the project using a Local Server (VS Code Live Server) or use Firefox.

## 5.0 Credits & References
* Typography: Share Tech Mono & Cinzel (Google Fonts).
* Development: Original work for DRC1133 Web Programming Assignment 2.
* Logic: SHA-256 implementation for secure key simulation.