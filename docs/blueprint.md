# **App Name**: FraudLens

## Core Features:

- Model Performance Dashboard: Display key metrics (Accuracy, Precision, Recall, F1-Score) of the fraud detection model in a clear and concise manner. Also display the confusion matrix, and the ROC curve for overall performance. Uses sample data.
- Manual Transaction Analysis: Simulate individual transactions with prediction results (Secure/Fraud) and probability scores.
- Influencing Factors Explanation: Use the fraud model as a tool. Generate explanations of why a transaction was flagged as fraudulent based on key influencing features and importance scores.
- Live Transaction Stream Simulation: Simulate a real-time feed of transaction results, displaying the latest transactions with their status, probability, and influencing factors.
- Intuitive Fraud Simulator: Enable non-technical users to interactively simulate fraud scenarios and observe real-time predictions through an interactive interface of sliders, gauges, and toggles for each simulated datapoint. Uses an overly simplistic fraud model that depends mostly on parameters controlled by sliders and toggles. 
- PowerBI Credit Card Fraud Analytics: Display various credit card analytics (e.g model comparison and geographic heatmap) via mock powerbi style interface. 

## Style Guidelines:

- Background: Very dark grey, almost black (#1A1A1A) for a sophisticated feel.
- Card/Panel Background: Slightly lighter dark grey (#2C2C2C) for contrast.
- Primary Text: Off-white (#F0F0F0) for readability against the dark background.
- Secondary/Muted Text: Light grey (#A0A0A0) for less important information.
- Primary Accent: J.P. Morgan's brand blue (#007BFF) for buttons, highlights, and charts.
- Success/Secure Color: Vibrant green (#28A745) to indicate secure transactions.
- Alert/Fraud Color: Distinct red (#DC3545) to indicate fraudulent transactions.
- Font: 'Inter' (sans-serif) for headings and body text. Headings should be bold and well-spaced, body text should be clear and readable. Note: currently only Google Fonts are supported.
- The main container should have a max-width of 1200px. Use a responsive grid system for all layouts. Elements should have consistent padding and rounded corners (8-12px border-radius).
- Use simple, professional icons related to security, finance, and data analysis.