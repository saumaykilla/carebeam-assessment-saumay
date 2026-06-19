## High level Overview

The application retrieves news headlines from NewsAPI.org and allows users to assess each headlines based upon "Clickbait", "Emotional Manipulation", and "Political Bias" metrics.

Upon the loading of the application, the top headlines are retrieved from NewsAPI.org and displayed in a searchable format where users can find headlines about specific subjects via the NewsAPI search capability.

Once a headline has been chosen for evaluation, the application takes that headline and sends it to the Gemini Flash Lite model along with the pre-defined rubric for scoring. When completed, the model provides a structured score for each evaluation kind, and a summary of how that score was determined. Each rubric provides the criteria by which a given headline would be scored for each of Clickbait, Emotional Manipulation, and Political Bias, and the scoring ranges included in the rubric establish a standard basis for each of these types of evaluations to ensure consistency.

### Development Cycle

Prior to the implementation process, I created an initial draft of the feature requirements and overall design for the application as a lightweight PRD. Additionally, I established a codebase convention and a set of rules for development, so I can maintain the consistency of the development process.

The overall development cycle consisted of the following steps:

1. Determine Feature Requirements and Evaluation Metrics
2. Create Scoring Rubrics for Each Evaluation Metric
3. Build a User Interface for Browsing and Searching Recent News
4. Implement Integration with NewsAPI and Gemini
5. Implement Structured Evaluation Logic
6. Test for Consistency and Order of Results.

## Approach

At first I worked on creating a deterministic rule based scoring system that scores how a headline uses emotional language or clickbait. I used key word lists to find lexical matching in the metrics and then applied a weighting of the various keyword scoring rules to determine a transparent way to score and explain each score using the words and patterns found within a headline.

While testing this methodology the lexical matching worked well on the obvious cases but failed on the more complex examples. Many headlines contain emotional content, bias and sensation without the use of any of the known key words and therefore resulted in a number of false negatives. This issue could be mitigated by expanding the key word lists but creating larger lists resulted in more false positives as well as increased complexity in maintaining.

I also thought of using a semantic-based search with embeddings that would capture meaning rather than just exact word match, however due to time constraints and the current capabilities of modern language models in reasoning of sensationalism as well as emotional framing, I ultimately decided to use a light LLM model like gemini-3.1-flash-lite.

In order to create a consistent output, I used a structured rubric and prompt, defining the scoring criteria for each metric. Instead of asking the model for free form analysis, the model was instructed to evaluate a headline based on predetermined scoring guidelines and return an output based on predetermined structure.

## Trade Offs

Rule-Based vs. LLM-Based Scoring

A rule-based system is easy to explain and debug — every score traces back to a specific keyword or pattern. The problem is that a lot of sensationalism and bias doesn't announce itself with obvious keywords. I kept having to expand the lists, which created more maintenance work and more false positives. It doesn't scale well.

The LLM handles ambiguous phrasing much better. The tradeoff is that outputs can vary slightly between runs and are sensitive to prompt wording. Less predictable, but more accurate where it counts.

Evaluation

There's no clean ground-truth dataset for something like "political bias" or "emotional manipulation" — reasonable people disagree on where the lines are. Rather than pretend otherwise, I focused on rubric consistency and structured outputs. Not a perfect solution, but a more honest one.

## What I Would Do Differently

**Caching.** The app currently hits NewsAPI on every load. I'd add a caching layer with a configurable TTL — headlines don't change by the minute, so serving cached results would be faster and cheaper with basically no tradeoff. I'd do the same for LLM scoring: the same headline can get evaluated multiple times right now, which means redundant calls and the occasional inconsistent score. Store the result once, look it up on repeats.

**Pagination.** Right now it fetches a fixed set of headlines and renders them all. That's fine for a demo. Before the result set gets bigger, I'd add pagination or infinite scroll — less data over the wire, better rendering performance.

**Hybrid scoring.** Running everything through the LLM works, but a lot of evaluations don't really need it. I'd look at routing clear-cut cases through deterministic rules and saving the LLM for the genuinely ambiguous ones. Cheaper, more consistent, easier to explain when something looks off.

**Evaluation.** There's no good way to tell right now whether scoring quality is holding up across rubric changes, prompt edits, or model upgrades. I'd build a labeled test set and start tracking consistency over time. Otherwise every change is a bit of a guess.

## Demo Walkthrough

[Demo](https://drive.google.com/file/d/1w9XSzDPxNICwzS94A7SkWFcYYC-UFdlo/view?usp=sharing)
