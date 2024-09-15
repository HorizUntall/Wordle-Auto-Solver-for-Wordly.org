---

# Wordly Auto Solver Chrome Extension

## Description
This Chrome extension auto-solves Wordle problems (5-letter words) specifically for [Wordly](https://wordly.org/). The extension may or may not work with other Wordle websites. On average, this extension can solve a problem in 3-4 tries.

This is a side project that I’ve been working on for the past 2 days (as of September 15).

## Usage Recommendation
For the best results, it is recommended to use this extension starting from the first attempt. The solver follows specific steps and does not record or adapt to words manually inputted by the user

## Limitations
- **Program Completion**: This extension is still WIP. However, it can pretty much do its job.
- **Word List Dependency**: This solver relies on a predefined list of words. If the word problem does not exist in the list, the solver may not be able to solve it. However, it has successfully solved most problems encountered.
- **Word Length**: Currently, this solver only handles 5-letter word problems.
- **Word Lists**: The extension includes both 2000-word and 5000-word lists. By default, it uses the 2000-word list to maximize speed.

## Installation
1. Download and unzip the folder.
2. Open Chrome.
3. Navigate to `chrome://extensions/`.
4. Enable **Developer Mode**.
5. Click **Load unpacked**.
6. Select the unzipped folder.
7. Use the extension specifically on [Wordly](https://wordly.org/).

## Optional: Using the 5000-Word List
1. Open `word.py` and change the line:
   ```python
   with open(f'{letters}_letter_words.txt') as file:
   ```
   to:
   ```python
   with open(f'{letters}_letter_words_long.txt') as file:
   ```
2. Run the Python script.

## Optional: Adding Custom Words
1. Edit the `.txt` files to include your custom words.
2. Run the Python script to update the word lists.

## Notes
- Ensure that the extension is used exclusively on Wordly to avoid issues.
- If you encounter any problems or need further assistance, please refer to the issues section of this repository.
- This is my first ever project for the sake of hobby. I am not really proficient at programming. So, please don't go hard on me, though I take criticisms. Thanks for using my program!

---

