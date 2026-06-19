# Headline Grader

## Installation Instructions

1. **Clone the repository and navigate to the application folder:**
   ```bash
   cd headline-grader
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up Environment Variables:**
   Create a `.env.local` file in the root of the `headline-grader` directory and add the following keys:
   ```env
   # Required to fetch live news headlines
   NEWS_API_KEY=your_newsapi_key_here

   # Required to grade headlines via the Gemini LLM
   GEMINI_API_KEY=your_gemini_api_key_here
   ```
   *Note: You can get a NewsAPI key from [newsapi.org](https://newsapi.org/) and a Gemini API key from [Google AI Studio](https://aistudio.google.com/).*

4. **Run the development server:**
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

5. **(Optional) Run the Statistical Evaluation Script:**
   To run the LLM grading engine against a curated test set to measure consistency and accuracy across Clickbait, Emotional, and Political Bias metrics:
   ```bash
   npm run evaluate
   ```
